# 화면 ① 홈 (CoralHome)

> 원본: `source/coral-home.jsx` · 라우트 `/`

## 구조

```
CFrame (375 × 760)
├── CStatus
├── 헤더 (padding 8 24 22)
│   ├── 날짜 — "4월 20일 월요일" (13 / 600 / #6B7684)
│   └── 타이틀 — "SKU 학식" (24 / 800 / -0.7 / #191F28, marginTop 4)
├── 메인 (flex:1, overflow:hidden)
│   ├── 섹션1: 오늘의 베스트
│   │   ├── 헤더 row (padding 0 24 12)
│   │   │   ├── 좌: "오늘의 베스트 [5]" (18 / 800 / -0.4)
│   │   │   │   └── "5"는 코랄(#FF6B5C)
│   │   │   └── 우: "전체" (13 / 600 / #6B7684)
│   │   └── 가로 스크롤 (padding 0 0 22)
│   │       └── 5개 카드 (gap 12, padding 0 24, width: max-content)
│   └── 섹션2: 오늘의 메뉴
│       ├── 헤더 row (padding 0 24 6)
│       │   ├── 좌: "오늘의 메뉴" (17 / 800 / -0.4)
│       │   └── 우: "별점순 ▾" (13 / 600 / #4E5968 + chevD 9px)
│       └── 리스트 (padding 0 24, flex 1)
│           └── 4개 row
└── CTab active="home"
```

## 베스트 카드 명세 (1~5위)

```
폭 124, flex-shrink 0
├── 썸네일 124×124, radius 14, bg #F2F4F6, position relative
│   ├── 음식 아이콘 50px, c #8B95A1, w 1.5
│   └── 뱃지 (top 8, left 8)
│       ├── 1위: bg #FF6B5C / color #fff
│       └── 2~5위: bg #fff / color #191F28
│       └── padding 2 8, radius 999, fontSize 11, weight 800, "{i+1}위"
├── 메뉴명 (marginTop 8) — 14.5 / 700 / -0.2
├── 카테고리 (marginTop 1) — 12 / 500 / #8B95A1
└── 별점 row (marginTop 4) — gap 3
    ├── star 12px (코랄)
    ├── 점수 — 13 / 700
    └── 리뷰수 — "(N)" 11 / #8B95A1
```

### 데이터 (mock)

```js
const BEST = [
  { m: '치킨까스',   c: '양식', r: 4.7, n: 24, ill: 'bowl' },
  { m: '제육볶음',   c: '한식', r: 4.5, n: 31, ill: 'bowl' },
  { m: '순두부찌개', c: '일품', r: 4.3, n: 18, ill: 'soup' },
  { m: '김치찌개',   c: '한식', r: 4.2, n: 15, ill: 'soup' },
  { m: '라볶이',     c: '분식', r: 4.0, n: 9,  ill: 'bowl' },
];
```

## 오늘의 메뉴 row 명세

```
padding 13 0
display: flex; gap 14; align-items: center
├── 썸네일 50×50, radius 12, bg #F2F4F6 (icon 24 / #8B95A1 / w 1.6)
├── 가운데 (flex 1, minWidth 0)
│   ├── 메타 row (gap 6)
│   │   ├── 카테고리 — 12 / 500 / #8B95A1
│   │   └── NEW 뱃지 (옵션)
│   │       └── fontSize 10 / weight 700 / color #FF6B5C / bg #FFEEEC / padding 1 6 / radius 3
│   └── 메뉴명 (marginTop 1) — 15.5 / 700 / -0.3
└── 우측 (textAlign right)
    ├── 별점 row (gap 3, justify flex-end)
    │   ├── star 12 (코랄)
    │   └── 점수 — 14 / 700
    └── "리뷰 N" (marginTop 2) — 11 / #8B95A1
```

### 데이터 (mock)

```js
const TODAY = [
  { c: '양식', m: '치킨까스',     r: 4.7, n: 24, ill: 'bowl' },
  { c: '한식', m: '김치찌개 정식', r: 4.3, n: 18, ill: 'soup' },
  { c: '일품', m: '순두부찌개',   r: 4.1, n: 11, ill: 'soup', nw: true },
  { c: '분식', m: '비빔국수',     r: 3.9, n: 7,  ill: 'bowl' },
];
```

## 정렬 메뉴 (드롭다운)

"별점순 ▾" 클릭 시 옵션:
- 별점순 (default)
- 가나다순
- 리뷰 많은 순

## 인터랙션 / 라우팅

- 베스트 카드 탭 → `/menu/[id]`
- 오늘의 메뉴 row 탭 → `/menu/[id]`
- "전체" 탭 → `/all` (전체 메뉴 리스트)
- 정렬 드롭다운 → 클라이언트 단 정렬
- 헤더에 알림 아이콘 ❌ (웹앱이라 알림 없음)

## API 엔드포인트

```
GET /api/today
→ { date, mealType, today: TodayItem[], best: BestItem[] }
```

## 변경 이력

- 알림(bell) 아이콘 제거 (웹앱)
- 베스트 가로 스크롤 + 1~5위 뱃지
- "오늘 운영 중" → "오늘의 메뉴"로 라벨 변경
