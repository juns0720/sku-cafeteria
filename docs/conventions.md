# Conventions

## 레이어 구조

새 기능은 도메인별 패키지에 `controller` → `service` → `repository` → `entity` 순서로 추가한다. 도메인 enum/매퍼는 `<domain>/domain/` 하위에 둔다 (예: `menu/domain/Corner.java`, `user/domain/BadgeTier.java`).

## 도메인 규칙

### 리뷰
- 1인 1메뉴 1리뷰 (`uk_review_user_menu` UNIQUE — `user_id + menu_id`)
- **3축 별점 필수**: `tasteRating`, `amountRating`, `valueRating` 모두 1~5 정수 NOT NULL (`@Min(1) @Max(5)`)
- 코멘트: 최대 500자, nullable
- **사진**: `photo_urls TEXT[]` 0~3장. 각 5MB 이하, jpeg/png/webp. CHECK `array_length(photo_urls, 1) <= 3`
- 리뷰 CUD 시 `menus`의 집계 캐시(`avg_*`, `review_count`)를 트랜잭션 내에서 갱신 (`recomputeMenuStats(menuId)`)

### 메뉴
- 매주 월요일 자동 크롤링, 수동 트리거 `POST /api/v1/admin/crawl`, Cron 트리거 `POST /api/cron/crawl` (X-Cron-Secret 헤더)
- 정규화 2-테이블: `menus(name, corner)` + `menu_dates(menu_id, served_date, meal_slot)`
  - `menus` UNIQUE: `(name, corner)`
  - `menu_dates` UNIQUE: `(menu_id, served_date, meal_slot)`
- `corner`: DB는 raw String VARCHAR 유지, Java도 raw String 그대로 사용. corner→일러스트 매핑은 FE의 `coral/Thumb` 컴포넌트 안에서 정적 매핑 테이블로 처리(미매칭은 기본 아이콘 fallback). 코너 enum 매핑 없음
- `meal_slot`: 기본 `LUNCH`. DINNER는 후속 (현재 식단표가 점심만)
- `firstSeenAt`/`lastSeenAt`은 컬럼화. NEW 윈도우 = `firstSeenAt + 7일` ([archive D2](./plans/archive/ui-ux-redesign-v2/00-overview.md))

### 사용자
- **닉네임**: 2~12자, UNIQUE. **30일 쿨다운** ([archive D6](./plans/archive/ui-ux-redesign-v2/00-overview.md)) — `users.nickname_changed_at`. 미경과 시 409 with `nextChangeAt`
- `is_nickname_set=true`이면 Google 재로그인 시 nickname 덮어쓰지 않음
- `avatar_color VARCHAR(7) NOT NULL DEFAULT '#EF8A3D'`
- BadgeTier 임계값 (`BadgeTier.of(reviewCount)`): NONE(0) / 🥉 BRONZE(1~4) / 🥈 SILVER(5~29) / 🥇 GOLD(30+) ([archive D1](./plans/archive/ui-ux-redesign-v2/00-overview.md))

### 메뉴 메달 (`MenuTier.of(avgOverall, reviewCount)`)
| 메달 | 평균 | 리뷰 수 |
|---|---|---|
| 🥇 GOLD | ≥ 4.5 | ≥ 20 |
| 🥈 SILVER | ≥ 4.0 | ≥ 10 |
| 🥉 BRONZE | ≥ 3.5 | ≥ 5 |

## 엔티티 수정 패턴

엔티티는 setter를 사용하지 않는다. 필드 변경이 필요한 경우 의미 있는 메서드를 엔티티에 추가한다.

```java
// Review.java 예시
public void update(int taste, int amount, int value, String comment, List<String> photoUrls) {
    this.tasteRating = taste;
    this.amountRating = amount;
    this.valueRating = value;
    this.comment = comment;
    this.photoUrls = photoUrls;
}
```

## 응답 코드 규칙

| 상황 | 코드 |
|---|---|
| 조회 성공 | 200 OK |
| 생성 성공 | 201 Created (Location 헤더 포함) |
| 삭제 성공 | 204 No Content |
| 잘못된 요청값 | 400 Bad Request (`IllegalArgumentException`, `MethodArgumentNotValidException`) |
| 인증 누락 | 401 Unauthorized |
| 권한 부족 | 403 Forbidden (`AccessDeniedException`) — 본인 리뷰 아닌 것 수정/삭제 등 |
| 리소스 없음 | 404 Not Found (`EntityNotFoundException`) |
| 충돌 | 409 Conflict (`IllegalStateException`) — 닉네임 중복/쿨다운, 1인 1메뉴 1리뷰 위반 등 |

## 마이그레이션 규칙 (Expand-Contract)

DB 컬럼 변경은 3단계 무중단 패턴을 따른다:

1. **Expand**: 새 컬럼/필드를 nullable 또는 기본값으로 추가, 백필
2. **Migrate**: BE 응답에 신규 필드 노출(기존 필드 유지) → FE 전환
3. **Contract**: FE 전환 완료 후 BE에서 기존 컬럼 DROP

예: `image_url` → `photo_urls` 전환 ([archive D7](./plans/archive/ui-ux-redesign-v2/00-overview.md))
- V10에서 `photo_urls TEXT[]` 추가 + 백필
- BE는 `imageUrl` 입력을 `photoUrls`로 wrap (호환), 응답에 둘 다 노출
- FE가 `photoUrls`만 사용하도록 전환
- V11에서 `image_url` DROP (롤백 불가, prod DB 스냅샷 필수)

## 프론트 컴포넌트 디렉토리

- 신규 v3 Coral 컴포넌트는 **`frontend/src/components/coral/`** 하위에 둔다
- `frontend/src/components/hi/`는 v2(종이/잉크 톤), `frontend/src/components/`는 v1 — Phase v3-3 [`V3-T17`](./plans/coral-redesign/03-phase-3-cleanup.md) / [`V3-T18`](./plans/coral-redesign/03-phase-3-cleanup.md)에서 일괄 삭제
- `position: fixed` UI(모달 등)는 `createPortal(…, document.body)` 사용 — transform 조상의 stacking context 우회

## 작업 단위 / 커밋

- 한 번에 하나의 단위(예: V3-T9)만 구현하고 단위 ID를 커밋 메시지에 포함: `feat(V3-T9): rewrite HomePage with coral`
- 단위 완료 시 [`docs/plans/coral-redesign/99-progress.md`](./plans/coral-redesign/99-progress.md)의 체크박스 업데이트
- BE는 단위 테스트 + Postman 스모크, FE는 375 / 768 / 1280 뷰포트 시각 확인
- `git commit` / `git push`는 사용자가 직접 (Claude는 커밋하지 않음)
