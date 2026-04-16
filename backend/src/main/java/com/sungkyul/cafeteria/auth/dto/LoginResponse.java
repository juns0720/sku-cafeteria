package com.sungkyul.cafeteria.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        Long userId,
        String nickname,
        String email,
        String profileImage
) {}
