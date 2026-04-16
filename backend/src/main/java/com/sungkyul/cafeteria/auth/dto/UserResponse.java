package com.sungkyul.cafeteria.auth.dto;

public record UserResponse(
        Long id,
        String googleId,
        String email,
        String nickname,
        String profileImage
) {}
