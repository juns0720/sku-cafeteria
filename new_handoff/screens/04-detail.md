# 화면 ④ 메뉴 상세 (CoralDetail)

> 원본: `source/coral-detail-write.jsx` (CoralDetail) · 라우트 `/menu/[id]`

## 구조

```
CFrame
├── CStatus
├── CHeader (배경 흰색, 좌: chevL, 우: heart 아이콘)
├── Hero (padding 0 24 18, display flex, gap 16, items center)
│   ├── 큰 썸네일 140×140, radius 24, bg #F2F4F6
│   │   └── bowl 아이콘 70 / #8B95A1 / w 1.5
│   └── 정보 (flex 1)
│       ├── 카테고리 — 12 / 600 / #8B95A1
│       ├── 메뉴명 — 26 / 800 / -0.7 / #191F28 (marginTop 2)
│       └── 별점 row (marginTop 6, gap 6)
│           ├── CStars value=5 size=16 c=#FF6B5C
│           ├── 점수 — 17 / 800 / #191F28 ("4.7")
│           └── "· 리뷰 24개" — 13 / #8B95A1
├── 3축 평균 카드 (margin 0 24 22, padding 16, radius 16, bg #F9FAFB)
│   └── 3 row (맛 / 양 / 가성비)
│       ├── 라벨 row (gap 8)
│       │   ├── 라벨 (예: "맛") — 14 / 700
│       │   └── 점수 (예: "4.7") — 14 / 800 / 코랄
│       └── 진행도 바 (marginTop 6)
│           ├── height 4, bg #E5E8EB, radius 999
│           └── filled: bg #FF6B5C, width = (v/5)*100%
├── 리뷰 섹션 헤더 (padding 0 24 14)
│   ├── 좌: "리뷰 24" (18 / 800 / -0.4)
│   └── 우: "정렬 ▾" (13 / 600 / #4E5968)
├── 리뷰 카드 리스트 (padding 0 24, gap 14)
│   └── 카드 × N
│       ├── 작성자 row (gap 10, items center)
│       │   ├── 아바타 32×32 radius 16 bg #F2F4F6 (이니셜 13/700)
│       │   ├── 닉네임 — 13 / 700
│       │   ├── "· 4월 19일" — 11 / #8B95A1
│       │   └── 우측: 종합 별점 (CStars 12 + 점수 13/700)
│       └── 본문 (marginTop 8)
│           └── 텍스트 — 13 / 500 / line-height 1.5
└── 작성 CTA (fixed bottom)
    ├── padding 12 24 18
    └── CButton primary size=lg width=100% — "리뷰 작성하기"
```

## API

```
GET /api/menu/[id]
→ {
    id, name, category, illustration,
    rating: { overall, taste, portion, value },
    reviewCount,
    reviews: [{ id, author, avatarInitial, date, ratings: {...}, comment }]
  }
```
