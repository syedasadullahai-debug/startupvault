package com.startupvault.controller;

import com.startupvault.dto.MyStartupsDto;
import com.startupvault.dto.StartupDto;
import com.startupvault.dto.StartupRequest;
import com.startupvault.service.StartupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class StartupController {

    private final StartupService startupService;

    @GetMapping
    public ResponseEntity<Page<StartupDto>> getAll(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String category,
        @RequestParam(defaultValue = "newest") String sort,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size
    ) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(startupService.getAll(email, search, category, sort, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StartupDto> getById(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(startupService.getById(email, id));
    }

    @PostMapping
    public ResponseEntity<StartupDto> create(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody StartupRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(startupService.create(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StartupDto> update(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody StartupRequest request
    ) {
        return ResponseEntity.ok(startupService.update(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        startupService.delete(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<MyStartupsDto> getMyStartups(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(startupService.getMyStartups(userDetails.getUsername()));
    }
}
