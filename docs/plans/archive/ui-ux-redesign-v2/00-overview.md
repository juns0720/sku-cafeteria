# UI/UX 전면 개편 — Overview

> **역할**: 이 플랜의 결정 사항·의존성·배포 전략을 기록한다. 변하지 않는 설계 기준.
> **변함**: 진행 상태는 [`99-progress.md`](./99-progress.md), 실행 명세는 `01-phase-1-db.md` … `06-phase-d-photo.md`.

---

## Context

기존 3탭 구조는 탭 간 역할이 겹쳤고, 단일 별점은 신빙성이 약했으며, 사용자 정체성이 드러나지 않았다. 2026-04-18 v2 방향을 확정했고, 2026-04-19 디자인 핸드오프(`design_handoff_full_revamp/`)가 도착하면서 **시각 시스템까지 전면 교체**하기로 결정했다(v1 Zomato 레드 → v2 종이/잉크 톤).

핵심 변화:
- **4탭** (홈·주간·전체·프로필)
- **3축 별점**(맛·양·가성비) + 사진 다중 첨부
- **메뉴 메달**(🥇/🥈/🥉) + **사용자 뱃지**(BadgeTier)
- **코너 enum**(KOREAN/WESTERN/SNACK/SPECIAL) + **MealSlot**(LUNCH/DINNER)
- **집계 캐시** 컬럼(`avg_taste/amount/value/overall`, `review_count`) — 리뷰 CUD 트리거로 갱신
- **닉네임 30일 쿨다운** 정책

---

## 확정된 결정 (D1~D8)

| # | 항목 | 결정 | 근거 |
|---|---|---|---|
| D1 | 사용자 BadgeTier | NONE(0) / 🥉 BRONZE(1~4) / 🥈 SILVER(5~29) / 🥇 GOLD(30+) | 디자인 핸드오프 채택 |
| D2 | NEW 윈도우 | `Menu.firstSeenAt + 7일` 이내 | 디자인 핸드오프 채택 |
| D3 | `/menus/best` 사양 | 이번 주(월~일) 제공 + 리뷰 ≥ 3 + 평균 desc, **TOP 5** | 디자인 TOP5 + 신뢰도 하한 절충 |
| D4 | `Menu.corner` 타입 | DB는 **VARCHAR 유지**, Java도 raw String 그대로 사용. `GET /menus/corners`는 DB `DISTINCT corner` 반환. enum 매핑 없음 | 크롤링 소스 변경 시 코드 수정 없이 자동 대응, 필터링은 raw String 비교로 충분 |
| D5 | MealSlot | `menu_dates.meal_slot` 컬럼 신설, 기본 `LUNCH`. DINNER는 후속 (크롤러 미지원) | 식단표가 현재 점심만 |
| D6 | 닉네임 변경 정책 | **30일 쿨다운**. `users.nickname_changed_at` 컬럼 + 미경과 시 409 with `nextChangeAt` | 정체성 안정성 |
| D7 | `image_url` → `photo_urls` 전환 | **3단계 expand-contract**: V10에서 `photo_urls TEXT[]` 추가 + 백필 → FE/BE 양쪽 전환 → V11에서 `image_url` DROP | 무중단 |
| D8 | 디자인 시스템 문서 | 새 v2를 [`docs/DESIGN.md`](../../DESIGN.md)에 덮어쓰기. 기존은 [`docs/archive/DESIGN-v1.md`](../../archive/DESIGN-v1.md) | 진실 1곳 |

---

## 추가 결정 (변경 없음)

| 항목 | 결정 |
|---|---|
| 탭 구조 | 홈 / 주간 / 전체 / 프로필 (4탭) |
| 이미지 저장소 | Cloudinary 무료 25GB |
| 별점 스키마 | 3축 1~5 정수, NOT NULL (V6 적용 완료) |
| DB 마이그레이션 | Flyway (V1~V7 적용 완료, V8~V11 신규) |
| 메뉴 스키마 | `menus(name, corner)` + `menu_dates(menu_id, served_date)` 정규화 |

---

## 메뉴 메달 (D3 관련, 신규)

`MenuTier.of(avgOverall, reviewCount)`:

| 메달 | 평균 별점 | 리뷰 수 |
|---|---|---|
| 🥇 GOLD | ≥ 4.5 | ≥ 20 |
| 🥈 SILVER | ≥ 4.0 | ≥ 10 |
| 🥉 BRONZE | ≥ 3.5 | ≥ 5 |
| 없음 | 그 외 | 그 외 |

---

## 설계 드리프트 기록

### 1) 닉네임 2-필드 → 단일 필드 (V3 → V4, 완료)

- 초기: `customNickname` + `nickname` 2-필드. 현재: `nickname` 단일 + `isNicknameSet`. Google 재로그인 시 `isNicknameSet=false`일 때만 nickname을 덮어씀.
- 마이그레이션 역사(V3 추가 → V4 drop)는 그대로 보존.

### 2) Menu 스키마 2-테이블 정규화 (BE-A-0, V2, 완료)

- 초기: `menus(name, corner, served_date)` 단일 테이블.
- 현재: `menus(name, corner)` + `menu_dates(menu_id, served_date)`. 동일 (name, corner)는 1 Menu.
- 효과: 리뷰가 Menu에 1:N 고정. `MIN(menu_dates.served_date)`로 최초 등장일 파생.

### 3) v3 디자인 시스템 전환 (2026-04-19, 신규)

- 기존 v1: Zomato 레드 + Pretendard/DM Serif (`docs/archive/DESIGN-v1.md`).
- 신규 v2: 종이/잉크 톤 + Gaegu/Jua (Google Fonts). 14종 자체 SVG `Icon` 컴포넌트로 lucide-react 의존성 제거.
- 컴포넌트는 `frontend/src/components/hi/` 하위에 점진 구축, 페이지 단위로 교체.

### 4) `firstSeenAt` 파생 → 명시 컬럼 (Phase 1 신규)

- v1: `MIN(menu_dates.served_date)` 파생.
- v2: `menus.first_seen_at` / `last_seen_at` 컬럼 + 백필. 이유 — 집계 캐시(`avg_*`, `review_count`)와 함께 단일 SELECT로 메뉴 카드 렌더, 상관 서브쿼리 제거.

### 5) 단일 `image_url` → `photo_urls` 배열 (Phase 1 + Phase 5)

- v1: `reviews.image_url VARCHAR(500)`.
- v2: `reviews.photo_urls TEXT[]` (최대 3장). 만들고 → 전환 → 삭제(V11).

### 6) Phase A/B/C/D 명명 → Phase 1~5 + D 재편

- 기존 Phase A/B/C/D 명명은 [`archive/ui-ux-v1-phases/`](../archive/ui-ux-v1-phases/)에 보존.
- 신규: Phase 1(DB) → 2(BE) → 3(FE 디자인 시스템) → 4(FE 페이지) → 5(정리). Phase D(사진)는 Phase 4 이후 별도 트랙.
- 기존 BE-A-* / FE-B-* / FE-C-* 단위는 새 P*-T* 단위에 흡수. 매핑은 [`99-progress.md`](./99-progress.md) 하단 참조.

---

## Phase 의존성 그래프

```
Phase 1 (DB)
  V8 menus 집계 + first/last_seen_at + 백필
  V9 menu_dates.meal_slot 추가 + UNIQUE 재정의
  V10 reviews.photo_urls + users.avatar_color
       │
       ↓
Phase 2 (BE)
  Corner / MenuTier / BadgeTier enum
  recomputeMenuStats 트리거
  MenuResponse / ReviewResponse / UserResponse 확장
  /menus?scope=all, /menus/best, /menus/today?slot=
  photoUrls 0~3 (image_url 호환)
  닉네임 30일 쿨다운
  /api/cron/crawl + cron-secret
  GlobalExceptionHandler 정정 (IAE→400)
       │
       ↓ 게이트: ./gradlew test + Render 배포 스모크
       ↓
Phase 3 (FE 디자인 시스템)
  Tailwind/Google Fonts 설정
  api/menus.js, api/users.js 신설
  api/reviews.js 3축+photoUrls (P0 버그 fix)
  components/hi/ 기초 9 + 컴포지트 10
       │
       ↓ 게이트: /dev/components 카탈로그 시각 확인
       ↓
Phase 4 (FE 페이지)
  Login → NicknameSetupModal → ProfilePage → TabBarHi 4탭
  HomePage → WeeklyPage → AllMenusPage → MenuDetailPage → ReviewWritePage → EmptyState
       │
       ↓ 게이트: 4탭 전부 새 디자인 + 375/768/1280 수동
       ↓
Phase 5 (정리)
  레거시 컴포넌트 삭제 (WeekTab/MyReviewsPage/ReviewsPage/MenuDetailModal/Header v1/BottomNav v1)
  V11 reviews.image_url DROP   ← 사용자 사전 승인 필수, 롤백 불가
  docs 정리
  Render 재배포 + Vercel 프로덕션 + CORS 갱신

Phase D (별도 트랙, Phase 4 이후 병행 가능)
  Cloudinary 다중 파일 서명 → 환경변수 → FE 첨부 UX/라이트박스
```

---

## 안전 원칙

- **Expand-contract**: 새 컬럼/필드는 nullable로 추가 → BE/FE 양쪽 전환 → 기존 컬럼 DROP.
- **기능 플래그 없이 순서로 보호**: BE는 응답에 신규 필드 추가만, 기존 필드 유지. FE 전환 후 BE에서 DROP.
- **Task 단위 commit**: ID(예: `feat(P2-T7): GET /menus/best`)를 메시지에 포함. push는 사용자가 수동.
- **Phase 게이트**: `./gradlew test` + `npm run build` + 브라우저 수동.

---

## 배포·브랜치 전략

### 배포 인프라

| 역할 | 서비스 | 비고 |
|---|---|---|
| 백엔드 | **Render** (Free Web Service) | `render.yaml` 자동 감지, `backend/Dockerfile` 사용 |
| DB | **Supabase** (Free) | PostgreSQL 500MB, 7일 비활성 시 일시정지 주의 |
| 프론트엔드 | **Vercel** (Hobby) | `frontend/vercel.json`으로 SPA 라우팅 처리 |

> Render 무료 플랜은 15분 비활성 시 슬립 → 첫 요청 콜드 스타트 ~30~60초.

### 배포 순서

1. **Phase 2 단독 배포(스테이징)**: 응답 확장만, 기존 시그니처 유지 → 프론트가 깨지지 않음.
2. **Phase 4 일괄 배포(프론트 페이지 전환)**: feature 브랜치에서 페이지 단위 머지 후 Vercel preview → 프로덕션.
3. **CORS 갱신**: Render 환경변수 `ALLOWED_ORIGINS`에 Vercel 도메인 추가 → Render 재시작. 코드 수정 불필요.
4. **Phase 5 V11**: Supabase 백업 확보 후 image_url DROP.
5. **Phase D**: BE → Render 환경변수(`CLOUDINARY_*`) → FE 순.

### 브랜치

- `feat/p1-db-migration`
- `feat/p2-backend-extensions`
- `feat/p3-design-system`
- `feat/p4-pages-rewrite`
- `feat/p5-cleanup`
- `feat/phase-d-photo`

### 롤백

- Flyway Community Edition은 Undo 미지원.
- **V11의 `image_url` DROP은 되돌리기 불가** → Phase 5 직전 **Supabase 백업 필수** (대시보드 > Database > Backups).
- 문제 시 백업 복원 + 이전 커밋 재배포.

---

## 환경변수

| 변수 | 위치 | 도입 시점 |
|---|---|---|
| `SPRING_DATASOURCE_URL` | Render | 초기 배포 (Supabase JDBC URL) |
| `SPRING_DATASOURCE_USERNAME` | Render | 초기 배포 |
| `SPRING_DATASOURCE_PASSWORD` | Render | 초기 배포 |
| `JWT_SECRET` | Render (generateValue) | 초기 배포 |
| `CRON_SECRET` | Render (generateValue) | Phase 2 (Task 2-13) |
| `ALLOWED_ORIGINS` | Render | 초기 배포 (Vercel 도메인 쉼표 구분) |
| `CLOUDINARY_CLOUD_NAME` | Render | Phase D |
| `CLOUDINARY_API_KEY` | Render | Phase D |
| `CLOUDINARY_API_SECRET` | Render | Phase D |

---

## 비-목표

- RefreshToken Redis 자동 재로그인 (별도 트랙)
- 뱃지/메달 에셋 실제 디자인 (이모지 플레이스홀더로 시작)
- 관리자 UI, 댓글·좋아요, 푸시 알림, 소셜 공유
- ROLE_ADMIN 권한 분리 (별도 트랙, [`99-progress.md`](./99-progress.md) Known Issues)
- Flyway Undo 기반 롤백 (CE 미지원)

---

## 재사용 자산

| 자산 | 경로 | 재사용 위치 |
|---|---|---|
| `useAuth` | `frontend/src/hooks/useAuth.js` | Phase 4 전반 |
| `useToast` | `frontend/src/hooks/useToast.jsx` | 전 Phase |
| `api/client.js` | `frontend/src/api/client.js` | 인터셉터 그대로 |
| `MenuCrawlerService` | backend `crawler/service/` | menu_dates 기반 동작 유지, slot 명시 추가 (Task 2-14) |
| `GlobalExceptionHandler` | backend `common/exception/` | 매핑 정정 (Task 2-15) |
| 디자인 토큰 v2 | [`docs/DESIGN.md`](../../DESIGN.md) | 컬러·타이포·컴포넌트 카탈로그 |
| 디자인 핸드오프 원본 | `design_handoff_full_revamp/` | Phase 3·4 작업 시 레퍼런스 |
