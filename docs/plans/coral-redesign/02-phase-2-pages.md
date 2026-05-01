# Phase v3-2 — 페이지 재작성 (9화면)

> **역할**: 9개 화면을 모두 `components/coral/`만 사용해 재작성. 기존 hi/ 페이지는 라우터에서 점진 교체.
> **체크박스**: [`./99-progress.md`](./99-progress.md)

---

## 게이트

- 9개 라우트 전부 정상 동작 + 새 디자인 적용
- 백엔드 실 데이터 연결 (MOCK 잔재 0건)
- `npm run build` 성공
- 375 / 768 / 1280 뷰포트 시각 확인
- 인증 흐름(비로그인 → /login → 로그인 → 닉네임 모달 → /) 동작
- 리뷰 작성 → 메뉴 상세 평균 갱신 동작

---

## 작업 원칙

- 각 페이지는 한 단위씩 PR로 분리 가능. 단위 ID(`V3-T9`)를 커밋 메시지에 포함.
- 데이터는 기존 `frontend/src/api/{menus,reviews,users,auth}.js`를 그대로 사용. BE 응답 시그니처 변경 없음.
- 페이지 작성 후 hi/ 동등 페이지 import는 일단 유지 (Phase v3-3에서 일괄 삭제).
- `new_handoff/source/coral-{home,week-all,detail-write,profile-onboarding,system}.jsx` 5개 파일이 9화면 전체 레이아웃을 정의 — 해당 파일에서 jsx 블록을 분해해 React Router 페이지로 이식.
- 화면별 명세는 `new_handoff/screens/0X-*.md`에 1개씩 정리되어 있으므로 페이지 작업 시 1차 참조.

---

## V3-T7 — LoginPage (`/login`)

**파일**: `frontend/src/pages/LoginPage.jsx` (덮어쓰기)
**참조**: `new_handoff/source/coral-profile-onboarding.jsx` Login 블록 + `new_handoff/screens/07-login.md`

핵심:
- coralSoft 배경 + Google G 로고 버튼
- 카테고리 일러스트 3개(`#FFF1ED` 한식 / `#FFF5E0` 양식 / `#EAF6EE` 일품) — **로그인 화면만 컬러 유지** (D10 결정의 예외)
- 비로그인 상태에서만 접근, 로그인 성공 시 `/`로 리다이렉트
- 닉네임 미설정이면 `/`에서 NicknameSetupModal이 자동으로 열림 (V3-T8 처리)

**검증**: 비로그인 진입 시 `/login` 표시 → Google 로그인 클릭 → 콜백 후 `/` 이동.

---

## V3-T8 — NicknameSetupModal (App 조건부)

**파일**: `frontend/src/components/coral/NicknameSetupModal.jsx` (신규) + `frontend/src/App.jsx` 갱신
**참조**: `new_handoff/source/coral-profile-onboarding.jsx` Nickname 블록 + `new_handoff/screens/08-nickname.md`

핵심:
- `createPortal(..., document.body)` 사용 (transform 조상 stacking context 우회)
- 닫기 불가 (X 버튼 없음, ESC/배경 클릭 무시)
- 추천 칩 5개 (`useNicknameSuggestions` 훅 또는 정적 배열)
- 입력 시 디바운스 후 `getMe`/`checkNicknameAvailability` 호출 (이미 `frontend/src/lib/nickname.js`에 가용성 체크 유틸 있을 수 있음 — 확인 후 재사용)
- 가용 시 "이 닉네임으로 시작" CTA 활성화 → `PATCH /auth/me/nickname` → 모달 닫고 `getMe` 재조회
- App.jsx의 인증 게이트에서 `me.isNicknameSet === false`일 때만 렌더

**검증**: 신규 가입 직후 모달 자동 노출 → 닉네임 입력·저장 → 모달 닫힘 → `/` 정상.

---

## V3-T9 — HomePage (`/`)

**파일**: `frontend/src/pages/HomePage.jsx` (덮어쓰기)
**참조**: `new_handoff/source/coral-home.jsx` + `new_handoff/screens/01-home.md`

레이아웃:
```
[ Header: "학식 today"           [user 아바타] ]
🏆 이번 주 BEST  → BestRow (124×124 가로 5개)
✨ 오늘 메뉴 (LUNCH)  → 코너별 그룹핑 리스트 (50×50 Thumb)
   - 한식 / 양식 / 분식 / 일품
   [ 메뉴명  Stars 4.2  카테고리 칩  NEW? ]
[ Tab(home) ]
```

데이터:
- BEST: `getBestMenus()` (TOP 5)
- 오늘 메뉴: `getTodayMenus({slot:'LUNCH'})` → 코너별 group → 정렬 (averageRating desc)
- React Query로 캐싱

빈 상태:
- 오늘 메뉴 0건 시 `Empty` 컴포넌트 + "지난 주 BEST 보기" CTA → `/menus?sort=rating`

**검증**: `/` 접속 → BEST 5 가로 스크롤 + 오늘 메뉴 코너별 리스트 표시.

---

## V3-T10 — WeeklyPage (`/weekly`)

**파일**: `frontend/src/pages/WeeklyPage.jsx` (덮어쓰기)
**참조**: `new_handoff/source/coral-week-all.jsx` Week 블록 + `new_handoff/screens/02-week.md`

레이아웃:
```
[ Header: "주간 식단" ]
WeekPicker: [월][화][수][목▶][금]
선택 요일의 코너별 메뉴 리스트 (Thumb + 메뉴명 + Stars + NEW?)
[ Tab(week) ]
```

데이터: `getWeeklyMenus(date)` (응답 `days: { MON: [...], TUE: [...], ... }`)

상태:
- 기본 선택 요일 = 오늘(주말이면 월요일로 폴백)
- 선택 요일에 데이터 0건 → `Empty` ("이 날 식단이 아직 등록되지 않았어요")

**검증**: `/weekly` 접속 → 요일 선택 변경 시 리스트 즉시 갱신.

---

## V3-T11 — AllMenusPage (`/menus`)

**파일**: `frontend/src/pages/AllMenusPage.jsx` (신규) — 기존 `ReviewsPage.jsx`는 Phase v3-3에서 삭제
**참조**: `new_handoff/source/coral-week-all.jsx` All 블록 + `new_handoff/screens/03-all.md`

레이아웃:
```
[ Header: "전체 메뉴" + 검색 입력 ]
CategoryFilter: [전체|한식|양식|분식|일품]
정렬: [별점 높은 순 ▼]
─── 점선 구분 리스트 ───
🥇 메뉴명 ★4.7 (24)
🥈 메뉴명 ★4.2 (12) [NEW]
[ Tab(all) ]
```

데이터: `getAllMenus({ sort, scope:'all', corner, q })` — 검색은 클라이언트 필터(BE는 `q` 미지원이면 클라이언트만 처리, 응답 후 `name.includes(q)`).

라우터 변경:
- `/menus` → `AllMenusPage` (기존 `ReviewsPage`에서 변경)
- 메뉴 카드 클릭 → `/menus/:id` (V3-T12 풀스크린 라우트)

**검증**: 검색 입력·코너 필터·정렬 모두 즉시 반영. 메뉴 클릭 시 상세로 이동.

---

## V3-T12 — MenuDetailPage (`/menus/:id`)

**파일**: `frontend/src/pages/MenuDetailPage.jsx` (신규) — 기존 `MenuDetailModal.jsx`는 Phase v3-3에서 삭제
**참조**: `new_handoff/source/coral-detail-write.jsx` Detail 블록 + `new_handoff/screens/04-detail.md`

레이아웃:
```
[ ← 뒤로 ]
[ 140×140 Thumb 헤더 ]
메뉴명 (Pretendard 24/700) · 코너 · NEW?
AxisProgress 3축:
  맛  ████████░░ 4.5
  양  ██████░░░░ 3.8
  가성비 █████████░ 4.7
─── 리뷰 리스트 ───
[ 닉네임 🥈 작성일 ]
  MultiStarSummary
  코멘트
  사진 썸네일 (Phase D)
[ ✎ 리뷰 쓰기 CTA → /menus/:id/review ]
```

데이터:
- 메뉴: `getMenuById(id)` (응답에 avgTaste/Amount/Value/Overall + tier/isNew 포함)
- 리뷰: `getReviews(menuId, {page, size})` 무한 스크롤 또는 페이지네이션 (당장은 첫 20개 + "더 보기" 버튼)
- 본인 작성한 리뷰가 있으면 CTA 라벨 → "내 리뷰 수정"

**모달 → 풀스크린 전환**: 기존 `MenuDetailModal` 사용처(ReviewsPage/WeeklyPage)에서 `navigate(`/menus/${id}`)`로 교체.

**검증**: 메뉴 카드 클릭 시 풀스크린 라우트 진입 → 뒤로 가기로 이전 페이지 복귀.

---

## V3-T13 — ReviewWritePage (`/menus/:id/review`)

**파일**: `frontend/src/pages/ReviewWritePage.jsx` (신규)
**참조**: `new_handoff/source/coral-detail-write.jsx` Write 블록 + `new_handoff/screens/05-write.md`

레이아웃:
```
[ ← 취소 ]   리뷰 쓰기   [ 등록 ]
[ Thumb + 메뉴명 ]
MultiStarInput (32px 큰 별 3행):
  맛   ★★★★★
  양   ★★★★☆
  가성비 ★★★★★
한 마디 textarea (500자 카운터)
[ + 사진 첨부 ] (Phase D, 일단 disabled 상태)
```

동작:
- POST `/api/v1/reviews` (또는 PUT 본인 기존 리뷰) → 성공 시 `/menus/:id`로 navigate(replace)
- 3축 모두 입력해야 등록 활성화 (1~5 정수 NOT NULL)
- 본인 기존 리뷰가 있으면 진입 시 prefill + 등록 라벨 → "수정"

**검증**: 별점 미입력 시 등록 버튼 disabled → 별점 입력 + 등록 → 상세 페이지 평균 갱신.

---

## V3-T14 — ProfilePage (`/profile`)

**파일**: `frontend/src/pages/ProfilePage.jsx` (덮어쓰기)
**참조**: `new_handoff/source/coral-profile-onboarding.jsx` Profile 블록 + `new_handoff/screens/06-profile.md`

레이아웃:
```
[ avatarColor 색상원 (이니셜) ] 닉네임 ✎
🥈 다음 뱃지까지 N개
ProgressBar
StatsGrid: 리뷰 수 / 평균 별점 / 메달 수
─── 내가 쓴 리뷰 (압축형) ───
[ 메뉴 Thumb + MultiStarSummary + 코멘트 30자 ]
[ 로그아웃 ]
[ Tab(me) ]
```

데이터:
- 사용자: `getMe()` (avatarColor/badgeTier/nextTarget/remaining 포함)
- 내 리뷰: `getMyReviews()` 또는 별도 엔드포인트
- 닉네임 변경 ✎ 클릭 → NicknameSetupModal 재사용 (mode=edit, 30일 쿨다운 검증)

**검증**: `/profile` 접속 → 진행도 바·통계 3개·내 리뷰 리스트·닉네임 수정 버튼 모두 표시.

---

## V3-T15 — EmptyState 통합

**파일**: 모든 페이지 (HomePage / WeeklyPage / AllMenusPage / ProfilePage 빈 상태)
**참조**: `new_handoff/screens/09-empty.md`

각 페이지의 데이터 0건 분기에 `<Empty>` 컴포넌트 적용:

| 페이지 | 트리거 | 메시지 | CTA |
|---|---|---|---|
| HomePage | 오늘 메뉴 0건 | "아직 오늘 식단이 등록되지 않았어요" | "지난 주 BEST 보기" → `/menus?sort=rating` |
| WeeklyPage | 선택 요일 0건 | "이 날 식단이 등록되지 않았어요" | (없음) |
| AllMenusPage | 검색 결과 0건 | "검색 결과가 없어요" | "필터 초기화" |
| ProfilePage | 내 리뷰 0건 | "첫 리뷰의 주인공이 되어보세요" | "리뷰 쓸 메뉴 찾기" → `/menus` |
| MenuDetailPage | 리뷰 0건 | "아직 리뷰가 없어요" | "첫 리뷰 쓰기" → `/menus/:id/review` |

**검증**: 각 페이지에서 임시로 데이터 0건 케이스 강제 → Empty 컴포넌트 표시 확인.

---

## V3-T16 — App.jsx 라우터 정리

**파일**: `frontend/src/App.jsx`

기존 hi/ 페이지 import 제거하고 coral/ 페이지로 교체. 라우트 매핑:

```jsx
<Route path="/login" element={<LoginPage />} />            // V3-T7
<Route path="/" element={<HomePage />} />                    // V3-T9
<Route path="/weekly" element={<WeeklyPage />} />            // V3-T10
<Route path="/menus" element={<AllMenusPage />} />           // V3-T11
<Route path="/menus/:id" element={<MenuDetailPage />} />     // V3-T12
<Route path="/menus/:id/review" element={<ReviewWritePage />} />  // V3-T13
<Route path="/profile" element={<ProfilePage />} />          // V3-T14
<Route path="/dev/components" element={<DevComponentsPage />} />
<Route path="/reviews" element={<Navigate to="/menus" replace />} />
<Route path="/my-reviews" element={<Navigate to="/profile" replace />} />
<Route path="*" element={<Navigate to="/" replace />} />
```

NicknameSetupModal은 인증 게이트에서 조건부 렌더(V3-T8 참조).

**검증**: 모든 라우트 동작 + 리다이렉트 동작.

---

## 완료 정의 (Definition of Done)

- [ ] 9개 페이지 파일 생성/덮어쓰기 완료
- [ ] App.jsx 라우터에서 hi/ 페이지 import 0건 (하지만 hi/ 폴더 자체는 보존)
- [ ] `npm run build` 성공
- [ ] 375 / 768 / 1280 뷰포트 시각 확인
- [ ] 비로그인→로그인→닉네임 모달→홈 흐름 동작
- [ ] 리뷰 작성→상세 평균 갱신 동작
- [ ] 모든 페이지 Empty 상태 정의됨
