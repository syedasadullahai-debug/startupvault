package com.startupvault.service;

import com.startupvault.dto.ApplicationDto;
import com.startupvault.dto.ApplicationRequest;
import com.startupvault.entity.*;
import com.startupvault.exception.ApiException;
import com.startupvault.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private static final int MAX_JOINED_STARTUPS = 2;

    private final ApplicationRepository applicationRepository;
    private final StartupRepository startupRepository;
    private final UserRepository userRepository;
    private final StartupMemberRepository memberRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationDto apply(String email, Long startupId, ApplicationRequest request) {
        User applicant = getUser(email);
        Startup startup = findStartup(startupId);

        // Cannot apply to own startup
        if (startup.getFounder().getId().equals(applicant.getId())) {
            throw ApiException.badRequest("You cannot apply to your own startup");
        }

        // Check duplicate application
        if (applicationRepository.existsByStartupAndApplicant(startup, applicant)) {
            throw ApiException.conflict("You have already applied to this startup");
        }

        // Check membership limit
        long joinedCount = memberRepository.countByUser(applicant);
        if (joinedCount >= MAX_JOINED_STARTUPS) {
            throw ApiException.badRequest("You have reached the maximum number of joined startups (" + MAX_JOINED_STARTUPS + ")");
        }

        Application application = Application.builder()
            .startup(startup)
            .applicant(applicant)
            .coverLetter(request.getCoverLetter())
            .status(Application.ApplicationStatus.PENDING)
            .build();
        application = applicationRepository.save(application);

        // Notify founder
        notificationService.create(
            startup.getFounder(),
            applicant.getName() + " applied to join " + startup.getTitle(),
            Notification.NotificationType.APPLICATION_RECEIVED
        );

        return toDto(application);
    }

    @Transactional
    public ApplicationDto accept(String email, Long applicationId) {
        User founder = getUser(email);
        Application application = findApplication(applicationId);

        if (!application.getStartup().getFounder().getId().equals(founder.getId())) {
            throw ApiException.forbidden("Only the founder can accept applications");
        }

        if (application.getStatus() != Application.ApplicationStatus.PENDING) {
            throw ApiException.badRequest("Application is no longer pending");
        }

        // Check applicant's membership limit before accepting
        long joinedCount = memberRepository.countByUser(application.getApplicant());
        if (joinedCount >= MAX_JOINED_STARTUPS) {
            throw ApiException.badRequest("Applicant has reached the membership limit");
        }

        application.setStatus(Application.ApplicationStatus.APPROVED);
        applicationRepository.save(application);

        // Create membership
        if (!memberRepository.existsByStartupAndUser(application.getStartup(), application.getApplicant())) {
            StartupMember member = StartupMember.builder()
                .startup(application.getStartup())
                .user(application.getApplicant())
                .build();
            memberRepository.save(member);
        }

        // Notify applicant
        notificationService.create(
            application.getApplicant(),
            "Your application to " + application.getStartup().getTitle() + " was accepted!",
            Notification.NotificationType.APPLICATION_ACCEPTED
        );

        return toDto(application);
    }

    @Transactional
    public ApplicationDto reject(String email, Long applicationId) {
        User founder = getUser(email);
        Application application = findApplication(applicationId);

        if (!application.getStartup().getFounder().getId().equals(founder.getId())) {
            throw ApiException.forbidden("Only the founder can reject applications");
        }

        if (application.getStatus() != Application.ApplicationStatus.PENDING) {
            throw ApiException.badRequest("Application is no longer pending");
        }

        application.setStatus(Application.ApplicationStatus.REJECTED);
        applicationRepository.save(application);

        // Notify applicant
        notificationService.create(
            application.getApplicant(),
            "Your application to " + application.getStartup().getTitle() + " was not accepted.",
            Notification.NotificationType.APPLICATION_REJECTED
        );

        return toDto(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getReceived(String email) {
        User founder = getUser(email);
        return applicationRepository.findReceivedApplications(founder)
            .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getSent(String email) {
        User applicant = getUser(email);
        return applicationRepository.findByApplicant(applicant)
            .stream().map(this::toDto).toList();
    }

    private ApplicationDto toDto(Application a) {
        return ApplicationDto.builder()
            .id(a.getId())
            .startupId(a.getStartup().getId())
            .startupTitle(a.getStartup().getTitle())
            .applicantId(a.getApplicant().getId())
            .applicantName(a.getApplicant().getName())
            .founderName(a.getStartup().getFounder().getName())
            .coverLetter(a.getCoverLetter())
            .status(a.getStatus().name())
            .createdAt(a.getCreatedAt())
            .build();
    }

    private Application findApplication(Long id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Application not found"));
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
