# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

성결대학교 학식 리뷰 앱의 백엔드 서버.
- **Stack**: Spring Boot 3.5 / Java 17 / Gradle 8.14 / PostgreSQL
- **Deployment**: Railway (backend), Vercel (frontend)
- **Auth**: Google OAuth2 idToken 검증 + JWT (구현 완료)

## Commands

모든 Gradle 명령은 `backend/` 디렉토리에서 실행한다.

```bash
# 개발 서버 실행 (dev 프로파일)
./gradlew bootRun

# 프로파일 지정 실행
./gradlew bootRun --args='--spring.profiles.active=prod'

# 빌드 (테스트 포함)
./gradlew build

# 빌드 (테스트 제외)
./gradlew build -x test

# 전체 테스트
./gradlew test

# 단일 테스트 클래스 실행
./gradlew test --tests "com.sungkyul.cafeteria.SomeTest"

# 단일 테스트 메서드 실행
./gradlew test --tests "com.sungkyul.cafeteria.SomeTest.methodName"

# 컴파일만 확인
./gradlew compileJava
```

## Architecture

### Package Structure

```
com.sungkyul.cafeteria
├── CafeteriaApplication.java
├── common/
│   ├── config/
│   │   ├── AppConfig.java          # RestTemplate 빈
│   │   └── SecurityConfig.java     # Security + CORS + JwtAuthFilter 등록
│   ├── controller/HealthController.java  # GET /api/v1/health
│   └── exception/
│       ├── ErrorResponse.java      # 공통 에러 응답 record
│       └── GlobalExceptionHandler.java   # @RestControllerAdvice
├── auth/                           # 인증 도메인 (STEP3 완료)
│   ├── controller/AuthController.java
│   ├── dto/LoginRequest.java, LoginResponse.java, UserResponse.java
│   ├── jwt/JwtProvider.java, JwtAuthFilter.java
│   └── service/AuthService.java
├── user/
│   ├── entity/User.java
│   └── repository/UserRepository.java
├── menu/
│   ├── entity/Menu.java
│   └── repository/MenuRepository.java
└── review/
    ├── entity/Review.java
    └── repository/ReviewRepository.java
```

새 기능은 도메인별 패키지에 `controller` → `service` → `repository` → `entity` 레이어로 추가한다.

### API Convention

- 모든 엔드포인트 prefix: `/api/v1/`
- 에러 응답은 반드시 `ErrorResponse` record 형식 사용 (`GlobalExceptionHandler`가 자동 처리)
- 새로운 예외 타입이 필요하면 `GlobalExceptionHandler`에 `@ExceptionHandler` 추가

### Auth Flow

1. 프론트에서 Google 로그인 후 `idToken`을 `POST /api/v1/auth/google`로 전송
2. `AuthService.verifyGoogleToken()` → `https://oauth2.googleapis.com/tokeninfo?id_token=` 호출로 검증
3. `User` upsert (googleId로 조회 → 없으면 `save`, 있으면 `user.updateProfile()`)
4. `JwtProvider`로 accessToken / refreshToken 발급 → `LoginResponse` 반환
5. 이후 요청은 `Authorization: Bearer {accessToken}` 헤더로 인증
6. `JwtAuthFilter` → 토큰 유효 시 `SecurityContextHolder`에 userId(Long) 저장
7. `GET /api/v1/auth/me` → `Authentication.getPrincipal()`에서 userId 추출

### Security 인가 규칙

`SecurityConfig.filterChain()`에 정의된 현재 규칙:

| 경로 | 메서드 | 인증 |
|------|--------|------|
| `/api/v1/auth/google` | POST | permitAll |
| `/api/v1/health` | GET | permitAll |
| `/api/v1/menus/**` | GET | permitAll |
| `/api/v1/reviews/**` | GET | permitAll |
| 나머지 | * | authenticated |

JWT 없는 authenticated 요청은 `AuthenticationEntryPoint`가 401 반환.
CORS 허용 오리진은 `SecurityConfig.corsConfigurationSource()`에서 관리한다. 배포 시 Vercel 도메인을 추가해야 한다.

### Domain Rules

- **리뷰**: 1인 1메뉴 1리뷰 (`uk_review_user_menu` UNIQUE 제약 — `user_id + menu_id`)
- **별점**: 1~5점 정수 (`@Min(1) @Max(5)`)
- **코멘트**: 최대 500자, nullable (별점만 남길 수 있음)
- **메뉴**: 매주 월요일 자동 크롤링, 수동 트리거 API 별도 제공 예정
  - 중복 방지 UNIQUE 제약: `uk_menu_name_corner_date` (`name + corner + served_date`)

### Configuration Profiles

| 프로파일 | 용도 | ddl-auto | 활성화 방법 |
|---------|------|----------|------------|
| `dev` (기본) | 로컬 개발 | `update` | 기본값 |
| `prod` | Railway 배포 | `validate` | `SPRING_PROFILES_ACTIVE=prod` |

prod 프로파일의 DB 연결 정보는 환경변수 `SPRING_DATASOURCE_URL` / `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`로 주입한다.
JWT 시크릿은 환경변수 `JWT_SECRET`으로 주입한다 (기본값: dev용 임시 키).

## Current Progress

- [x] STEP1: 프로젝트 초기 셋업 (HealthController, SecurityConfig, GlobalExceptionHandler)
- [x] STEP2: DB 스키마 및 Entity (User, Menu, Review + Repository)
- [x] STEP3: Google OAuth2 + JWT 로그인
- [ ] STEP4: 학식 크롤러
- [ ] STEP5: 메뉴 조회 API
- [ ] STEP6: 리뷰 CRUD API

## Known Issues / TODO
- [ ] RefreshToken 관리 미구현 (현재 발급만 하고 저장 안 함)
  → 백엔드 완료 후 Redis로 구현 예정
  → Upstash Redis 무료 플랜 사용 예정 (10,000 req/일)