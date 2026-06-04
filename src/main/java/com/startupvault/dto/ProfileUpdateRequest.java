package com.startupvault.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfileUpdateRequest {
    private String bio;
    private List<String> skills;
    private String github;
    private String linkedin;
    private String college;
}
