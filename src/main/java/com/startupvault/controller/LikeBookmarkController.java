package com.startupvault.controller;

import com.startupvault.service.LikeBookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class LikeBookmarkController {

    private final LikeBookmarkService likeBookmarkService;

    @PostMapping("/api/likes/startups/{startupId}")
    public ResponseEntity<Void> like(
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        likeBookmarkService.like(userDetails.getUsername(), startupId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/likes/startups/{startupId}")
    public ResponseEntity<Void> unlike(
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        likeBookmarkService.unlike(userDetails.getUsername(), startupId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/bookmarks/startups/{startupId}")
    public ResponseEntity<Void> bookmark(
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        likeBookmarkService.bookmark(userDetails.getUsername(), startupId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/bookmarks/startups/{startupId}")
    public ResponseEntity<Void> unbookmark(
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        likeBookmarkService.unbookmark(userDetails.getUsername(), startupId);
        return ResponseEntity.ok().build();
    }
}
