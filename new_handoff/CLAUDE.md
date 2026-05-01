# Coral UI 전환 작업 지시 (Claude Code 용)

이 프로젝트의 기존 UI를 새 디자인 시스템(Coral Final)으로 **한 요소도 빠뜨리지 않고** 교체하라.

## 작업 흐름

1. `handoff/README.md` 정독 — 디자인 철학 및 절대 규칙 숙지
2. `handoff/tokens.md` → CSS 변수 또는 Tailwind config로 이식
3. `handoff/components.md` → `src/components/system/` 에 공용 컴포넌트 9종 구현
   - `CFrame, CStatus, CTab, CIcon, CStars, CHeader, CChip, CSec, CButton, CThumb`
   - **아이콘은 components.md의 SVG path 그대로** 복제 — lucide/hero-icons 금지
4. 화면별 마이그레이션 — `handoff/screens/01-home.md` 부터 09까지 순서대로
   - 각 .md의 픽셀 명세를 그대로 따른다 (어림짐작 금지)
   - 데이터는 우선 mock으로, 다음 단계에 API 연결
5. `handoff/data-model.md` 의 Prisma 스키마 + API 라우트 구현
6. mock → 실제 API 연결, NextAuth(Google) 도입, 도메인 화이트리스트
7. 크롤러는 별도 워크스페이스(`/jobs/weekly-crawl.ts`) — 매주 월요일 cron

## 기술 스택 권장

- Next.js 14+ (App Router) / React 18 / TypeScript
- Prisma + PostgreSQL
- NextAuth (Google)
- Tailwind CSS (또는 CSS Modules + 토큰 변수)
- Pretendard (CDN)

## 검증 체크리스트 (작업 완료 시)

- [ ] 모든 화면이 `375 × 760` 모바일 폭에서 디자인과 동일한가
- [ ] 음식 썸네일이 모두 `#F2F4F6` 단색 그레이인가 (로그인 제외)
- [ ] 별 색이 모두 코랄(`#FF6B5C`)인가 (노랑 X)
- [ ] 알림(bell) 아이콘이 어디에도 없는가
- [ ] 주간 화면에 1위 뱃지가 없는가 (NEW만)
- [ ] 폰트가 Pretendard로 적용되었는가
- [ ] 손글씨 폰트(Gaegu) 흔적이 남아있지 않은가
- [ ] 프로필 카드 배경이 `#F9FAFB` 인가 (코랄 soft 부활 X)

## 참고 자료

- `source/preview.html` — 모든 화면을 한 페이지에 배치한 원본 프리뷰 (브라우저로 열어서 시각 확인)
- `source/*.jsx` — 원본 React 코드 (스타일 픽셀 값을 직접 참조 가능)
