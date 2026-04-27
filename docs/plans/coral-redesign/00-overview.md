# Coral Redesign — Overview

> **역할**: 본 플랜의 결정 사항·의존성·배포 전략을 기록한다. 변하지 않는 설계 기준.
> **변함**: 진행 상태는 [`99-progress.md`](./99-progress.md), 실행 명세는 `01-phase-1-foundation.md` … `06-phase-d-photo.md`.

---

## Context

2026-04-19 v2 디자인 핸드오프(`design_handoff_full_revamp/`, 종이/잉크 톤 + Gaegu/Jua)로 진행되던 [Phase 4](../archive/ui-ux-redesign-v2/04-phase-4-pages.md) 작업이 절반(P4-T1~T5: Login·Home·Profile·NicknameSetupModal·TabBarHi) 완료된 시점에서, **2026-04-27 새 Coral 디자인 핸드오프**(`new_handoff/`)가 도착해 시각 시스템을 다시 한 번 전면 교체한다.

핵심 변화:
- 컬러 팔레트: 종이/잉크(`#FBF6EC`/`#EF8A3D`) → **순백/코랄**(`#FFFFFF`/`#FF6B5C` + Toss 그레이 9단계 g50~g900)
- 폰트: Gaegu/Jua(손글씨) → **Pretendard**(모던)
- 그림자: 1.5px 라인 + 오프셋 그림자 → **헤어라인 1px + 모바일 프레임만 그림자**
- 별점 색: 노랑(`#F4B73B`) → **코랄(`#FF6B5C`)**
- 카테고리 썸네일: 카테고리별 색상 → **단색 그레이(`#F2F4F6`) + 아이콘**(로그인 화면만 예외)
- 아이콘 14종 → **17종**(medal/check/plus/arrow 추가)

페이지 구조(4탭/9화면), 백엔드 응답 스키마, 도메인 규칙(3축 별점·30일 쿨다운·BadgeTier/MenuTier 임계값·NEW 윈도우)은 모두 그대로 유지된다. 이번 리팩토링은 **시각 시스템 + 프론트 페이지에 집중**되며, 백엔드는 V11 image_url DROP을 제외하면 무변경.

---

## 확정된 결정 (D9~D12, v2 D1~D8 위에 추가)

v2의 D1~D8 결정(BadgeTier 임계값·NEW 7일 윈도우·/menus/best 사양·corner VARCHAR 유지·MealSlot LUNCH 기본·닉네임 30일 쿨다운·image_url→photo_urls expand-contract)은 모두 효력을 유지한다. 이번 Coral 전환에서 새로 확정된 결정:

| # | 항목 | 결정 | 근거 |
|---|---|---|---|
| D9 | 컴포넌트 폴더 | `frontend/src/components/coral/` 신설. hi/와 병행 후 일괄 삭제 | 점진 교체 + 롤백 안전 |
| D10 | corner→illustration 매핑 | **FE에서 처리**. BE 변경 없음 | 마이그레이션 불필요, 가장 빠름. 추후 메뉴별 커스텀 일러스트 필요 시 재논의 |
| D11 | 기존 v2 plan 처리 | `plans/archive/ui-ux-redesign-v2/`로 git mv. v1→v2 매핑표·D1~D8·6가지 설계 드리프트 모두 보존 | 역사 추적 + 데이터 무손실 |
| D12 | v2 완성 페이지 처리 | LoginPage/HomePage/ProfilePage/NicknameSetupModal/TabBarHi 모두 Coral로 재작성 | 디자인 통일성 (두 톤 공존 비추천) |

---

## v2 → v3 Coral 전환 매핑

기존 v2 미완료 단위는 v3 단위로 흡수, 완료 단위는 재작성 대상으로 표기.

| v2 단위 | 상태 | v3 흡수 |
|---|---|---|
| P1-T1 ~ P1-T4 | 완료 (DB 마이그레이션 V8~V10) | 그대로 효력 (BE 무변경) |
| P1-T5 (V11 DROP) | 미완료 | **V3-T19** |
| P2-T2 ~ P2-T15 | 완료 (BE 확장) | 그대로 효력 |
| P3-T1 ~ P3-T5 | 완료 (hi/ 컴포넌트) | **V3-T1~T6**으로 재구성 (코드 재작성, 산출물 폐기) |
| P4-T1 (LoginPage) | 완료 (hi/) | **V3-T7** (재작성) |
| P4-T2 (NicknameSetupModal) | 완료 (hi/) | **V3-T8** (재작성) |
| P4-T3 (ProfilePage) | 완료 (hi/) | **V3-T14** (재작성) |
| P4-T4 (TabBarHi) | 완료 (hi/) | **V3-T4 Tab** (재작성) |
| P4-T5 (HomePage) | 완료 (hi/) | **V3-T9** (재작성) |
| P4-T6 (WeeklyPage) | 미완료 | **V3-T10** |
| P4-T7 (AllMenusPage) | 미완료 | **V3-T11** |
| P4-T8 (MenuDetailPage) | 미완료 | **V3-T12** |
| P4-T9 (ReviewWritePage) | 미완료 | **V3-T13** |
| P4-T10 (EmptyState) | 미완료 | **V3-T15** |
| P5-T1 (레거시 삭제) | 미완료 | **V3-T17, V3-T18** |
| P5-T2 (V11 DROP) | 미완료 | **V3-T19** |
| P5-T3 (docs 정리) | 미완료 | docs 재구성으로 분리 (본 plan 신설로 갈음) |
| P5-T4 (배포) | 미완료 | **V3-T20** |
| PD-T1 ~ PD-T3 | 미완료 | 그대로 (`./06-phase-d-photo.md`) |

---

## 설계 드리프트 기록 (7번째 추가)

v2 00-overview.md에 기록된 6가지 드리프트(닉네임 단일화·menus 정규화·v3 디자인 전환·firstSeenAt 컬럼화·image_url→photo_urls·Phase 명명 변경)는 archive에 보존된다. 이번 전환으로 7번째가 추가된다:

### 7) v2 종이/잉크 → v3 Coral 전환 (2026-04-27, 신규)

- v2: Gaegu/Jua + 종이톤(#FBF6EC) + 1.5px 라인 + 오프셋 그림자 + 카테고리 컬러 썸네일.
- v3: Pretendard + 순백(#FFFFFF) + 코랄(#FF6B5C) 단일 액센트 + Toss 그레이 9단계 + 헤어라인 1px + 단색 그레이 썸네일 + 17 SVG 아이콘.
- 디자인 톤이 "따뜻한 손글씨" → "모던/깔끔/선명"으로 완전 전환.
- 이유 — 학생 사용자 페르소나에 더 친숙한 모던 톤 채택, Toss 호환 그레이 스케일로 접근성/가독성 향상.
- 컴포넌트는 `frontend/src/components/coral/` 하위에 별도 디렉토리로 점진 구축, hi/와 병행 후 일괄 삭제.

---

## Phase 의존성 그래프

```
docs 재구성 (선행, 본 plan 작성으로 완료)
       │
       ↓
Phase v3-1 (FE Foundation)
  Tailwind 토큰 추가 (coral / Toss g50~g900 / hairline / frameShadow)
  Pretendard CDN
  components/coral/ — Icon 17 + 기초 9 + 컴포지트 10
  /dev/components 카탈로그 추가
       │
       ↓ 게이트: /dev/components 시각 확인 + npm run build
       ↓
Phase v3-2 (FE Pages)
  9화면 재작성 (Login → NicknameSetupModal → Home → Weekly → AllMenus
                → MenuDetail → ReviewWrite → Profile → EmptyState)
  App.jsx 라우터 정리
       │
       ↓ 게이트: 9화면 동작 + 375/768/1280 수동
       ↓
Phase v3-3 (Cleanup)
  hi/ 일괄 삭제 + Tailwind v2 토큰 / Gaegu·Jua 제거
  v1 components/ 잔재 삭제
  V11 reviews.image_url DROP   ← Supabase 백업 필수, 롤백 불가
  Render + Vercel 배포 + ALLOWED_ORIGINS 갱신

Phase D (병행 가능, Phase v3-2 이후)
  Cloudinary 다중 파일 서명 → 환경변수 → ReviewWritePage 첨부 UX
```

---

## 안전 원칙

- **Expand-contract 유지**: V11 DROP은 사용자 사전 승인 + Supabase 백업 후에만 실행.
- **순서로 보호**: hi/는 v3-2 게이트 통과 전까지 보존(롤백 안전), v3-3에서 일괄 삭제.
- **Task 단위 commit**: ID(예: `feat(V3-T9): rewrite HomePage with coral`)를 메시지에 포함. push는 사용자가 직접.
- **Phase 게이트**: `npm run build` + `./gradlew test`(V11 후) + 브라우저 수동(375/768/1280).

---

## 배포·브랜치 전략

### 배포 인프라 (변경 없음)

| 역할 | 서비스 | 비고 |
|---|---|---|
| 백엔드 | **Render** (Free Web Service) | `render.yaml` 자동 감지, `backend/Dockerfile` |
| DB | **Supabase** (Free) | PostgreSQL 500MB |
| 프론트엔드 | **Vercel** (Hobby) | `frontend/vercel.json` SPA 라우팅 |

### 배포 순서

1. **Phase v3-1 + v3-2 머지** — Vercel preview 배포로 9화면 시각 검증.
2. **CORS 갱신** — Render 환경변수 `ALLOWED_ORIGINS`에 Vercel 도메인 확인. 코드 수정 불필요.
3. **Phase v3-3 V11** — Supabase 백업 확보 후 image_url DROP. Render 재배포 시 자동 적용.
4. **Phase D** — BE → Render 환경변수(`CLOUDINARY_*`) → FE 순.

### 브랜치

- `feat/coral-foundation` — Phase v3-1
- `feat/coral-pages` — Phase v3-2 (페이지별 PR 분리 가능)
- `feat/coral-cleanup` — Phase v3-3
- `feat/phase-d-photo` — Phase D (변경 없음)

### 롤백

- Flyway Community Edition은 Undo 미지원.
- **V11의 `image_url` DROP은 되돌리기 불가** → Phase v3-3 V3-T19 직전 **Supabase 백업 필수**.
- 페이지 단위 롤백은 가능: hi/와 coral/이 v3-3 게이트 전까지 공존하므로 라우터에서 import 되돌리기로 즉시 복구.

---

## 환경변수

기존 v2 환경변수가 그대로 유지된다. 신규 변수 없음.

| 변수 | 위치 | 도입 시점 | 비고 |
|---|---|---|---|
| `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` | Render | 초기 배포 | Supabase Pooler URL |
| `JWT_SECRET` / `CRON_SECRET` | Render (generateValue) | 기적용 | |
| `ALLOWED_ORIGINS` | Render | 기적용 | Vercel 도메인 쉼표 구분 |
| `CLOUDINARY_*` | Render | Phase D | 미적용 |

---

## 비-목표

- 백엔드 도메인 모델 변경 (BadgeTier/MenuTier/Corner 임계값 등 모두 그대로)
- Menu.illustration 컬럼 추가 (D10에 의해 FE 매핑으로 갈음)
- RefreshToken Redis 자동 재로그인 (별도 트랙)
- 뱃지/메달 에셋 실제 디자인 (이모지 플레이스홀더 유지)
- 관리자 UI, 댓글·좋아요, 푸시 알림, 소셜 공유
- ROLE_ADMIN 권한 분리 (별도 트랙)

---

## 재사용 자산

| 자산 | 경로 | 재사용 위치 |
|---|---|---|
| `useAuth` / `useToast` | `frontend/src/hooks/` | 전 페이지 |
| `api/{client,auth,menus,reviews,users}.js` | `frontend/src/api/` | BE 무변경이라 그대로 |
| 17 SVG path | `new_handoff/source/coral-system.jsx` (CIcon) | V3-T3 |
| 9화면 레이아웃 | `new_handoff/source/coral-{home,week-all,detail-write,profile-onboarding,system}.jsx` | V3-T7~T15 |
| `data-model.md` / `screens/0X-*.md` / `tokens.md` / `components.md` | `new_handoff/` | 페이지 작업 시 명세 참조 |
| `MenuCrawlerService` | `backend/.../crawler/service/` | 변경 없음 |
| `GlobalExceptionHandler` | `backend/.../common/exception/` | 변경 없음 |
| BadgeTier/MenuTier/CornerMapper | `backend/.../{user,menu}/domain/` | 변경 없음 |
| 디자인 핸드오프 원본 | `new_handoff/` | Phase v3-1·v3-2 작업 시 레퍼런스 |
| v2 디자인 시스템 (참조용) | [`docs/archive/DESIGN-v2.md`](../../archive/DESIGN-v2.md) | 데이터 보존, 신규 작업 시 미참조 |
