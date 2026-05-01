# Frontend Design System (v3 Coral)

> 2026-04-27 전면 개편. v2(종이/잉크 톤)는 [`archive/DESIGN-v2.md`](./archive/DESIGN-v2.md), v1(Zomato 레드)은 [`archive/DESIGN-v1.md`](./archive/DESIGN-v1.md)에 보존.
> 원본 디자인 핸드오프: [`new_handoff/`](../new_handoff/) (`tokens.md` / `components.md` / `screens/0X-*.md` / `source/coral-*.jsx`).

## [1] 디자인 컨셉

**"Modern · Clean · Coral"** — 순백 베이스 + Toss 호환 그레이 스케일 + 코랄 단일 액센트. 따뜻함은 색이 아닌 둥근 모서리와 친근한 카피로 표현한다.

- 모바일 우선 (375 × 760), 데스크톱은 중앙 프레임
- 음식 이미지는 단색 그레이 박스 + SVG 아이콘 (사진 미입력 시 fallback)
- **별 색은 모두 코랄(#FF6B5C)** — 노랑 별은 v3에서 사용 금지
- **카테고리 썸네일은 모두 단색 그레이(#F2F4F6)** — 카테고리별 컬러 부활 금지 (로그인 화면 일러스트 3개만 예외)
- 강조: 헤어라인 1px (`#F2F4F6`/`#E5E8EB`), 그림자는 모바일 프레임만 사용
- 인터랙션: 200~250ms ease-out

---

## [2] 컬러 팔레트

### 액센트
| 토큰 | HEX | 용도 |
|---|---|---|
| `coral` | `#FF6B5C` | CTA, 별, 1위 뱃지, NEW 텍스트, 진행도 바, 강조 숫자 |
| `coralSoft` | `#FFEEEC` | NEW 뱃지 배경, 로그인 일러스트 박스 |

### 그레이 스케일 (Toss 호환)
| 토큰 | HEX | 용도 |
|---|---|---|
| `g50` | `#F9FAFB` | 부드러운 카드 배경, 코멘트 입력 박스 |
| `g100` | `#F2F4F6` | 음식 썸네일 배경, 비활성 칩, 진행도 바 트랙, 헤어라인 |
| `g200` | `#E5E8EB` | 카드 보더 |
| `g300` | `#D1D6DB` | 빈 별 색 |
| `g400` | `#B0B8C1` | 비활성 탭 아이콘, chev |
| `g500` | `#8B95A1` | 메타 텍스트, 음식 썸네일 아이콘 |
| `g600` | `#6B7684` | 서브 텍스트, "전체" 액션 |
| `g700` | `#4E5968` | 본문 그레이, 칩 활성 텍스트 |
| `g800` | `#333D4B` | (예비) |
| `g900` | `#191F28` | 본문 잉크, 메인 타이틀, 활성 칩 배경 |

### 로그인 화면 한정 컬러 (예외)
| 카테고리 | 배경 | 아이콘 |
|---|---|---|
| 한식 (웜 레드) | `#FFF1ED` | `#E5766C` |
| 양식 (앰버) | `#FFF5E0` | `#E29A38` |
| 일품 (그린) | `#EAF6EE` | `#5A9C6E` |

---

## [3] 타이포그래피

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />
```

```css
font-family: "Pretendard", -apple-system, BlinkMacSystemFont,
             "Apple SD Gothic Neo", system-ui, sans-serif;
```

### 사이즈/웨이트 매트릭스

| 역할 | size | weight | letter-spacing | 예시 |
|---|---|---|---|---|
| Display L | 30 | 800 | -0.9 | 로그인 메인 카피 |
| Display M | 26 | 800 | -0.7 ~ -0.8 | 닉네임 카피, 평균 점수 |
| Display S | 24 | 800 | -0.7 | 홈 "SKU 학식" 타이틀 |
| Hero | 22 | 800 | -0.5 | 핸드오프 섹션 타이틀 |
| Title L | 18 | 800 | -0.4 | "오늘의 베스트 5" |
| Title M | 17 | 800 | -0.4 | 헤더 타이틀, "오늘의 메뉴" |
| Title S | 16 | 800 | -0.3 | 메뉴명, 섹션 타이틀 |
| Body L | 15-16 | 700 | -0.3 | 메뉴명 (리스트) |
| Body | 14-15 | 600~700 | -0.2 | 일반 본문 |
| Caption | 13 | 600 | -0.2 | 메타, 서브텍스트 |
| Meta | 12 | 500~600 | 0 | 카테고리 라벨 |
| Micro | 11 | 500~700 | 0 | 뱃지, 탭 라벨 |
| Tiny | 10 | 700~800 | 0 | NEW · 1위 뱃지 |

### 자간 룰
- 800 굵기 + 16px 이상: -0.3 ~ -0.9
- 700 굵기 + 14~15px: -0.2 ~ -0.3
- 500~600 + 11~13px: 0 (또는 -0.2 강조 시)

---

## [4] 모서리 / 스페이싱 / 그림자

### Border Radius
| 토큰 | 값 | 용도 |
|---|---|---|
| `r-xs` | 3-4 | 작은 NEW 뱃지 |
| `r-sm` | 6-8 | 소형 칩 |
| `r-md` | 12 | 작은 썸네일, 입력 |
| `r-lg` | 14 | 중간 카드, 버튼 |
| `r-xl` | 16 | 카드 |
| `r-2xl` | 18 | 큰 카드 (프로필) |
| `r-3xl` | 20 | 히어로 박스 |
| `r-pill` | 999 | 칩, 라운드 뱃지 |
| `r-frame` | 32 | 모바일 프레임 외각 |

### 스페이싱
| 항목 | 값 |
|---|---|
| 화면 좌우 패딩 | 24px |
| 헤더 좌우 패딩 | 16px |
| 카드 내부 패딩 | 14-16px |
| 섹션 간격 | 18-24px |
| 리스트 row vertical padding | 13px |
| 가로 스크롤 gap | 12px |

### 그림자
```css
/* 모바일 프레임 (외각만 사용) */
box-shadow:
  0 2px 8px rgba(0,0,0,0.06),
  0 12px 40px rgba(0,0,0,0.08);
```

화면 내부 카드는 그림자 사용 금지. 헤어라인(`1px solid #F2F4F6` 또는 `#E5E8EB`)으로 분리.

---

## [5] 모바일 프레임 / 그리드

| 환경 | 너비 | 좌우 패딩 |
|---|---|---|
| 모바일 | 375 (고정) | 24px |
| 태블릿 | 768 | 24px (중앙 정렬) |
| 데스크톱 | 1280 | 중앙 1100px max + 좌우 여백 |

`Frame` = 375 × 760 + `r-frame` 32px + frame shadow. 데스크톱에선 중앙 단일 프레임.

```
모바일 메뉴 카드: 1열
태블릿: 2열
데스크톱: 3열
```

---

## [6] 컴포넌트 — 기초 (`src/components/coral/`)

`new_handoff/source/coral-system.jsx`의 명세를 그대로 옮긴다. **외부 아이콘 라이브러리(lucide, hero-icons 등) 금지** — `components.md`의 SVG path를 그대로 복사.

| 컴포넌트 | 역할 |
|---|---|
| `Frame` | 모바일 프레임 (375 × 760 + r-frame 32 + frame shadow). 웹앱 모바일은 `width:100%; height:100dvh; border-radius:0` |
| `Status` | 상단 상태 바 (32px). 시간 + 신호/배터리 |
| `Header` | 화면 헤더 (좌·중·우 슬롯, padding `6 16 12`, minHeight 48) |
| `Tab` | 하단 탭바 (64px, 4탭 균등). 활성=coral/700, 비활성=g500/500. 탭: home/week/all/me |
| `Icon` | 21종 SVG (`bowl/soup/chop/home/cal/list/user/chev/chevD/chevL/chevR/star/starO/heart/heartF/x/pencil/cam/gear/search/filter/medal/check/plus/arrow`). props: `name`/`size`/`color`/`weight` |
| `Stars` | 5개 별 (코랄). Math.round(value) 채움, 빈별 g300. props: `value`/`size` |
| `Chip` | 칩/필터 (padding `8 14`, r-pill, 13px/600). active=g900 BG / 흰색 텍스트, inactive=g100 BG / g700 텍스트 |
| `Sec` | 섹션 헤더 (title 18/800/-0.4/g900, right 13/600/g600 액션, sub 12/500/g500) |
| `Button` | primary(g900 BG/흰색) / accent(coral BG/흰색) / ghost(g50 BG/g700). size lg(16 20, 16/700, r 14) / md(12 16, 14/700, r 12) |
| `Thumb` | 음식 썸네일. 배경 g100, 아이콘 g500, weight 1.5~1.6. corner→illustration 매핑 내장. **로그인 제외 단색 그레이 절대 규칙** |

### Thumb 사이즈 매트릭스
| 사용 위치 | size | radius | icon size |
|---|---|---|---|
| 홈 베스트 카드 | 124 | 14 | 50 |
| 홈 운영중 row | 50 | 12 | 24 |
| 주간 / 전체 row | 48 | 12 | 24 |
| 상세 헤더 | 140 | 24 | 70 |
| 메뉴 칩 | 28-48 | 12-14 | 16-24 |

### corner → illustration 매핑 (D10)
```js
const ICON_BY_CORNER = {
  '한식': 'bowl', '양식': 'chop', '분식': 'soup', '일품': 'bowl', '중식': 'soup',
  KOREAN: 'bowl', WESTERN: 'chop', SNACK: 'soup', SPECIAL: 'bowl',
};
```

## [7] 컴포넌트 — 컴포지트

| 컴포넌트 | 역할 |
|---|---|
| `BestRow` | TOP 5 가로 스크롤 (124×124 카드 + 1위 뱃지 + 메뉴명 + 별점) |
| `WeekPicker` | 월~금 5분할 요일 탭 (활성 g900 BG) |
| `CategoryFilter` | 코너 필터 칩 가로 스크롤 |
| `MedalDot` | 🥇/🥈/🥉 작은 원형 스티커 (전체 메뉴 리스트) |
| `MultiStarInput` | 3축 32px 큰 별 입력 (맛/양/가성비). 선택 시 `scale(1.15)` pop |
| `MultiStarSummary` | 리뷰 카드 안 한 줄 ("맛 5 양 4 가성비 5") |
| `ProgressBar` | 다음 뱃지 진행도 (트랙 g100, fill coral, 10px height + 마커) |
| `StatsGrid` | 통계 카드 3개 grid (리뷰 / 평점 / 메달) |
| `Empty` | 빈 상태 (회전 일러스트 + 메시지 + 옵션 CTA) |
| `AxisProgress` | 메뉴 상세 3축 평균 막대 (5분할, fill coral) |

신규 컴포넌트는 모두 `frontend/src/components/coral/` 하위에 둔다. (기존 `components/hi/`는 v2, Phase v3-3에서 일괄 삭제)

---

## [8] 페이지 레이아웃 (9화면)

각 화면의 픽셀 명세는 `new_handoff/screens/0X-*.md` 1차 참조. 본 섹션은 라우트·구성 요약.

### 8.1 홈 `/` ([screens/01-home.md](../new_handoff/screens/01-home.md))
헤더 "SKU 학식" + 🏆 BEST 5 가로 스크롤 + ✨ 오늘 메뉴 (LUNCH) 코너별 리스트 + Tab(home)

### 8.2 주간 `/weekly` ([screens/02-week.md](../new_handoff/screens/02-week.md))
헤더 "주간 식단" + WeekPicker(월~금) + 선택 요일 코너 리스트 + Tab(week). 주간 화면에는 1위 뱃지 없음 (NEW만)

### 8.3 전체 `/menus` ([screens/03-all.md](../new_handoff/screens/03-all.md))
헤더 + 검색 입력 + CategoryFilter + 정렬 드롭다운 + 헤어라인 리스트(MedalDot + 메뉴명 + Stars + reviewCount) + Tab(all)

### 8.4 메뉴 상세 `/menus/:id` ([screens/04-detail.md](../new_handoff/screens/04-detail.md))
헤더(← 뒤로) + 140×140 Thumb + 메뉴명/코너 + AxisProgress 3축 + 리뷰 리스트(MultiStarSummary + 코멘트 + 사진) + ✎ 리뷰 쓰기 CTA

### 8.5 리뷰 작성 `/menus/:id/review` ([screens/05-write.md](../new_handoff/screens/05-write.md))
헤더(← 취소 / "리뷰 쓰기" / 등록) + Thumb + 메뉴명 + MultiStarInput 3행 + textarea(500자) + + 사진 첨부 (Phase D)

### 8.6 프로필 `/profile` ([screens/06-profile.md](../new_handoff/screens/06-profile.md))
avatarColor 색상원 + 닉네임 + ✎ + 다음 뱃지 진행도 + ProgressBar + StatsGrid + 내 리뷰(압축) + 로그아웃 + Tab(me)

### 8.7 로그인 `/login` ([screens/07-login.md](../new_handoff/screens/07-login.md))
**유일한 컬러 일러스트 화면**. coralSoft 배경 + 카테고리 일러스트 3개 + Google G 로고 버튼

### 8.8 닉네임 설정 (모달, [screens/08-nickname.md](../new_handoff/screens/08-nickname.md))
`createPortal(..., document.body)`. 닫기 불가. 추천 칩 5개 + 가용성 체크. 30일 쿨다운 안내

### 8.9 빈 상태 ([screens/09-empty.md](../new_handoff/screens/09-empty.md))
회전 Icon + 메시지 + 옵션 CTA. Home/Weekly/AllMenus/Profile/MenuDetail의 데이터 0건 분기에서 사용

---

## [9] 메달 / 뱃지 임계값 (도메인 — v2와 동일)

### 사용자 뱃지 (`BadgeTier.of(reviewCount)`)
| 뱃지 | 조건 |
|---|---|
| NONE | 0 |
| 🥉 BRONZE | 1~4 |
| 🥈 SILVER | 5~29 |
| 🥇 GOLD | 30+ |

### 메뉴 메달 (`MenuTier.of(avgOverall, reviewCount)`)
| 메달 | 평균 별점 | 리뷰 수 |
|---|---|---|
| 🥇 GOLD | ≥ 4.5 | ≥ 20 |
| 🥈 SILVER | ≥ 4.0 | ≥ 10 |
| 🥉 BRONZE | ≥ 3.5 | ≥ 5 |
| 없음 | 그 외 | 그 외 |

### NEW 윈도우
- `firstSeenAt + 7일` 이내면 `isNew = true`

> 임계값은 백엔드의 `BadgeTier` / `MenuTier` enum과 일치한다. 변경 시 [`docs/api.md`](./api.md), [`docs/conventions.md`](./conventions.md)도 함께 갱신.

---

## [10] 애니메이션

| 대상 | 효과 | 지속 |
|---|---|---|
| 페이지 진입 | `fadeInUp` (opacity 0→1, translateY 8px→0) | 250ms ease-out |
| 카드 tap | `scale(0.98)` | 120ms |
| 별점 선택 | `scale(1.15)` pop | 150ms |
| 모달 진입 | overlay `fadeIn` + 시트 `slideUp` | 220ms |
| Empty 일러스트 | `rotate(-6deg → 0deg)` 미세 회전 | 800ms ease-out |

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## [11] 절대 규칙 (Coral 핸드오프 검증 체크리스트)

배포 전 다음 항목을 모두 확인:

- [ ] 모든 화면이 `375 × 760` 모바일 폭에서 디자인과 동일
- [ ] 음식 썸네일이 모두 `#F2F4F6` 단색 그레이 (로그인 일러스트 3개만 예외)
- [ ] 별 색이 모두 코랄(`#FF6B5C`) — 노랑(#F4B73B) 흔적 없음
- [ ] 알림(bell) 아이콘이 어디에도 노출되지 않음
- [ ] 주간 화면에 1위 뱃지 없음 (NEW만)
- [ ] 폰트가 Pretendard로 적용 — Gaegu/Jua 흔적 없음
- [ ] 프로필 카드 배경이 `#F9FAFB` (coralSoft 부활 X)
- [ ] 외부 아이콘 라이브러리(lucide-react 등) 의존성 없음
- [ ] `components/hi/` 잔재 없음 (Phase v3-3 V3-T17 완료 후)

---

## [12] 참고 라이브러리

| 라이브러리 | 용도 |
|---|---|
| (없음) | 아이콘은 `Icon` 컴포넌트 자체 SVG 21종. 외부 라이브러리 금지 |
| `@react-oauth/google` | Google 로그인 |
| `@tanstack/react-query` | 서버 상태 (캐싱, 낙관적 업데이트) |

---

## [13] Tailwind 설정 가이드

`tailwind.config.js`에 토큰 등록:

```js
export default {
  theme: {
    extend: {
      colors: {
        coral: '#FF6B5C', coralSoft: '#FFEEEC',
        g50: '#F9FAFB', g100: '#F2F4F6', g200: '#E5E8EB', g300: '#D1D6DB',
        g400: '#B0B8C1', g500: '#8B95A1', g600: '#6B7684', g700: '#4E5968',
        g800: '#333D4B', g900: '#191F28',
      },
      boxShadow: {
        frame: '0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont',
                     'Apple SD Gothic Neo', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xs': '4px', xs: '6px', frame: '32px',
      },
    },
  },
}
```

base 폰트는 `body { font-family: theme('fontFamily.pretendard') }`로 설정.

> **v2 토큰(paper/ink/orange/yellow/green/peach 등)은 Phase v3-1까지 유지** (병행 작업 보호용). Phase v3-3 V3-T17에서 일괄 제거.
