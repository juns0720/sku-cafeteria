# 화면 ⑨ 빈 상태 (CoralEmpty)

> 원본: `source/coral-profile-onboarding.jsx` (CoralEmpty)

빈 상태(empty state)의 공통 패턴. 프로필의 "내 리뷰가 없을 때", 검색 결과 없음, 주간에 등록된 메뉴 없음 등에 재사용.

## 구조

```
CFrame
├── CStatus
├── CHeader title="내 리뷰" (좌측 chevL)
├── 메인 (flex 1, padding 24, justify center, items center)
│   └── Empty 히어로 (padding 36 20, radius 20, bg #F9FAFB, textAlign center, width 100%)
│       ├── 아이콘 박스 72×72 radius 20 bg #fff
│       │   └── pencil 아이콘 36 / #B0B8C1 / w 1.6
│       ├── 타이틀 (marginTop 18)
│       │   └── "아직 작성한 리뷰가 없어요" (16 / 800 / -0.3 / #191F28)
│       └── 서브 (marginTop 6, lh 1.5)
│           └── "오늘 먹은 메뉴를\n첫 리뷰로 남겨보세요" (13 / 500 / #6B7684)
└── CTA (padding 0 24)
    └── CButton accent size=lg width=100% — "리뷰 작성하러 가기"
```

## 공통 빈 상태 변형

| 위치 | 아이콘 | 메인 카피 | CTA |
|---|---|---|---|
| 내 리뷰 없음 | pencil | "아직 작성한 리뷰가 없어요" | "리뷰 작성하러 가기" |
| 주간 메뉴 없음 | cal | "이 주는 식단이 아직 등록되지 않았어요" | (CTA 없음) |
| 검색 결과 없음 | search | "검색 결과가 없어요" | (CTA 없음) |
| 운영 종료 (오늘) | x | "오늘은 학식 운영이 없어요" | "주간 식단 보기" |
