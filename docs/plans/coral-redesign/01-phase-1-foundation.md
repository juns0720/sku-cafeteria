# Phase v3-1 — Foundation (디자인 시스템 + 컴포넌트)

> **역할**: Coral 디자인 시스템을 `frontend/`에 깔고, `components/coral/` 하위에 컴포넌트 19종을 구축한다. 페이지 재작성(Phase v3-2)의 전제 조건.
> **체크박스**: [`./99-progress.md`](./99-progress.md)

---

## 게이트

- `npm run build` 성공
- `/dev/components` 페이지에서 coral 카탈로그 섹션이 보이고, 19개 컴포넌트가 모두 렌더링됨
- 375 / 768 / 1280 뷰포트에서 시각 깨짐 없음
- 기존 hi/ 컴포넌트와 coral/ 컴포넌트가 충돌 없이 병행 동작 (App.jsx 라우터에서는 아직 hi/만 사용)

---

## V3-T1 — Tailwind 토큰 추가

**파일**: `frontend/tailwind.config.js`

기존 v2 토큰(paper/ink/orange 등)은 **유지**한다(Phase v3-3에서 일괄 제거). Coral 토큰은 추가만.

추가할 토큰:

```js
// theme.extend.colors
coral:        '#FF6B5C',
coralSoft:    '#FFEEEC',
g50:  '#F9FAFB', g100: '#F2F4F6', g200: '#E5E8EB', g300: '#D1D6DB',
g400: '#B0B8C1', g500: '#8B95A1', g600: '#6B7684', g700: '#4E5968',
g800: '#333D4B', g900: '#191F28',
// (참고: 기존 'success' #4A8F5B는 유지, Coral 디자인의 일품 카테고리에서 재사용)
```

```js
// theme.extend.boxShadow
frame: '0 8px 24px rgba(25,31,40,0.08)',  // 모바일 프레임 전용
hairline: 'inset 0 -1px 0 #E5E8EB',         // 헤어라인 구분선
```

```js
// theme.extend.fontFamily
pretendard: ['Pretendard', 'system-ui', 'sans-serif'],
```

```js
// theme.extend.borderRadius
'2xs': '4px', xs: '6px',
// (기존 sm/md/lg/screen 유지)
```

**검증**: `npm run dev` 후 임시 컴포넌트에서 `bg-coral text-g900 shadow-frame font-pretendard` 클래스가 컴파일되는지 확인.

---

## V3-T2 — Pretendard 폰트 추가

**파일**: `frontend/index.html`

기존 Gaegu/Jua link는 **유지**(Phase v3-3에서 제거). Pretendard CDN을 추가:

```html
<link rel="stylesheet" as="style" crossorigin
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />
```

`tailwind.config.js`에 `pretendard` 폰트 패밀리가 이미 등록되어 있으면 OK.

**검증**: 브라우저 DevTools에서 `body { font-family: ... }` 확인 후 Pretendard 사용 여부 점검.

---

## V3-T3 — coral/Icon.jsx (17 SVG)

**파일**: `frontend/src/components/coral/Icon.jsx` (신규)

`new_handoff/source/coral-system.jsx`의 `CIcon` 컴포넌트에서 SVG path 17종을 추출해 단일 컴포넌트로 작성. 사용 패턴:

```jsx
<Icon name="bowl" size={24} className="text-g900" />
```

아이콘 목록(name): `bowl`, `soup`, `chop`, `star`, `starO`(빈 별), `search`, `home`, `cal`, `list`, `user`, `heart`, `gear`, `pencil`, `cam`, `medal`, `check`, `plus`, `arrow`, `x`, `chev`, `filter` (총 21개 — 기존 14에 7개 추가). path는 `new_handoff/source/coral-system.jsx`의 정확한 d 속성을 그대로 복사.

```jsx
const PATHS = {
  bowl: 'M4 11h16a8 8 0 0 1-16 0z M4 11h16',
  // ... (handoff에서 복사)
};

export default function Icon({ name, size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         className={className}>
      <path d={PATHS[name]} />
    </svg>
  );
}
```

**검증**: `/dev/components`에 모든 아이콘 그리드로 렌더링.

---

## V3-T4 — 기본 컴포넌트 9종

**파일**: `frontend/src/components/coral/{Frame,Status,Header,Stars,Chip,Sec,Thumb,Button,Tab}.jsx`

| 컴포넌트 | 역할 | props 핵심 |
|---|---|---|
| `Frame` | 모바일 375×760 프레임 + frameShadow | `children` |
| `Status` | iOS 스타일 상태바 (시간/배터리) | (정적) |
| `Header` | 페이지 상단 헤더 (좌·중·우 슬롯) | `left`, `title`, `right` |
| `Stars` | 별점 표시 (코랄, 반올림) | `value`, `size` |
| `Chip` | 작은 태그 (NEW/BEST/메달/카테고리 필터) | `tone: 'coral'\|'gray'\|'green'`, `active` |
| `Sec` | 섹션 라벨 (좌 텍스트 + 우 액세서리) | `title`, `right` |
| `Thumb` | 음식 썸네일(그레이 + 아이콘). corner→illustration 매핑 내장 | `corner`, `size`, `colored?` |
| `Button` | primary(코랄 BG)/default(헤어라인) | `variant`, `disabled`, `onClick` |
| `Tab` | 4탭 하단바 (홈/주간/전체/프로필) | `current` |

`Thumb`의 corner→illustration 매핑(D10):
```js
const ICON_BY_CORNER = {
  '한식': 'bowl', '양식': 'chop', '분식': 'soup', '일품': 'bowl',
  KOREAN: 'bowl', WESTERN: 'chop', SNACK: 'soup', SPECIAL: 'bowl',
};
```

**검증**: 각 컴포넌트별 시각 테스트 — `/dev/components` 카탈로그.

---

## V3-T5 — 컴포지트 컴포넌트 10종

**파일**: `frontend/src/components/coral/{BestRow,WeekPicker,CategoryFilter,MedalDot,MultiStarInput,MultiStarSummary,ProgressBar,StatsGrid,Empty,AxisProgress}.jsx`

| 컴포넌트 | 역할 | 사용 페이지 |
|---|---|---|
| `BestRow` | TOP 5 가로 스크롤 (124×124 카드) | HomePage |
| `WeekPicker` | 월~금 5분할 요일 탭 | WeeklyPage |
| `CategoryFilter` | 코너 필터 칩 가로 스크롤 | AllMenusPage |
| `MedalDot` | 🥇/🥈/🥉 작은 원형 스티커 | AllMenusPage 리스트 |
| `MultiStarInput` | 3축 32px 큰 별 입력 (맛/양/가성비) | ReviewWritePage |
| `MultiStarSummary` | 리뷰 카드 안 한 줄 요약 ("맛 5 양 4 가성비 5") | MenuDetailPage 리뷰 카드 |
| `ProgressBar` | 다음 뱃지 진행도 (10px, 마커) | ProfilePage |
| `StatsGrid` | 통계 카드 3개 grid | ProfilePage |
| `Empty` | 빈 상태 (회전 일러스트 + 메시지 + CTA) | 모든 페이지 |
| `AxisProgress` | 메뉴 상세 3축 평균 막대 (5분할) | MenuDetailPage |

`Empty` props: `icon` (Icon name), `title`, `description`, `cta?: {label, onClick}`.

**검증**: `/dev/components`에 컴포지트 카탈로그 섹션 추가.

---

## V3-T6 — `/dev/components` 카탈로그 갱신

**파일**: `frontend/src/pages/DevComponentsPage.jsx` (수정)

기존 hi/ 카탈로그는 **유지**(병행 점검용). coral/ 컴포넌트 19종을 추가 섹션으로 렌더링:

```
1. Coral · Icons        → 17개 아이콘 그리드
2. Coral · Basics       → 9개 기본 컴포넌트
3. Coral · Composites   → 10개 컴포지트
4. Coral · Color Tokens → 색상 팔레트 시각화
5. Coral · Typography   → Pretendard 사이즈 스케일
```

기존 hi/ 섹션 위에 coral/ 섹션을 배치(가시성 우선).

**검증**: `npm run dev` → `http://localhost:5173/dev/components` 접속 → 19개 컴포넌트 + 21개 아이콘 + 컬러 토큰 + 타이포 모두 노출 확인.

---

## 완료 정의 (Definition of Done)

- [ ] `tailwind.config.js`에 coral/g50~g900/frame shadow/Pretendard 토큰 등록
- [ ] `index.html`에 Pretendard CDN link 추가
- [ ] `frontend/src/components/coral/` 19개 파일 + Icon.jsx 1개 = 총 20개 파일 생성
- [ ] `/dev/components` 페이지에 coral 카탈로그 섹션 추가
- [ ] `npm run build` 성공
- [ ] 375 / 768 / 1280 뷰포트 시각 확인
- [ ] hi/와 coral/ 두 시스템이 충돌 없이 공존 (라우터는 아직 hi/만 사용)
