# Frontend Design System (v2)

> 2026-04-19 전면 개편. v1(Zomato 레드)은 [`archive/DESIGN-v1.md`](./archive/DESIGN-v1.md)에 보존.

## [1] 디자인 컨셉

**"Pencil & Warm"** — 따뜻한 크림 종이 + 잉크 라인 + 손글씨 톤. 음식의 따뜻함과 학생식당의 친근함을 강조한다.

- 모바일 우선 (375 × 760), 데스크톱은 중앙 프레임
- 음식 이미지는 SVG 일러스트(`FoodIllust`) 플레이스홀더 → 점진적 사진 도입
- 강조: 라인 1.5px, 플랫 오프셋 그림자(`2px 3px 0`), 손글씨 폰트
- 인터랙션: 200~250ms ease-out, 별점 선택 시 `scale(1.15)` pop

---

## [2] 컬러 팔레트

```css
:root {
  --paper:       #FBF6EC;   /* 기본 배경 */
  --paper-deep:  #F4ECDC;   /* 카드 배경 */
  --ink:         #2B2218;   /* 본문/테두리 */
  --ink-soft:    #574635;   /* 보조 텍스트 */
  --mute:        #8E7A66;   /* 비활성/메타 */
  --rule:        #D8CBB6;   /* 구분선/점선 */

  --orange:      #EF8A3D;   /* 액센트(CTA, NEW) */
  --orange-soft: #FCE3C9;   /* CTA 배경, 스플래시 */
  --yellow:      #F4B73B;   /* 별점, 메달 노랑 */
  --yellow-soft: #FBE6A6;
  --green:       #4A8F5B;   /* 성공, 베스트 */
  --green-soft:  #CDE5C8;
  --peach:       #F6C7A8;   /* 일러스트 */
  --red:         #D9543A;   /* 에러 */
}
```

---

## [3] 타이포그래피

| 역할 | 폰트 | 비고 |
|---|---|---|
| 본문/UI (한글) | **Gaegu** | Google Fonts, 손글씨 톤 |
| 강조/타이틀 | **Jua** | Google Fonts, 둥근 sans |

```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Jua&display=swap" rel="stylesheet">
```

```css
:root {
  --font-hand: 'Gaegu', system-ui, sans-serif;
  --font-disp: 'Jua', system-ui, sans-serif;
}
```

### 사이즈 스케일

| 토큰 | 크기 | 용도 |
|---|---|---|
| `text-xs` | 11px | 메타·부제 |
| `text-sm` | 13px | 본문 보조 |
| `text-base` | 15px | 본문 |
| `text-lg` | 17px | 메뉴명 |
| `text-xl` | 20px | 섹션 라벨 |
| `text-2xl` | 24px | 페이지 헤더 |
| `text-3xl` | 30px | 브랜드 타이틀 (Jua) |

---

## [4] 스트로크 / 라운드 / 그림자

```css
:root {
  --stroke: 1.5px;
  --r-sm: 10px;
  --r-md: 14px;
  --r-lg: 20px;
  --r-screen: 32px;        /* 모바일 프레임 */

  --shadow-flat: 2px 3px 0 rgba(43, 34, 24, 0.18);
  --shadow-card: 2px 3px 0 rgba(43, 34, 24, 0.12);
  --shadow-pop:  3px 4px 0 rgba(43, 34, 24, 0.22);
}
```

테두리는 모두 `border: var(--stroke) solid var(--ink)`. 점선은 `border-dashed` + `--rule`.

---

## [5] 모바일 프레임 / 그리드

| 환경 | 너비 | 좌우 패딩 | 비고 |
|---|---|---|---|
| 모바일 | 375 (고정) | 16px | `Screen` 컴포넌트 |
| 태블릿 | 768 | 24px | 중앙 정렬 (Screen 그대로) |
| 데스크톱 | 1280 | 24px | 중앙 1100px max + 좌우 여백 |

`Screen` = 375 × 760 둥근(`--r-screen`) 종이 카드. 데스크톱에선 중앙 정렬된 단일 프레임.

```
모바일 메뉴 카드: 1열
태블릿: 2열
데스크톱: 3열
```

---

## [6] 디자인 시스템 — 기초 컴포넌트 (`src/components/hi/`)

| 컴포넌트 | 역할 |
|---|---|
| `Screen` | 모바일 프레임 래퍼 (375 × 760, `--r-screen`) |
| `Icon` | 14종 라인 SVG: bowl/soup/chop/star/starO/search/home/cal/list/user/heart/gear/pencil/cam/medal/fire/chev/x/plus/filter |
| `FoodIllust` | 원형 배경(`--peach` 등) + Icon 조합. 사진 미입력 시 fallback. |
| `Pill` | 작은 라벨 (NEW / 베스트 / TOP5 / 메달). 색상 토큰 props |
| `Card` | 1.5px ink 테두리 + 플랫 오프셋 그림자 |
| `Button` | `primary`(ink 배경 + paper 텍스트) / `default`(paper + ink 테두리) |
| `Stars` | 별점 행. 반올림 0.5 단위. props `size: 10/14/32` |
| `UL` | 웨이브 언더라인 SVG 반복 (제목 강조) |
| `SecLabel` | 섹션 라벨 + 우측 액세서리 슬롯 |
| `AxisBar` | 3축 1행 (라벨 + 1~5 바 + 수치) |

## [7] 디자인 시스템 — 컴포지트

| 컴포넌트 | 역할 |
|---|---|
| `TabBarHi` | 4탭 하단바 (홈/주간/전체/프로필) |
| `BestCarousel` | TOP 5 가로 스크롤 + 페이드 마스크 |
| `WeekDayTabs` | 월~금 균등 5분할 탭 |
| `CornerFilterChips` | 코너 필터 칩 가로 스크롤 |
| `MedalSticker` | 🥇/🥈/🥉 원형 스티커 (전체 메뉴 리스트) |
| `MultiStarRating` | 3축 32px 큰 별 입력 |
| `MultiStarSummary` | 리뷰 카드 안 "맛 5 양 4 가성비 5" 한 줄 |
| `BadgeProgressBar` | 다음 뱃지 진행도 (10px, 마커) |
| `StatsGrid` | 통계 카드 3개 grid |
| `EmptyState` | 빈 상태 (회전 일러스트 + 메시지) |

`Screen`/`Icon`/그 외 모든 신규 컴포넌트는 **`frontend/src/components/hi/`** 하위에 둔다. 기존 `components/` 아래는 v1 컴포넌트(점진 교체).

---

## [8] 페이지 레이아웃 (7화면)

### 8.1 홈 `/`
```
┌──────────────────────────────────┐
│ [헤더: 학식 today]      [user]   │
│ ✨ 오늘 메뉴 (LUNCH)              │
│ ── 코너 리스트 (정렬↓)            │
│ 🏆 이번 주 BEST  → 가로 5개       │
│ ┌────┐ ┌────┐ ...  BestCarousel │
│ └────┘ └────┘                   │
└──────────────────────────────────┘
[홈] [주간] [전체] [프로필]  TabBarHi
```

### 8.2 주간 `/weekly`
```
┌──────────────────────────────────┐
│ [헤더: 주간 식단]                 │
│ [월] [화] [수] [목▶] [금]  WeekDayTabs │
│ ── 선택한 요일의 코너 리스트       │
│  [한식]  메뉴1 [NEW] ★4.3        │
│  [양식]  메뉴2                   │
└──────────────────────────────────┘
```

### 8.3 전체 메뉴 `/menus`
```
┌──────────────────────────────────┐
│ 🔍 검색 입력                      │
│ CornerFilterChips: 전체|한식...   │
│ 정렬 안내: 별점↓                  │
│ ── 점선 구분 리스트                │
│ 🥇 메뉴 ★4.7 (24)                │
│ 🥈 메뉴 ★4.2 (12) [NEW]          │
└──────────────────────────────────┘
```

### 8.4 메뉴 상세 `/menus/:id`
```
┌──────────────────────────────────┐
│ [← 뒤로]                          │
│ FoodIllust 큰 헤더                │
│ 메뉴명 (Jua) · 코너 · 날짜         │
│ AxisBar 3축 평균                  │
│ ── 리뷰 리스트 ──                 │
│ [리뷰] 닉네임 🥈                  │
│         MultiStarSummary         │
│         코멘트 + 사진 썸네일       │
│                                  │
│ [⌥ 리뷰 쓰기 CTA]                │
└──────────────────────────────────┘
```

### 8.5 리뷰 작성 `/menus/:id/review`
```
┌──────────────────────────────────┐
│ [← 취소]   리뷰 쓰기   [등록]     │
│ FoodIllust + 메뉴명               │
│ MultiStarRating (32px 별 3행)    │
│   맛 ★★★★★                       │
│   양 ★★★★☆                       │
│   가성비 ★★★★★                    │
│ 한 마디 textarea (500자)          │
│ [+ 사진 첨부] (Phase D)           │
└──────────────────────────────────┘
```

### 8.6 프로필 `/profile`
```
┌──────────────────────────────────┐
│ [user 아바타 색상원] 닉네임 ✎      │
│ 🥈 다음 뱃지까지 N개               │
│ BadgeProgressBar                 │
│ StatsGrid (리뷰 / 평점 / 메달)     │
│ ── 내가 쓴 리뷰 (압축형) ──       │
│ [로그아웃]                        │
└──────────────────────────────────┘
```

### 8.7 온보딩 (3종 시퀀스)
1. **OnboardingLogin** — orangeSoft 배경 + Google G 로고 (스플래시)
2. **NicknameSetupModal** — 추천 닉네임 칩 5개 + 가용성 체크 (한 번 정하면 30일간 변경 어려움 안내)
3. **EmptyState** — 메뉴/리뷰 없을 때 회전 일러스트 + "첫 리뷰의 주인공이 되어보세요"

---

## [9] 메달 / 뱃지 임계값

### 사용자 뱃지 (`BadgeTier.of(reviewCount)`)
| 뱃지 | 조건 |
|---|---|
| NONE | 0 |
| 🥉 BRONZE | 1~4 |
| 🥈 SILVER | 5~29 |
| 🥇 GOLD | 30+ |

### 메뉴 메달 (`MenuTier.of(avgOverall, reviewCount)`)
| 메달 | 평균 별점 | 리뷰 수 |
|---|---|---|
| 🥇 GOLD | ≥ 4.5 | ≥ 20 |
| 🥈 SILVER | ≥ 4.0 | ≥ 10 |
| 🥉 BRONZE | ≥ 3.5 | ≥ 5 |
| 없음 | 그 외 | 그 외 |

### NEW 윈도우
- `firstSeenAt + 7일` 이내면 `isNew = true`

---

## [10] 애니메이션

| 대상 | 효과 | 지속 |
|---|---|---|
| 페이지 진입 | `fadeInUp` (opacity 0→1, translateY 8px→0) | 250ms ease-out |
| 카드 tap | `scale(0.98)` | 120ms |
| 별점 선택 | `scale(1.15)` pop | 150ms |
| 모달 진입 | overlay `fadeIn` + 시트 `slideUp` | 220ms |
| EmptyState 일러스트 | `rotate(-6deg → 0deg)` 미세 회전 | 800ms ease-out |

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## [11] 참고 라이브러리

| 라이브러리 | 용도 |
|---|---|
| (없음) | 아이콘은 `Icon` 컴포넌트로 자체 SVG 14종. lucide-react 의존성 제거 |
| `@react-oauth/google` | Google 로그인 |
| `@tanstack/react-query` | 서버 상태 (캐싱, 낙관적 업데이트) |

---

## [12] Tailwind 설정 가이드

`tailwind.config.js`에 토큰 등록:

```js
export default {
  theme: {
    extend: {
      colors: {
        paper: '#FBF6EC', paperDeep: '#F4ECDC',
        ink: '#2B2218', inkSoft: '#574635', mute: '#8E7A66', rule: '#D8CBB6',
        orange: '#EF8A3D', orangeSoft: '#FCE3C9',
        yellow: '#F4B73B', yellowSoft: '#FBE6A6',
        green: '#4A8F5B', greenSoft: '#CDE5C8',
        peach: '#F6C7A8', red: '#D9543A',
      },
      boxShadow: {
        flat: '2px 3px 0 rgba(43,34,24,0.18)',
        card: '2px 3px 0 rgba(43,34,24,0.12)',
        pop:  '3px 4px 0 rgba(43,34,24,0.22)',
      },
      fontFamily: {
        hand: ['Gaegu', 'system-ui', 'sans-serif'],
        disp: ['Jua', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        screen: '32px',
      },
    },
  },
}
```
