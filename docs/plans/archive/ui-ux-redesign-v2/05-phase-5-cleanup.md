# Phase 5 — 정리 (Cleanup)

> **역할**: 레거시 삭제 + V11 image_url DROP + docs 갱신 + 배포. 진행 상태는 [`99-progress.md`](./99-progress.md).
> **선결**: Phase 4 모든 페이지가 새 디자인으로 교체 완료.

---

## P5-T1 · 레거시 컴포넌트/페이지 삭제

### 삭제 대상

```
frontend/src/components/
  WeekTab.jsx              ← P4-T6에서 WeekDayTabs로 대체
  MenuDetailModal.jsx      ← P4-T8에서 MenuDetailPage로 대체
  BottomNav.jsx            ← P4-T4에서 TabBarHi로 대체
  Header.jsx               ← 페이지 자체 헤더로 분해 (또는 hi/HeaderHi.jsx로 교체)
  MenuCard.jsx             ← (선택) hi/ 버전이 있으면 삭제, 아니면 유지

frontend/src/pages/
  MyReviewsPage.jsx        ← P4-T3에서 ProfilePage로 흡수
  ReviewsPage.jsx          ← P4-T7에서 AllMenusPage로 대체
```

### 작업 순서

1. 각 파일 import 사용처가 0인지 확인 (`grep -r "from.*WeekTab"` 등)
2. 한 번에 한 파일씩 삭제 → `npm run build` 통과 확인
3. 라우트 정리: `App.jsx`에서 `/my-reviews` 라우트 제거 또는 `/profile` 리다이렉트
4. 디렉토리 비어 있으면 디렉토리도 정리

**검증**: `npm run build` 성공 + 모든 라우트 (`/`, `/weekly`, `/menus`, `/menus/:id`, `/menus/:id/review`, `/profile`, `/login`) 정상 진입

**소요**: 30분 / **위험**: 낮음

---

## P5-T2 · V11 `reviews.image_url` DROP

### 사전 조건 (모두 만족해야 시작)

- [ ] FE 모든 페이지가 `photoUrls` 사용 (P3-T3, P4-T8/T9 완료)
- [ ] BE 응답 DTO에서 `imageUrl` 필드 deprecated 표시 + 미참조 확인
- [ ] **Supabase 백업 확보** (대시보드 > Database > Backups 또는 `pg_dump`)
- [ ] **사용자 사전 승인**

### 작업

**파일**: `backend/src/main/resources/db/migration/V11__drop_review_image_url.sql`
```sql
ALTER TABLE reviews DROP COLUMN image_url;
```

**Entity** `review/entity/Review.java`
- `imageUrl` 필드 제거
- 관련 메서드/생성자 시그니처 정리

**DTO** `review/dto/`
- `ReviewRequest`/`ReviewUpdateRequest`에서 deprecated `imageUrl` 필드 제거
- `ReviewResponse`에서 deprecated `imageUrl` 필드 제거

**Service** `review/service/ReviewService.java`
- imageUrl ↔ photoUrls 호환 로직(P2-T9에서 추가) 제거

### 검증

- prod DB 스냅샷 → 마이그레이션 실행 → `\d reviews`로 컬럼 부재 확인
- `./gradlew test` + `./gradlew build` 통과
- Postman: `POST /reviews` photoUrls 정상, imageUrl 필드 보내면 무시 (또는 400)

### 롤백

- **불가**. 스냅샷 복원 + 이전 커밋 재배포가 유일.

**소요**: 30분 / **위험**: 높음

---

## P5-T3 · docs 정리

### 갱신 대상

| 파일 | 갱신 내용 |
|---|---|
| [`99-progress.md`](./99-progress.md) | Phase 5 모든 체크박스 완료 |
| [`00-overview.md`](./00-overview.md) | "Phase 1~5 완료" 표기 (필요 시 status 섹션 추가) |
| [`docs/api.md`](../../api.md) | `imageUrl` 관련 deprecated 표기 제거. `photoUrls`만 명시 |
| [`docs/architecture.md`](../../architecture.md) | 패키지 구조에 신규 디렉토리(`menu/domain/`, `user/domain/`, `cron/`, `common/upload/`) 반영 |
| [`docs/conventions.md`](../../conventions.md) | image_url 단일 사진 규칙 → 다중 photo_urls 규칙으로 명시 정리 |
| [`docs/plans/README.md`](../README.md) | UI/UX 개편 플랜 → archive로 이동 또는 "완료" 표시 |

### 검증

- 새 세션에서 `CLAUDE.md` import 체인 정상 작동 (`@docs/plans/README.md` → `@./ui-ux-redesign/00-overview.md` + `@./ui-ux-redesign/99-progress.md`)
- `docs/archive/` 하위 파일들이 마크다운 링크로 참조 가능

**소요**: 1.5시간 / **위험**: 낮음

---

## P5-T4 · 배포

### 백엔드 (Render)

1. main 머지 → Render 자동 배포 (`render.yaml` 기반)
2. 기동 로그에서 Flyway V8~V11 적용 확인
3. 환경변수 확인 (Render 대시보드):
   - `JWT_SECRET`
   - `SPRING_DATASOURCE_*` (Supabase 연결 정보)
   - `CRON_SECRET` (P2-T13에서 등록)
   - `ALLOWED_ORIGINS` (Vercel 도메인 포함 여부)
   - `CLOUDINARY_*` (Phase D 진행 시)

### 프론트엔드 (Vercel)

1. main 머지 → Vercel 자동 배포
2. 프로덕션 URL 확인
3. **CORS 갱신**: 프론트 도메인이 바뀌었거나 신규 추가되면 Render 환경변수 `ALLOWED_ORIGINS`에 추가 → Render 재시작 (코드 수정 불필요)

### 스모크 테스트 (프로덕션)

| 시나리오 | 기대 |
|---|---|
| `/` 진입 (미로그인) | 오늘 메뉴 + BEST 정상 표시 |
| 로그인 → 신규 계정 | 자동으로 NicknameSetupModal 오픈 |
| 닉네임 설정 → `/profile` | 닉네임/뱃지/통계/내 리뷰 정상 |
| 메뉴 카드 클릭 | `/menus/:id` 푸시, 3축 집계 + 리뷰 표시 |
| `리뷰 쓰기` → 3축 입력 → 등록 | 상세로 복귀, 새 리뷰 즉시 노출 |
| `/weekly` 요일 탭 전환 | 데이터 갱신 |
| `/menus` 검색/필터/정렬 | 전부 동작 |
| 모바일(375)·태블릿(768)·데스크톱(1280) | 깨짐 없음 |

**소요**: 1시간 / **위험**: 중간 (CORS 누락 시 프론트가 401/CORS 에러)
