# 공용 컴포넌트

> 모든 화면이 이 공용 컴포넌트를 재사용합니다. 원본은 `source/coral-system.jsx`. 명세를 그대로 옮기세요.

## CIcon — 아이콘

`<CIcon k="bowl" size={22} c="#191F28" w={1.7} />`

| props | 기본값 | 설명 |
|---|---|---|
| `k` | — | 아이콘 키 (아래 표) |
| `size` | 22 | width/height (px) |
| `c` | `#191F28` | stroke / fill 색 |
| `w` | 1.7 | stroke-width |

### 아이콘 SVG 정의

모든 아이콘은 `viewBox="0 0 24 24"` (chev 계열만 14×14 / 10×10).
`stroke-linecap="round"`, `stroke-linejoin="round"` 기본 적용.

| key | path / 설명 |
|---|---|
| `bowl` | `M4 11h16` + `M5 11c0 5 3 8 7 8s7-3 7-8` (그릇) |
| `soup` | `M4 11h16l-2 8H6z` + 김 3가닥 (`M9 5c0 2 1 2 1 4` 외 2개) |
| `chop` | `M5 19l9-9 M8 19l9-9 M5 5l3 3 M16 5l3 3` (젓가락) |
| `home` | `M3 11l9-8 9 8v9H3z` + `M10 20v-6h4v6` |
| `cal` | `<rect x=3 y=5 w=18 h=16 rx=2/>` + `M3 10h18 M8 3v4 M16 3v4` |
| `list` | `M4 7h16 M4 12h16 M4 17h10` |
| `user` | `<circle cx=12 cy=8 r=4/>` + `M4 21c1-5 5-7 8-7s7 2 8 7` |
| `chev` | viewBox 14×14, `M5 3l4 4-4 4` |
| `chevD` | viewBox 10×10, `M2 4l3 3 3-3` |
| `chevL` | viewBox 14×14, `M9 3L5 7l4 4` |
| `chevR` | viewBox 14×14, `M5 3l4 4-4 4` |
| `star` | `M12 3l2.5 6 6.5.5-5 4.5L17.5 21 12 17.5 6.5 21 8 14 3 9.5l6.5-.5z` (fill 채워짐) |
| `starO` | star와 동일 path, fill="none" |
| `bell` | `M6 16V11a6 6 0 0 1 12 0v5l1 2H5z` + `M10 20a2 2 0 0 0 4 0` |
| `heart` / `heartF` | `M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z` |
| `x` | `M5 5l14 14 M19 5L5 19` |
| `pencil` | `M14 4l4 4-10 10H4v-4z` |
| `cam` | rect + circle r=4 + lens hood `M8 6l2-2h4l2 2` |
| `gear` | circle r=3 + 8개 짧은 dash |
| `search` | circle r=6 + `M14.5 14.5L19 19` |
| `filter` | `M3 5h18l-7 8v6l-4 2v-8z` (깔때기) |
| `medal` | circle r=6 + `M8 3l4 7 4-7` (리본) |
| `check` | `M4 12l5 5L20 6` |
| `plus` | `M12 5v14 M5 12h14` |
| `arrow` | `M5 12h14 M13 6l6 6-6 6` |

> **외부 아이콘 라이브러리(lucide, hero-icons 등)로 갈아끼우면 모양이 미묘하게 달라집니다.** 위 path를 그대로 SVG로 복제하세요.

## CFrame — 모바일 프레임

```tsx
<div style={{
  width: 375, height: 760,
  background: '#fff', color: '#191F28',
  borderRadius: 32, overflow: 'hidden',
  fontFamily: 'Pretendard, ...',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08)',
  display: 'flex', flexDirection: 'column',
}}>{children}</div>
```

웹앱 빌드 시에는 모바일 폭에서 `width: 100%; height: 100dvh; border-radius: 0`로 다운그레이드.

## CStatus — 상태 바 (32px)

```
height 32, padding 0 22px
좌: "11:47" (fontSize 14, weight 600)
우: 신호 막대(svg) + 배터리(svg)
```

웹앱에서는 실제 시간 표시. 모바일 브라우저 status bar가 있으면 숨겨도 됨.

## CTab — 하단 탭바 (64px)

```
height 64, padding 8 0
border-top: 1px solid #F2F4F6
4탭 균등 분할
```

| key | label | icon |
|---|---|---|
| `home` | 홈 | home |
| `week` | 주간 | cal |
| `all` | 전체 | list |
| `me` | 프로필 | user |

활성 탭: `c=accent (#FF6B5C)`, `w=2`, label `weight 700 color accent`
비활성: `c=#B0B8C1`, `w=1.6`, label `weight 500 color #8B95A1`

## CStars — 별 5개

```tsx
<CStars value={4.5} size={13} c="#FF6B5C" />
```

`Math.round(value)` 만큼 채운 star, 나머지 starO. 빈 별은 `#D1D6DB`.

## CHeader — 화면 헤더

```
padding 6 16 12
display: flex; align-items: center; gap: 8
minHeight: 48
```

좌측: 백버튼(36×36 라운드, chevL 20px) 또는 X(20px)
중앙: 타이틀 (17px / 700 / -0.4)
우측: 액션 (예: "저장" 13px / 600 / `#6B7684`)

## CChip — 칩 / 필터

```
padding: 8 14
border-radius: 999
fontSize: 13, weight: 600
active: bg #191F28 / color #fff
inactive: bg #F2F4F6 / color #4E5968
```

## CSec — 섹션 헤더

```
padding: 0 24 12
title: 18 / 800 / -0.4 / #191F28
right: 13 / 600 / #6B7684 (예: "전체")
sub (optional): 12 / 500 / #8B95A1, marginTop 2
```

## CButton — 메인 CTA

| variant | 배경 | 색 |
|---|---|---|
| primary | `#191F28` | `#fff` |
| accent | `#FF6B5C` | `#fff` |
| ghost | `#F9FAFB` | `#4E5968` |

```
size lg: padding 16 20, fontSize 16, weight 700, radius 14
size md: padding 12 16, fontSize 14, weight 700, radius 12
```

## CThumb — 음식 썸네일 ⭐ 절대 규칙

```
background: #F2F4F6
icon color: #8B95A1
icon weight: 1.5 ~ 1.6
border-radius: size에 따라 12 / 14 / 24
```

**카테고리(한식/양식/일품/분식/중식)에 상관없이 모두 동일.** 옛 디자인의 `#FFF1ED` 같은 카테고리 컬러는 부활시키지 마세요. (예외: 로그인 화면 일러스트 3개 — `tokens.md` 참고)

| 사용 위치 | size | radius | icon size |
|---|---|---|---|
| 홈 베스트 카드 | 124 | 14 | 50 |
| 홈 운영중 row | 50 | 12 | 24 |
| 주간 / 전체 row | 48 | 12 | 24 |
| 상세 헤더 | 140 | 24 | 70 |
| 메뉴 칩 | 28-48 | 12-14 | 16-24 |
