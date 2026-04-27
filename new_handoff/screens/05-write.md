# 화면 ⑤ 리뷰 작성 (CoralWrite)

> 원본: `source/coral-detail-write.jsx` (CoralWrite) · 라우트 `/menu/[id]/write`

## 구조

```
CFrame
├── CStatus
├── CHeader (좌: X 20px / 가운데: "리뷰 쓰기" / 우: "임시저장")
├── 메뉴 정보 row (padding 0 24 18)
│   ├── 썸네일 48×48, radius 12, bg #F2F4F6
│   └── 정보
│       ├── 메타 — "양식 · 4월 20일" (11 / 500 / #8B95A1)
│       └── 메뉴명 — 17 / 800 / -0.4 ("치킨까스")
├── 3축 별점 입력 (padding 0 24, gap 28 between axes)
│   └── 축 × 3 (맛 / 양 / 가성비)
│       ├── 라벨 row (justify space-between, items baseline)
│       │   ├── 좌: 라벨 — 16 / 800 / -0.3
│       │   │   + sublabel (옵션) — 12 / #8B95A1 marginLeft 8
│       │   └── 우: 점수 (예: "5.0") — 14 / 800 / #FF6B5C
│       └── 별 5개 row (marginTop 10, gap 6)
│           └── 각 별 32×32, c=코랄 또는 #D1D6DB, w 1.6
├── 코멘트 박스 (margin 28 24 0)
│   ├── 라벨 row
│   │   ├── 좌: "한 마디" (16 / 800) + "(선택)" (12 / #8B95A1 marginLeft 8)
│   │   └── 우: cam 아이콘 18 / #6B7684 / w 1.7
│   └── 입력 박스 (marginTop 10, padding 14, minHeight 100, bg #F9FAFB, radius 14)
│       └── placeholder/text — 14 / 500 / line-height 1.6 / #6B7684
│       └── 우측 끝에 코랄 커서 라인 (border-left 2px / 16px height) — 입력 흉내
└── 등록 CTA (fixed bottom)
    └── padding 12 24 18 / CButton accent size=lg width=100% — "리뷰 등록"
```

## 3축 라벨

| 축 | label | sublabel |
|---|---|---|
| 맛 | 맛 | "얼마나 맛있었나요?" |
| 양 | 양 | "양은 충분했나요?" |
| 가성비 | 가성비 | "값어치 했나요?" |

## 인터랙션

- 별 탭 → 1~5점 단계로 점수 결정
- 라벨에서 좌→우 드래그 시 점수 인터랙션 가능 (옵션)
- 등록: 3축 모두 점수 매겨야 활성화 (밸리데이션)
- 코멘트는 선택, 사진 첨부도 선택

## API

```
POST /api/review
body: {
  menuId, servingDate,
  ratings: { taste: 1-5, portion: 1-5, value: 1-5 },
  comment?, imageUrl?
}
→ { reviewId, createdAt }
```
