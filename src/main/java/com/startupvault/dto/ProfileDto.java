package com.startupvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProfileDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String bio;
    private List<String> skills;
    private String github;
    private String linkedin;
    private String college;
    private String avatarUrl;
}
