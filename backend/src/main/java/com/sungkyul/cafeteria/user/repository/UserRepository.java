package com.sungkyul.cafeteria.user.repository;

import com.sungkyul.cafeteria.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByGoogleId(String googleId);

    boolean existsByGoogleId(String googleId);

    /** 다른 사용자가 이미 동일 닉네임을 사용 중인지 확인 */
    boolean existsByNicknameAndIdNot(String nickname, Long id);
}
