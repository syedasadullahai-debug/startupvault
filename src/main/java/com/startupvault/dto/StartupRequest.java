package com.startupvault.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class StartupRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Problem is required")
    private String problem;

    @NotBlank(message = "Solution is required")
    private String solution;

    @NotBlank(message = "Category is required")
    private String category;

    private List<String> requiredSkills;
}
