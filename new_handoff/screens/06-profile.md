# 화면 ⑥ 프로필 (CoralProfile)

> 원본: `source/coral-profile-onboarding.jsx` (CoralProfile) · 라우트 `/me`

## 구조

```
CFrame
├── CStatus
├── 헤더 (padding 8 24, justify space-between, items center)
│   ├── 좌: "내 프로필" (24 / 800 / -0.7)
│   └── 우: gear 아이콘 24 / #4E5968 / w 1.7
├── 프로필 카드 (margin 6 24 18, padding 16, radius 18, bg #F9FAFB)
│   ├── 아바타 60×60 radius 30 bg #fff
│   │   └── 이니셜 (예: "밥") — 24 / 800 / -1 / #191F28
│   ├── 정보 (marginLeft 14, flex 1)
│   │   ├── 닉네임 — 18 / 800 / -0.3 ("밥상탐험가")
│   │   ├── 이메일/학번 — 12 / 500 / #8B95A1 marginTop 2
│   │   └── 가입일 — 11 / #8B95A1 marginTop 2
│   └── chevR 14 / #B0B8C1 (편집 진입 힌트)
├── 진행도 카드 (margin 0 24 16, padding 14, radius 14, bg #F9FAFB)
│   ├── 라벨 row
│   │   ├── 좌: "다음 뱃지 [🥇 대가]까지" (13 / 600 / #4E5968)
│   │   └── 우: "16개 남음" (13 / 800 / #FF6B5C)
│   ├── 진행도 바 (marginTop 10, height 8, bg #E5E8EB, radius 999)
│   │   └── filled: width 47%, bg #FF6B5C, radius 999
│   └── 캡션 row (marginTop 6, justify space-between)
│       ├── "리뷰 14" (11 / #8B95A1)
│       └── "30 / 30" (11 / #8B95A1)
├── 통계 row (margin 0 24 16, gap 8)
│   └── 3개 카드 (각 flex 1)
│       └── padding 14 8, textAlign center, bg #F9FAFB, radius 14
│           ├── 큰 숫자 — 22 / 800 / -0.5 / #191F28
│           └── 라벨 (marginTop 2) — 11 / 600 / #6B7684
│   ├── 14 / 리뷰
│   ├── 4.3 / 평균
│   └── 2 / 뱃지
├── 내 리뷰 섹션 (padding 0 24)
│   ├── 헤더 row
│   │   ├── 좌: "내 리뷰" (16 / 800 / -0.3)
│   │   └── 우: "전체" (13 / 600 / #6B7684)
│   └── 리뷰 row × N (padding 14 0, border-bottom #F2F4F6)
│       ├── 썸네일 44×44 radius 12 (단색 그레이)
│       ├── 가운데
│       │   ├── 메뉴명 — 14 / 700 / -0.3
│       │   ├── 별점 row (marginTop 3) — CStars 11 + "· {category}" 11 / #8B95A1
│       └── 우측: 종합 점수 row — star 12 (코랄) + 14 / 700
└── CTab active="me"
```

## 데이터 (mock)

```js
const profile = {
  nickname: '밥상탐험가',
  initial: '밥',
  email: 'sungkyul@example.com',
  joinedAt: '2026-03-15',
  stats: { reviews: 14, avg: 4.3, badges: 2 },
  nextBadge: { name: '대가', emoji: '🥇', current: 14, goal: 30 },
  myReviews: [...],
};
```

## API

```
GET /api/me
→ Profile

GET /api/me/reviews?cursor=&limit=
→ { items: Review[], nextCursor }
```
