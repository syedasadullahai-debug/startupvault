package com.startupvault.service;

import com.startupvault.dto.ProfileDto;
import com.startupvault.dto.ProfileUpdateRequest;
import com.startupvault.entity.Profile;
import com.startupvault.entity.User;
import com.startupvault.exception.ApiException;
import com.startupvault.repository.ProfileRepository;
import com.startupvault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.notFound("User not found"));
        Profile profile = profileRepository.findByUser(user)
            .orElseGet(() -> profileRepository.save(Profile.builder().user(user).build()));
        return toDto(profile, user);
    }

    @Transactional
    public ProfileDto updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.notFound("User not found"));
        Profile profile = profileRepository.findByUser(user)
            .orElseGet(() -> Profile.builder().user(user).build());

        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getGithub() != null) profile.setGithub(request.getGithub());
        if (request.getLinkedin() != null) profile.setLinkedin(request.getLinkedin());
        if (request.getCollege() != null) profile.setCollege(request.getCollege());

        profile = profileRepository.save(profile);
        return toDto(profile, user);
    }

    private ProfileDto toDto(Profile profile, User user) {
        return ProfileDto.builder()
            .id(profile.getId())
            .userId(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .bio(profile.getBio())
            .skills(profile.getSkills())
            .github(profile.getGithub())
            .linkedin(profile.getLinkedin())
            .college(profile.getCollege())
            .avatarUrl(profile.getAvatarUrl())
            .build();
    }
}
