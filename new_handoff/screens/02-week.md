# 화면 ② 주간 식단 (CoralWeek)

> 원본: `source/coral-week-all.jsx` (CoralWeek) · 라우트 `/week`

## 구조

```
CFrame
├── CStatus
├── CHeader title="주간 식단" (백버튼 없음 — 메인 탭)
├── 주차 셀렉터 row (padding 0 24 14)
│   ├── 좌: chevL (20 / #191F28 / w 2)
│   ├── 가운데: "4월 19일 - 4월 25일" (15 / 700 / -0.3)
│   └── 우: chevR (20 / #191F28 / w 2)
├── 요일 칩 가로 스크롤 (padding 0 24 18, gap 8)
│   └── 월~금 (오늘=월요일은 active)
│       ├── active: bg #191F28 / color #fff / weight 700
│       └── inactive: bg #F2F4F6 / color #4E5968 / weight 600
│       └── 모두 padding 8 14, radius 999, fontSize 13, "{요일}"
├── 카테고리 그룹 리스트 (flex 1, overflow auto, padding 0 24)
│   └── group ×N
│       ├── 카테고리 라벨 (padding 6 0 4)
│       │   └── "한식" / "양식" 등 (13 / 800 / -0.3 / #191F28)
│       └── 메뉴 row (padding 10 0, display flex, gap 12, items center)
│           ├── 썸네일 48×48, radius 12, bg #F2F4F6 (icon 24 / #8B95A1 / w 1.6)
│           ├── 가운데 (flex 1, minWidth 0)
│           │   ├── 타이틀 row (gap 6)
│           │   │   ├── 메뉴명 — 15 / 700 / -0.3 / #191F28
│           │   │   └── NEW 뱃지 (옵션)
│           │   │       └── 10 / 700 / #FF6B5C / bg #FFEEEC / padding 2 6 / radius 4
│           │   └── 별점 row (marginTop 3, gap 4)
│           │       ├── 평점 있을 때: star 11(코랄) + 점수(12.5/700) + "· 리뷰 N"(11/#8B95A1)
│           │       └── NEW(평점 없음): "리뷰를 남겨주세요" (11 / 500 / #8B95A1)
│           └── chevR 12 (#B0B8C1, w 1.8)
└── CTab active="week"
```

## ⚠ 주간 화면 규칙

- **1위 뱃지 사용 금지** — 주간에서는 NEW만 표시
- NEW 메뉴는 평점이 없으므로 별점 영역에 "리뷰를 남겨주세요" 텍스트 표시

## 데이터 (mock)

```js
const groups = [
  { c: '한식', items: [
    { m: '김치찌개 정식', r: 4.3, n: 18, ill: 'soup' },
    { m: '제육볶음',     r: 4.5, n: 31, ill: 'bowl' },
  ]},
  { c: '양식', items: [
    { m: '치킨까스',           r: 4.7, n: 24, ill: 'bowl' },
    { m: '바질 크림 파스타',  r: null, n: 0, ill: 'bowl', nw: true },
  ]},
  // ...
];
```

## API 엔드포인트

```
GET /api/week?start=YYYY-MM-DD
→ {
    range: { start, end },
    days: [{ date, dayOfWeek, groups: [{ category, items: [...] }] }]
  }

각 item: { id, name, rating: number | null, reviewCount, illustration, isNew }
```

## NEW 판정 로직 (data-model.md 참조)

```
isNew = (해당 메뉴가 메뉴 DB에 처음 등장한 게 이번 주 크롤링)
```

## 인터랙션

- 주차 chev 좌/우 → ±7일 주차 이동
- 요일 칩 탭 → 해당 요일로 스크롤 (또는 데이터 필터)
- 메뉴 row 탭 → `/menu/[id]`
