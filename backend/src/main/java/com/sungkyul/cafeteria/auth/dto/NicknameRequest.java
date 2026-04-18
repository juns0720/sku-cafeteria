package com.sungkyul.cafeteria.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NicknameRequest(
        @NotBlank
        @Size(min = 2, max = 12)
        String nickname
) {}
