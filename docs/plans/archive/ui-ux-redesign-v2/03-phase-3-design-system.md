# Phase 3 — 프론트 디자인 시스템

> **역할**: 토큰 + 기초/컴포지트 컴포넌트 카탈로그 구축. 진행 상태는 [`99-progress.md`](./99-progress.md).
> **원칙**: **별도 디렉토리** `frontend/src/components/hi/`에 점진 구축. 기존 `components/`는 v1, 한 페이지씩 교체.
> **레퍼런스**: `design_handoff_full_revamp/design/hifi-system.jsx` 와 토큰 객체 `T`.

---

## P3-T1 · Tailwind 토큰 + Google Fonts

### `frontend/index.html`
`<head>` 안에:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Jua&display=swap" rel="stylesheet">
```

### `frontend/src/index.css`
```css
:root {
  --font-hand: 'Gaegu', system-ui, sans-serif;
  --font-disp: 'Jua', system-ui, sans-serif;

  --paper:#FBF6EC; --paper-deep:#F4ECDC;
  --ink:#2B2218; --ink-soft:#574635; --mute:#8E7A66; --rule:#D8CBB6;
  --orange:#EF8A3D; --orange-soft:#FCE3C9;
  --yellow:#F4B73B; --yellow-soft:#FBE6A6;
  --green:#4A8F5B; --green-soft:#CDE5C8;
  --peach:#F6C7A8; --red:#D9543A;
}

body {
  font-family: var(--font-hand);
  background: var(--paper);
  color: var(--ink);
}
```

### `frontend/tailwind.config.js`
[`docs/DESIGN.md` §12](../../DESIGN.md) 의 `theme.extend` 블록 그대로 적용.

**검증**: 임시 페이지에 `<div className="bg-paper text-ink font-disp shadow-flat">테스트</div>` → 시각/DevTools 폰트 로드 확인.

**소요**: 1시간 / **위험**: 낮음

---

## P3-T2 · `api/menus.js` + `api/users.js` 신설

### 신규 `frontend/src/api/menus.js`
```js
import client from './client';

export const getTodayMenus  = (slot = 'LUNCH', corner) =>
  client.get('/menus/today', { params: { slot, corner } }).then(r => r.data);

export const getWeeklyMenus = (date) =>
  client.get('/menus/weekly', { params: { date } }).then(r => r.data);

export const getAllMenus    = ({ q, corner, sort, scope = 'all' } = {}) =>
  client.get('/menus', { params: { q, corner, sort, scope } }).then(r => r.data);

export const getMenuById    = (id) =>
  client.get(`/menus/${id}`).then(r => r.data);

export const getBestMenus   = () =>
  client.get('/menus/best').then(r => r.data);

export const getCorners     = () =>
  client.get('/menus/corners').then(r => r.data);
```

### 신규 `frontend/src/api/users.js`
```js
import client from './client';

export const getMe          = () =>
  client.get('/auth/me').then(r => r.data);

export const updateNickname = (nickname) =>
  client.patch('/auth/me/nickname', { nickname }).then(r => r.data);

export const updateAvatarColor = (avatarColor) =>
  client.patch('/auth/me/avatar-color', { avatarColor }).then(r => r.data);
```

> `/auth/me/avatar-color` 엔드포인트는 Phase 2 보강 시 추가하거나, 프로필 페이지에서 클라이언트 보존(localStorage)으로 시작 가능.

**검증**: 브라우저 콘솔에서 각 함수 단건 호출 → 200 응답

**소요**: 1시간 / **위험**: 낮음

---

## P3-T3 · `api/reviews.js` 3축 + photoUrls (P0 버그 fix)

**수정** `frontend/src/api/reviews.js`
```js
export const getReviews = (menuId, { page = 0, size = 20 } = {}) =>
  client.get('/reviews', { params: { menuId, page, size } }).then(r => r.data);

export const getMyReviews = () =>
  client.get('/reviews/me').then(r => r.data);

export const createReview = (menuId, { tasteRating, amountRating, valueRating, comment, photoUrls = [] }) =>
  client.post('/reviews', { menuId, tasteRating, amountRating, valueRating, comment, photoUrls }).then(r => r.data);

export const updateReview = (reviewId, { tasteRating, amountRating, valueRating, comment, photoUrls = [] }) =>
  client.put(`/reviews/${reviewId}`, { tasteRating, amountRating, valueRating, comment, photoUrls });

export const deleteReview = (reviewId) =>
  client.delete(`/reviews/${reviewId}`);
```

**선결**: BE-A-3 완료 + Phase 2 P2-T9/T10 (photoUrls) 배포 완료.

**임시 어댑터**: 기존 `MenuDetailModal`이 단일 `rating`을 보내는 상태이므로, P4-T8(MenuDetailPage 라우트 전환) 전까지 버그 fix만 단독 PR로 분리해도 좋다 — 모달이 어차피 폐기될 예정이므로 사이드 패치만 최소.

**검증**: 기존 모달 또는 임시 폼에서 리뷰 작성 → 200 (현재 깨진 상태 → 정상화 확인)

**소요**: 1시간 / **위험**: 중간

---

## P3-T4 · `components/hi/` 기초 9종 + `/dev/components` 카탈로그

### 디렉토리
```
frontend/src/components/hi/
├── Icon.jsx          (14개 SVG 아이콘 export — 디자인 핸드오프 ICONS 객체 그대로)
├── FoodIllust.jsx    (원형 배경 + Icon 조합)
├── Pill.jsx
├── Card.jsx
├── Button.jsx
├── Stars.jsx         (size: 'sm'(10px) | 'md'(14px) | 'lg'(32px))
├── UL.jsx            (웨이브 언더라인)
├── SecLabel.jsx
├── AxisBar.jsx       (3축 1행: 라벨 + bar + 수치)
└── Screen.jsx        (모바일 프레임 래퍼 — 데스크톱 중앙 정렬)
```

### 카탈로그 페이지 (검증용)
**신규** `frontend/src/pages/DevComponentsPage.jsx`
- App.jsx에 `<Route path="/dev/components" element={<DevComponentsPage />} />` 추가
- 각 컴포넌트의 모든 variant를 한 페이지에 나열
- 프로덕션 빌드에서도 접근 가능 (별도 보호 불필요)

**검증**:
- `/dev/components` 진입 → 9종 모두 렌더, 토큰 색상/그림자/폰트 일치
- 375 / 768 / 1280 뷰포트에서 깨지지 않음

**소요**: 4~5시간 / **위험**: 낮음 (디자인 핸드오프 그대로 포팅)

---

## P3-T5 · `components/hi/` 컴포지트 10종

### 추가
```
frontend/src/components/hi/
├── TabBarHi.jsx                (4탭 하단바)
├── BestCarousel.jsx            (TOP 5 가로 + 페이드 마스크)
├── WeekDayTabs.jsx             (월~금 균등 5분할)
├── CornerFilterChips.jsx       (가로 스크롤 칩)
├── MedalSticker.jsx            (🥇🥈🥉 원형)
├── MultiStarRating.jsx         (3축 32px 입력)
├── MultiStarSummary.jsx        (한 줄 압축)
├── BadgeProgressBar.jsx        (10px + 마커)
├── StatsGrid.jsx               (3열 그리드)
└── EmptyState.jsx              (회전 일러스트 + 메시지)
```

각 컴포넌트는 P3-T4의 기초 컴포넌트만 사용해서 조합. props는 디자인 핸드오프의 `hifi-screens-*.jsx` 사용 패턴을 그대로 따른다.

**카탈로그 추가**: `DevComponentsPage`에 컴포지트 섹션 추가 (각 1~3개 variant 시각 확인).

**검증**:
- 가로 스크롤(`BestCarousel`/`CornerFilterChips`) 모바일 터치 동작
- `MultiStarRating` 클릭 → 별점 채워짐 + scale pop
- `BadgeProgressBar` 진행도 0%/50%/100% 시각 차이

**소요**: 5~6시간 / **위험**: 중간 (가로 스크롤 페이드 마스크, 별점 hover/touch)

---

## Phase 3 게이트

- `npm run build` 성공
- `/dev/components`에서 19종 모두 시각 확인 (375/768/1280)
- 통과 후 Phase 4 시작
