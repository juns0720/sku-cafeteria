# SKU 학식 — UI 마이그레이션 가이드 (Coral Final)

> 이 문서는 **현재 작동 중인 코드베이스의 UI를 새 디자인(Coral Final)으로 한 요소도 빠짐없이 교체**하기 위한 단일 진입점입니다. Claude Code에게 이 README를 먼저 보여주고, 필요할 때 `tokens.md / screens/*.md / components.md / data-model.md` 를 참조시키세요.

## 디자인 철학

- **흰 배경 + 코랄 액센트(`#FF6B5C`) 단 1개**
- 카드 박스·테두리·그림자 최소화 (구분선은 `1px solid #F2F4F6`만)
- **Pretendard**, 자간 -0.3 ~ -0.7
- 음식 썸네일은 모두 **단색 그레이(`#F2F4F6` 배경 + `#8B95A1` 라인 아이콘)** — 알록달록한 카테고리 컬러 절대 사용 X
- **예외**: 로그인 화면의 일러스트 3개만 카테고리 톤(웜 레드/앰버/그린) 허용
- 별점 색은 노랑이 아니라 **코랄(`#FF6B5C`)**

## 모바일 뷰포트

모든 디자인은 **375 × 760 (iPhone 15 기준)** 컨테이너 기준이며, 웹앱이므로 `min-width: 0` ~ `max-width: 480px` 에서 동일하게 보이게 반응형 처리합니다. PC 뷰포트에서는 좌우 흰 레터박스 + 가운데 모바일 폭 정렬을 권장합니다.

## 폴더 구조 권장 (예: Next.js App Router)

```
src/
├── app/
│   ├── (main)/page.tsx          # 홈 (CoralHome)
│   ├── (main)/week/page.tsx     # 주간 (CoralWeek)
│   ├── (main)/all/page.tsx      # 전체 (CoralAll)
│   ├── menu/[id]/page.tsx       # 상세 (CoralDetail)
│   ├── menu/[id]/write/page.tsx # 리뷰 작성 (CoralWrite)
│   ├── me/page.tsx              # 프로필 (CoralProfile)
│   ├── login/page.tsx           # 로그인 (CoralLogin)
│   └── onboarding/page.tsx      # 닉네임 (CoralNickname)
├── components/
│   ├── system/                  # CFrame, CStatus, CTab, CIcon, CStars, CChip, CButton, CThumb, CHeader, CSec
│   ├── home/
│   ├── week/
│   ├── ...
└── styles/
    └── tokens.css               # 모든 디자인 토큰
```

## 작업 순서

1. **`tokens.md`** 토큰을 CSS 변수 또는 Tailwind config 로 옮긴다
2. **`components.md`** 공용 컴포넌트(`CFrame` ~ `CButton`)를 먼저 React 컴포넌트로 만든다 — 모든 화면이 이걸 재사용
3. **`screens/01-home.md` ~ `screens/09-empty.md`** 순으로 화면을 하나씩 옮긴다 — 픽셀 단위 명세대로 그대로 옮길 것
4. **`data-model.md`** 의 Prisma 스키마와 API 라우트 명세에 맞춰 백엔드 연결
5. 화면별 데이터 바인딩 (`mock` → 실제 API)

## 절대 지킬 것

- ✅ **모든 픽셀 값**(padding, gap, borderRadius, fontSize)을 `screens/*.md` 명세 그대로 — 어림짐작 금지
- ✅ 음식 썸네일 색은 `bg: #F2F4F6 / icon: #8B95A1 / weight: 1.5~1.6` 외에 다른 조합 사용 금지 (로그인 제외)
- ✅ 별 색은 항상 코랄 (`#FF6B5C`) — 노랑 사용 금지
- ✅ 아이콘은 `components.md`의 SVG path 그대로 — 임의로 lucide-react 같은 외부 아이콘 라이브러리로 갈아끼우면 같은 모양이 안 나옴
- ✅ 폰트는 반드시 Pretendard (CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css`)

## 절대 하지 말 것

- ❌ 알림 아이콘(bell) 추가 금지 — 웹앱이라 알림 없음
- ❌ 카테고리별 컬러 썸네일 (예전 `#FFF1ED` 등) 부활 금지
- ❌ 손글씨/연필톤(Gaegu, 점선 테두리, 오프셋 그림자) 부활 금지
- ❌ 그라디언트 배경 / 이모지 아이콘(💸 🤩 등) 사용 금지
- ❌ 주간 식단의 1위 뱃지 사용 금지 — 주간에는 NEW만 표시

## 참조 파일

- `tokens.md` — 컬러·타이포·radius·spacing·shadow
- `components.md` — 공용 컴포넌트 SVG 정의 + props
- `screens/01-home.md` ~ `09-empty.md` — 화면별 픽셀 단위 명세
- `data-model.md` — Prisma 스키마 + API + 비즈니스 규칙
- `source/*.jsx` — 원본 React 코드 (참고용 — Claude Code가 직접 읽을 수 있음)
- `source/preview.html` — 모든 화면이 캔버스로 배치된 원본 프리뷰
