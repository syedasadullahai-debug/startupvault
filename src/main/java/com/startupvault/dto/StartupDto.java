package com.startupvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StartupDto {
    private Long id;
    private String title;
    private String problem;
    private String solution;
    private String category;
    private List<String> requiredSkills;
    private Long founderId;
    private String founderName;
    private long memberCount;
    private long likeCount;
    private boolean likedByCurrentUser;
    private boolean bookmarkedByCurrentUser;
    private boolean isMember;
    private String applicationStatus;
    private List<MemberDto> members;
    private LocalDateTime createdAt;
}
