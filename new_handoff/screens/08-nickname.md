# 화면 ⑧ 닉네임 설정 (CoralNickname)

> 원본: `source/coral-profile-onboarding.jsx` (CoralNickname) · 라우트 `/onboarding`

## 구조

```
CFrame
├── CStatus
├── CHeader (좌: chevL / 가운데: 빈 / 우: "1/1" 13/600/#6B7684)
├── 메인 (padding 0 24, flex 1)
│   ├── 메인 카피 (marginTop 6)
│   │   └── "리뷰에 쓸\n[닉네임]을 정해주세요" (26 / 800 / -0.7 / lh 1.3)
│   │       └── "닉네임" 부분은 #FF6B5C
│   ├── 입력 박스 (marginTop 28, padding 16 14, bg #F9FAFB, radius 14, border 2px #FF6B5C)
│   │   ├── 닉네임 row (display flex, items center)
│   │   │   ├── 입력값 — 18 / 700 / -0.3 / #191F28 ("밥상탐험가")
│   │   │   ├── 코랄 캐럿 line — width 2, height 22, bg #FF6B5C, marginLeft 3
│   │   │   └── 우측: "사용 가능" — 12 / 700 / #22A06B
│   │   └── 카운터 (marginTop 8, textAlign right)
│   │       └── "5 / 12" — 11 / #8B95A1
│   ├── 가이드라인 (marginTop 14)
│   │   └── 항목 3개 — "한글/영문/숫자" "공백 X" "특수문자 X"
│   │       └── 각 항목: check 12 (#22A06B) + 텍스트 12/500/#6B7684
│   ├── 추천 닉네임 (marginTop 24)
│   │   ├── 라벨 — "추천 닉네임" (12 / 700 / #6B7684 marginBottom 8)
│   │   └── 칩 가로 wrap (gap 6)
│   │       └── 5개 — "냠냠이 / 점심탐정 / 학식러버 / 오늘은한식 / 돈까스킬러"
│   │       └── 각 칩 padding 8 14, bg #F9FAFB, radius 999, fontSize 13, weight 600, color #4E5968
└── CTA (padding 12 24 18)
    └── CButton primary size=lg width=100% — "다음"
```

## 밸리데이션

- 길이: 2~12자
- 허용: 한글, 영문, 숫자
- 금지: 공백, 특수문자, 욕설, 운영자 사칭("관리자", "admin" 등)
- 중복 검사 — 1초 디바운스로 `/api/nickname/check?value=...` 호출

## API

```
POST /api/onboarding/nickname
body: { nickname: string }
→ { ok: true } | { ok: false, reason: 'taken' | 'invalid' | 'banned' }
```
