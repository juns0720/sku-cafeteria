# 화면 ③ 전체 메뉴 (CoralAll)

> 원본: `source/coral-week-all.jsx` (CoralAll) · 라우트 `/all`

## 구조

```
CFrame
├── CStatus
├── CHeader title="전체 메뉴"
├── 검색 박스 (padding 0 24 14)
│   ├── height 44, bg #F9FAFB, radius 12, padding 0 14
│   ├── search 아이콘 18 / #8B95A1 / w 1.7
│   └── placeholder "메뉴 검색" (14 / 500 / #8B95A1)
├── 카테고리 칩 가로 스크롤 (padding 0 24 14, gap 8)
│   └── ['전체', '한식', '양식', '일품', '분식', '중식']
│       └── '전체' active 기본
├── 정렬 row (padding 0 24 6, justify space-between)
│   ├── 좌: "총 N개" (12 / 600 / #6B7684)
│   └── 우: "별점순 ▾" (13 / 600 / #4E5968 + chevD 9)
├── 메뉴 리스트 (flex 1, overflow auto, padding 0 24)
│   └── row × N
│       ├── 썸네일 48×48, radius 12 (단색 그레이)
│       ├── 가운데 (flex 1)
│       │   ├── 카테고리 라벨 row (gap 6)
│       │   │   ├── 카테고리 — 12.5 / 500 / #8B95A1
│       │   │   └── BEST 뱃지 (옵션, top: true 항목만)
│       │   │       └── 10 / 800 / #fff / bg #FF6B5C / padding 2 6 / radius 4
│       │   └── 메뉴명 — 15.5 / 700 / -0.3
│       └── 우측 (textAlign right)
│           ├── 별점 row — star 12 (코랄) + 14/700 점수
│           └── "리뷰 N" — 11 / #8B95A1
└── CTab active="all"
```

## ⚠ 전체 메뉴 규칙

- 전체에서는 **BEST** 뱃지 사용 가능 (전 기간 누적 인기 메뉴 표시용)
- 1위 뱃지는 사용 안 함 (홈에서만 사용)

## 데이터 (mock)

```js
const items = [
  { m: '치킨까스',     c: '양식', r: 4.7, n: 24, ill: 'bowl', best: true },
  { m: '제육볶음',     c: '한식', r: 4.5, n: 31, ill: 'bowl' },
  { m: '순두부찌개',   c: '일품', r: 4.3, n: 18, ill: 'soup' },
  // ...
];
```

## 정렬 옵션

- 별점순 (default)
- 가나다순
- 리뷰 많은 순

## API

```
GET /api/menus?category=전체&sort=rating&q=검색어
→ MenuItem[]
```
