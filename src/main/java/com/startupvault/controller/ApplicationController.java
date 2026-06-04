package com.startupvault.controller;

import com.startupvault.dto.ApplicationDto;
import com.startupvault.dto.ApplicationRequest;
import com.startupvault.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/startups/{startupId}")
    public ResponseEntity<ApplicationDto> apply(
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody ApplicationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(applicationService.apply(userDetails.getUsername(), startupId, request));
    }

    @GetMapping("/received")
    public ResponseEntity<List<ApplicationDto>> getReceived(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.getReceived(userDetails.getUsername()));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ApplicationDto>> getSent(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.getSent(userDetails.getUsername()));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApplicationDto> accept(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.accept(userDetails.getUsername(), id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApplicationDto> reject(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(applicationService.reject(userDetails.getUsername(), id));
    }
}
