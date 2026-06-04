package com.startupvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MyStartupsDto {
    private List<StartupDto> founded;
    private List<StartupDto> joined;
}
