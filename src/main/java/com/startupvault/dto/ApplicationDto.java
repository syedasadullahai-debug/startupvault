package com.startupvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApplicationDto {
    private Long id;
    private Long startupId;
    private String startupTitle;
    private Long applicantId;
    private String applicantName;
    private String founderName;
    private String coverLetter;
    private String status;
    private LocalDateTime createdAt;
}
