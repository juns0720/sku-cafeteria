# 화면 ⑦ 로그인 (CoralLogin)

> 원본: `source/coral-profile-onboarding.jsx` (CoralLogin) · 라우트 `/login`

## 구조

```
CFrame
├── CStatus
├── 메인 (flex 1, padding 0 24, justify center, items flex-start, paddingTop 64)
│   ├── 메인 일러스트 박스 96×96 radius 28 bg #FFEEEC (코랄 soft)
│   │   └── bowl 아이콘 56 / #FF6B5C / w 2  ← 로그인 메인 아이콘만 코랄
│   ├── 메인 카피 (marginTop 28)
│   │   └── "내일도 가고 싶은 학식\n오늘 평가하기" (30 / 800 / -0.9 / line-height 1.3)
│   ├── 서브카피 (marginTop 12)
│   │   └── "친구들 평점으로 3초 안에 결정해요" (14 / 500 / #6B7684 / line-height 1.5)
│   └── 일러스트 row 3개 (marginTop 40, gap 14)
│       ├── 박스 1 — 52×52 radius 14, bg #FFF1ED, icon soup 26 / #E5766C / w 1.7  ← 한식 톤
│       ├── 박스 2 — 52×52 radius 14, bg #FFF5E0, icon bowl 26 / #E29A38 / w 1.7  ← 양식 톤
│       └── 박스 3 — 52×52 radius 14, bg #EAF6EE, icon chop 26 / #5A9C6E / w 1.7  ← 일품 톤
├── flex spacer
└── CTA (padding 12 24 18)
    └── Google 로그인 버튼
        ├── width 100%, padding 16 20, radius 14
        ├── bg #191F28, color #fff
        ├── fontSize 16, weight 700, -0.3
        └── 아이콘(Google G) + "Google로 계속하기"
```

## ⚠ 로그인 화면만의 컬러 예외

이 화면의 일러스트 3개는 **단색 그레이가 아니라 카테고리 톤**을 사용합니다:
- 한식: bg `#FFF1ED` / icon `#E5766C`
- 양식: bg `#FFF5E0` / icon `#E29A38`
- 일품: bg `#EAF6EE` / icon `#5A9C6E`

다른 화면(주간/전체/상세/프로필 등)에서는 절대 이 컬러를 쓰지 마세요.

## 인증

- Google OAuth (NextAuth 권장)
- 학교 도메인 이메일(`@sungkyul.ac.kr`)만 허용 — 신규 가입 시 도메인 검증
- 로그인 성공:
  - 신규 → `/onboarding` (닉네임 설정)
  - 기존 → `/`
