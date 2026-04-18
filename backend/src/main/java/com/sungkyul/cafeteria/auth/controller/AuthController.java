package com.sungkyul.cafeteria.auth.controller;

import com.sungkyul.cafeteria.auth.dto.LoginRequest;
import com.sungkyul.cafeteria.auth.dto.LoginResponse;
import com.sungkyul.cafeteria.auth.dto.NicknameRequest;
import com.sungkyul.cafeteria.auth.dto.UserResponse;
import com.sungkyul.cafeteria.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Google idToken 검증 후 JWT 발급 */
    @PostMapping("/google")
    public ResponseEntity<LoginResponse> googleLogin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request.idToken()));
    }

    /** 현재 인증된 사용자 정보 조회 */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(authService.getMe(userId));
    }

    /** 커스텀 닉네임 설정 */
    @PatchMapping("/me/nickname")
    public ResponseEntity<Void> updateNickname(
            @Valid @RequestBody NicknameRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        authService.updateNickname(userId, request.customNickname());
        return ResponseEntity.ok().build();
    }
}
