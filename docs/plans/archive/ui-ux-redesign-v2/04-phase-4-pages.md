# Phase 4 — 프론트 페이지 재작성

> **역할**: 7개 페이지 + 진입 흐름 신규/교체. 진행 상태는 [`99-progress.md`](./99-progress.md).
> **원칙**: 페이지 단위로 한 번에 하나만 교체. 라우트 스왑 시 기존 컴포넌트는 임시 보존(P5-T1에서 일괄 삭제).
> **레퍼런스**: `design_handoff_full_revamp/design/hifi-screens-1.jsx`, `hifi-screens-2.jsx`, `hifi-screens-3.jsx`.

---

## P4-T1 · `OnboardingLogin` (`/login`)

**신규** `frontend/src/pages/LoginPage.jsx`
- 레퍼런스: `hifi-screens-3.jsx` HiLogin
- 배경 `bg-orangeSoft` 풀스크린 + Google G 로고 SVG (자체)
- `@react-oauth/google`의 `useGoogleLogin` 그대로 사용
- 헤더 로그인 버튼은 일단 유지 (P5-T1에서 정리)

**라우트**: `<Route path="/login" element={<LoginPage />} />`

**검증**: `/login` 접속 → 디자인 일치, Google 로그인 정상 동작 → 성공 시 `/`

**소요**: 2시간 / **위험**: 낮음

---

## P4-T2 · `NicknameSetupModal`

**신규** `frontend/src/components/hi/NicknameSetupModal.jsx`
- 레퍼런스: `hifi-screens-3.jsx` HiNickname
- `createPortal(…, document.body)` 사용
- Props: `{ onClose }` — 저장 성공 시만 호출
- 추천 닉네임 칩 5개 (하드코딩, 클릭 시 input 채움)
- 입력: 2~12자 실시간 validation
- 가용성 체크: `updateNickname(nickname)` 시도 → 409 시 "이미 사용 중" 메시지
- **닫기 불가**: ESC 무시, overlay 클릭 무시
- "한 번 정하면 30일 동안 변경하기 어려워요" 안내 (D6)

**자동 오픈**: `useAuth`에서 `user.isNicknameSet === false` 감지 → `App.jsx`에서 트리거

**검증 시나리오**:
1. 신규 계정 로그인 → 자동 오픈
2. 1자 입력 → 버튼 비활성
3. 13자 → 에러 메시지
4. 중복 시도 → 409 메시지
5. 성공 → 모달 닫힘, 헤더 닉네임 갱신

**소요**: 2.5시간 / **위험**: 중간

---

## P4-T3 · `ProfilePage` (`/profile`)

**신규** `frontend/src/pages/ProfilePage.jsx`
- 레퍼런스: `hifi-screens-3.jsx` HiProfile
- API: `getMe()` + `getMyReviews()`
- 4섹션:
  1. 프로필 카드 — 아바타 색상원 + 닉네임 ✎ + 다음 뱃지까지 N개
  2. `BadgeProgressBar` — `nextTarget`/`remaining` 기반
  3. `StatsGrid` — 리뷰수 / 평점 / 메달 수
  4. 내가 쓴 리뷰 (압축형) — `MultiStarSummary` 사용
- 닉네임 인라인 편집 → `NicknameSetupModal` 재사용 (mode: 'edit')
- `MyReviewsPage` 흡수 → 라우트 `/my-reviews` 제거 또는 `/profile`로 리다이렉트

**라우트**:
```jsx
<Route path="/profile" element={
  user ? <ProfilePage /> : <Navigate to="/login" replace />
} />
```

**검증**: 로그인 상태 진입 → 모든 섹션 표시 / 미로그인 → `/login` 리다이렉트

**소요**: 3시간 / **위험**: 중간

---

## P4-T4 · `BottomNav` → `TabBarHi` 4탭 교체

**수정** `frontend/src/App.jsx`
- 기존 `<BottomNav />` 컴포넌트 사용처 → `<TabBarHi />`
- 4탭 라우팅: 홈(`/`) / 주간(`/weekly`) / 전체(`/menus`) / 프로필(`/profile`)

**기존 BottomNav.jsx**: 유지 (P5-T1에서 삭제)

**검증**: 모든 페이지에서 4탭 렌더, 활성 탭 색상 정확

**소요**: 30분 / **위험**: 낮음

---

## P4-T5 · `HomePage` 재작성

**재작성** `frontend/src/pages/HomePage.jsx`
- 레퍼런스: `hifi-screens-1.jsx` HiHome
- API:
  - `useQuery(['menus','today', slot], () => getTodayMenus(slot))`
  - `useQuery(['menus','best'], getBestMenus)` → `BestCarousel`
- 레이아웃:
  - 헤더 (페이지 자체 헤더, v1 공용 Header 사용 안 함)
  - "오늘의 메뉴 (LUNCH)" + 정렬 드롭다운(별점/가나다/리뷰수)
  - 코너별 그룹 리스트
  - 🏆 이번 주 BEST → `BestCarousel` 5건
- **MOCK_TODAY 제거**, `getTodayMenus` 응답으로 교체

**검증 시나리오**:
1. 실제 데이터 표시
2. 코너별 그룹핑 정상
3. BEST 빈 응답 시 섹션 숨김 또는 EmptyState 미니뷰

**소요**: 3.5시간 / **위험**: 중간

---

## P4-T6 · `WeeklyPage` 재작성

**재작성** `frontend/src/pages/WeeklyPage.jsx`
- 레퍼런스: `hifi-screens-1.jsx` HiWeek
- API: `useQuery(['menus','weekly', dateKey], () => getWeeklyMenus(dateKey))`
- `WeekDayTabs` 5분할 (월~금) + 선택 요일의 코너별 메뉴 리스트
- 각 메뉴 행: 메뉴명 + `Pill`(NEW/베스트) + `Stars` + `MedalSticker`(있을 때)
- 리뷰 0건일 때 "첫 리뷰의 주인공이 되어보세요" 표시
- **MOCK_WEEKLY 제거**, 기존 `WeekTab.jsx` 더 이상 사용 안 함 (P5-T1 삭제)

**검증**: 요일 탭 전환 → 데이터 갱신, 빈 요일 → EmptyState 미니뷰

**소요**: 3시간 / **위험**: 중간

---

## P4-T7 · `AllMenusPage` (`/menus`)

**신규** `frontend/src/pages/AllMenusPage.jsx`
- 레퍼런스: `hifi-screens-1.jsx` HiAll
- API: `useQuery(['menus','all', { q, corner, sort }], () => getAllMenus({ q, corner, sort, scope: 'all' }))`
- 검색 입력 + `CornerFilterChips` + 정렬 안내 라벨 + 점선 구분 리스트
- 각 행: `MedalSticker` + 메뉴명 + `NEW Pill`(isNew) + `Stars` + 리뷰수

**검증**: 검색/필터/정렬 모두 동작, 리뷰 없는 메뉴도 표시 (별점 "-")

**소요**: 3시간 / **위험**: 중간

---

## P4-T8 · `MenuDetailPage` (`/menus/:id`) — 모달 → 풀스크린 라우트

**신규** `frontend/src/pages/MenuDetailPage.jsx`
- 레퍼런스: `hifi-screens-2.jsx` HiDetail
- API: `useQuery(['menus', id], () => getMenuById(id))` + `useQuery(['reviews', id], () => getReviews(id))`
- 레이아웃:
  - 뒤로 가기 버튼
  - `FoodIllust` 큰 헤더 + 메뉴명 + 코너 + 날짜
  - `AxisBar` 3축 평균 (avgTaste/avgAmount/avgValue)
  - 리뷰 리스트 — 각 리뷰: 닉네임 + 뱃지 이모지 + `MultiStarSummary` + 코멘트 + 사진 썸네일 슬롯
  - 하단 CTA: `리뷰 쓰기 →` (자기 리뷰 있으면 `리뷰 수정`)
- 카드 클릭 → `navigate(/menus/:id)`로 푸시 전환 (모달 X)
- 뒤로 가기 시 스크롤 위치 복원 (browser 기본)

**기존 MenuDetailModal**: 미사용 처리, P5-T1에서 삭제

**검증**:
- 카드 클릭 → 상세 푸시 → 뒤로 가기 정상
- 리뷰 0건 시 EmptyState 미니뷰
- 자기 리뷰: 수정/삭제 버튼 노출

**소요**: 3.5시간 / **위험**: 중간 (모달 → 라우트 전환)

---

## P4-T9 · `ReviewWritePage` (`/menus/:id/review`)

**신규** `frontend/src/pages/ReviewWritePage.jsx`
- 레퍼런스: `hifi-screens-2.jsx` HiWrite
- 헤더: [← 취소] 리뷰 쓰기 [등록]
- `FoodIllust` + 메뉴명
- `MultiStarRating` 3행 (32px 별)
- 한 마디 textarea (500자)
- 사진 첨부 자리 (Phase D에서 구현, 일단 disabled placeholder)
- 등록: `createReview(menuId, { tasteRating, amountRating, valueRating, comment, photoUrls: [] })`
- 성공 시 `navigate(-1)` 또는 `navigate(/menus/:id)`

**유효성**: 3축 모두 입력해야 등록 활성화

**검증**: 3축 입력 후 등록 → 상세로 복귀, 새 리뷰 즉시 표시 (queryClient invalidate)

**소요**: 2.5시간 / **위험**: 중간

---

## P4-T10 · `EmptyState` 흐름

- HomePage에서 오늘 메뉴 0건 → `EmptyState` + "지난 주 베스트 미리보기" 2건
- WeeklyPage 빈 요일 → `EmptyState` 미니뷰
- ProfilePage 내 리뷰 0건 → `EmptyState`

**API 보강 (선택)**: `getBestMenus({ week: 'last' })` — 또는 첫 진입 시 `getBestMenus()` 응답 캐싱 후 fallback.

**검증**: DB에서 오늘 menu_dates 비우고 진입 → EmptyState 정상

**소요**: 1.5시간 / **위험**: 낮음

---

## Phase 4 게이트

- 4탭(홈/주간/전체/프로필) 모두 새 디자인 적용
- `npm run build` 성공
- 375 / 768 / 1280 수동 검증 (모든 페이지)
- 통과 후 Phase 5 시작
