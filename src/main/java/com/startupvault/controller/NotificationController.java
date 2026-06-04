package com.startupvault.controller;

import com.startupvault.dto.NotificationDto;
import com.startupvault.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAll(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(notificationService.getAll(userDetails.getUsername()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userDetails.getUsername()));
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllRead(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        notificationService.markAllRead(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markRead(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        notificationService.markRead(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }
}
