package com.startupvault.service;

import com.startupvault.dto.NotificationDto;
import com.startupvault.entity.Notification;
import com.startupvault.entity.User;
import com.startupvault.exception.ApiException;
import com.startupvault.repository.NotificationRepository;
import com.startupvault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void create(User user, String message, Notification.NotificationType type) {
        Notification notification = Notification.builder()
            .user(user)
            .message(message)
            .type(type)
            .read(false)
            .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getAll(String email) {
        User user = getUser(email);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
            .stream().map(this::toDto).toList();
    }

    public Map<String, Long> getUnreadCount(String email) {
        User user = getUser(email);
        long count = notificationRepository.countByUserAndReadFalse(user);
        return Map.of("count", count);
    }

    @Transactional
    public void markAllRead(String email) {
        User user = getUser(email);
        notificationRepository.markAllReadByUser(user);
    }

    @Transactional
    public void markRead(String email, Long id) {
        User user = getUser(email);
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw ApiException.forbidden("Not your notification");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
            .id(n.getId())
            .message(n.getMessage())
            .type(n.getType().name())
            .read(n.isRead())
            .createdAt(n.getCreatedAt())
            .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.notFound("User not found"));
    }
}
