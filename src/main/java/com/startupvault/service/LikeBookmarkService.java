package com.startupvault.service;

import com.startupvault.entity.*;
import com.startupvault.exception.ApiException;
import com.startupvault.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeBookmarkService {

    private final LikeRepository likeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final StartupRepository startupRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void like(String email, Long startupId) {
        User user = getUser(email);
        Startup startup = getStartup(startupId);
        if (likeRepository.existsByStartupAndUser(startup, user)) {
            throw ApiException.conflict("Already liked");
        }
        likeRepository.save(Like.builder().startup(startup).user(user).build());

        // Notify founder (not if liking own startup)
        if (!startup.getFounder().getId().equals(user.getId())) {
            notificationService.create(
                startup.getFounder(),
                user.getName() + " liked your startup: " + startup.getTitle(),
                Notification.NotificationType.STARTUP_LIKED
            );
        }
    }

    @Transactional
    public void unlike(String email, Long startupId) {
        User user = getUser(email);
        Startup startup = getStartup(startupId);
        likeRepository.findByStartupAndUser(startup, user)
            .ifPresent(likeRepository::delete);
    }

    @Transactional
    public void bookmark(String email, Long startupId) {
        User user = getUser(email);
        Startup startup = getStartup(startupId);
        if (bookmarkRepository.existsByStartupAndUser(startup, user)) {
            throw ApiException.conflict("Already bookmarked");
        }
        bookmarkRepository.save(Bookmark.builder().startup(startup).user(user).build());
    }

    @Transactional
    public void unbookmark(String email, Long startupId) {
        User user = getUser(email);
        Startup startup = getStartup(startupId);
        bookmarkRepository.findByStartupAndUser(startup, user)
            .ifPresent(bookmarkRepository::delete);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.notFound("User not found"));
    }

    private Startup getStartup(Long id) {
        return startupRepository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Startup not found"));
    }
}
