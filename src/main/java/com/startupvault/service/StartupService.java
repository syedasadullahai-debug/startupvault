package com.startupvault.service;

import com.startupvault.dto.MemberDto;
import com.startupvault.dto.MyStartupsDto;
import com.startupvault.dto.StartupDto;
import com.startupvault.dto.StartupRequest;
import com.startupvault.entity.*;
import com.startupvault.exception.ApiException;
import com.startupvault.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StartupService {

    private final StartupRepository startupRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final StartupMemberRepository memberRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public StartupDto create(String email, StartupRequest request) {
        User user = getUser(email);
        Startup startup = Startup.builder()
            .title(request.getTitle())
            .problem(request.getProblem())
            .solution(request.getSolution())
            .category(request.getCategory())
            .requiredSkills(request.getRequiredSkills() != null ? request.getRequiredSkills() : List.of())
            .founder(user)
            .build();
        startup = startupRepository.save(startup);
        return toDto(startup, user, false, false, false, null);
    }

    @Transactional(readOnly = true)
    public Page<StartupDto> getAll(String email, String search, String category, String sort, int page, int size) {
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        Sort sortOrder = switch (sort != null ? sort : "newest") {
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            case "most_liked" -> Sort.by(Sort.Direction.DESC, "createdAt"); // fallback, computed separately
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        String searchParam = (search != null && !search.isBlank()) ? search : null;
        String categoryParam = (category != null && !category.isBlank()) ? category : null;

        Page<Startup> startupPage = startupRepository.searchStartups(searchParam, categoryParam, pageable);

        List<StartupDto> dtos = startupPage.getContent().stream()
            .map(s -> {
                boolean liked = currentUser != null && likeRepository.existsByStartupAndUser(s, currentUser);
                boolean bookmarked = currentUser != null && bookmarkRepository.existsByStartupAndUser(s, currentUser);
                boolean isMember = currentUser != null && memberRepository.existsByStartupAndUser(s, currentUser);
                String appStatus = null;
                if (currentUser != null) {
                    var app = applicationRepository.findByStartupAndApplicant(s, currentUser);
                    appStatus = app.map(a -> a.getStatus().name()).orElse(null);
                }
                return toDto(s, currentUser, liked, bookmarked, isMember, appStatus);
            })
            .toList();

        return new PageImpl<>(dtos, pageable, startupPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public StartupDto getById(String email, Long id) {
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        Startup startup = findStartup(id);
        boolean liked = currentUser != null && likeRepository.existsByStartupAndUser(startup, currentUser);
        boolean bookmarked = currentUser != null && bookmarkRepository.existsByStartupAndUser(startup, currentUser);
        boolean isMember = currentUser != null && memberRepository.existsByStartupAndUser(startup, currentUser);
        String appStatus = null;
        if (currentUser != null) {
            var app = applicationRepository.findByStartupAndApplicant(startup, currentUser);
            appStatus = app.map(a -> a.getStatus().name()).orElse(null);
        }
        return toDto(startup, currentUser, liked, bookmarked, isMember, appStatus);
    }

    @Transactional
    public StartupDto update(String email, Long id, StartupRequest request) {
        User user = getUser(email);
        Startup startup = findStartup(id);
        if (!startup.getFounder().getId().equals(user.getId())) {
            throw ApiException.forbidden("Only the founder can update this startup");
        }
        startup.setTitle(request.getTitle());
        startup.setProblem(request.getProblem());
        startup.setSolution(request.getSolution());
        startup.setCategory(request.getCategory());
        if (request.getRequiredSkills() != null) startup.setRequiredSkills(request.getRequiredSkills());
        startup = startupRepository.save(startup);
        return toDto(startup, user, false, false, false, null);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @startupService.isFounder(#email, #id)")
    public void delete(String email, Long id) {
        Startup startup = findStartup(id);
        User user = getUser(email);
        if (!startup.getFounder().getId().equals(user.getId()) &&
            !user.getRole().equals(User.Role.ROLE_ADMIN)) {
            throw ApiException.forbidden("Not authorized to delete this startup");
        }
        startupRepository.delete(startup);
    }

    public boolean isFounder(String email, Long startupId) {
        User user = getUser(email);
        Startup startup = findStartup(startupId);
        return startup.getFounder().getId().equals(user.getId());
    }

    @Transactional(readOnly = true)
    public MyStartupsDto getMyStartups(String email) {
        User user = getUser(email);
        List<StartupDto> founded = startupRepository.findByFounder(user).stream()
            .map(s -> toDto(s, user, false, false, false, null))
            .toList();
        List<StartupDto> joined = startupRepository.findJoinedStartups(user).stream()
            .map(s -> toDto(s, user, false, false, true, "APPROVED"))
            .toList();
        return new MyStartupsDto(founded, joined);
    }

    private StartupDto toDto(Startup s, User currentUser, boolean liked,
                              boolean bookmarked, boolean isMember, String appStatus) {
        long likeCount = likeRepository.countByStartup(s);
        List<StartupMember> members = memberRepository.findByStartup(s);
        List<MemberDto> memberDtos = members.stream()
            .map(m -> new MemberDto(m.getUser().getId(), m.getUser().getName()))
            .toList();

        return StartupDto.builder()
            .id(s.getId())
            .title(s.getTitle())
            .problem(s.getProblem())
            .solution(s.getSolution())
            .category(s.getCategory())
            .requiredSkills(s.getRequiredSkills())
            .founderId(s.getFounder().getId())
            .founderName(s.getFounder().getName())
            .memberCount(members.size())
            .likeCount(likeCount)
            .likedByCurrentUser(liked)
            .bookmarkedByCurrentUser(bookmarked)
            .isMember(isMember)
            .applicationStatus(appStatus)
            .members(memberDtos)
            .createdAt(s.getCreatedAt())
            .build();
    }

    private Startup findStartup(Long id) {
        return startupRepository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Startup not found"));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.notFound("User not found"));
    }
}
