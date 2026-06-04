package com.startupvault.controller;

import com.startupvault.dto.ProfileDto;
import com.startupvault.dto.ProfileUpdateRequest;
import com.startupvault.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.getProfile(userDetails.getUsername()));
    }

    @PutMapping
    public ResponseEntity<ProfileDto> updateProfile(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody ProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(profileService.updateProfile(userDetails.getUsername(), request));
    }
}
