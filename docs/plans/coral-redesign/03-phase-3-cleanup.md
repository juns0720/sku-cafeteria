# Phase v3-3 — Cleanup (레거시 삭제 + V11 DROP + 배포)

> **역할**: hi/와 v1 components/ 폴더 안의 잔재를 일괄 삭제하고, V11 마이그레이션으로 image_url 컬럼을 제거한다. 마지막으로 prod 배포.
> **체크박스**: [`./99-progress.md`](./99-progress.md)

---

## 게이트

- `Grep "components/hi"` 결과 0건
- `Grep "image_url"` 결과 0건 (backend Java/SQL/FE 모두)
- `./gradlew test` 31건 통과 (V11 적용 후)
- `npm run build` 성공
- prod URL(Render + Vercel) 9화면 모두 동작
- Cloudinary(Phase D) 통합 가능 상태

---

## V3-T17 — hi/ 삭제 + Tailwind v2 토큰 제거

**작업**:
1. `frontend/src/components/hi/` 폴더 일괄 삭제 (20개 컴포넌트)
2. `frontend/tailwind.config.js`에서 v2 전용 토큰 제거:
   - 컬러: `paper`, `paperDeep`, `ink`, `inkSoft`, `mute`, `rule`, `orange`, `orangeSoft`, `yellow`, `yellowSoft`, `green`(→ `success`로 통합 권장), `greenSoft`, `peach`
   - 폰트: `font-hand`, `font-disp`
   - 그림자: `flat`, `card`, `pop`
   - 라운드: `screen` (mobile frame 라운드는 `--r-screen` CSS 변수 또는 `frame` 신설로 대체)
3. `frontend/index.html`에서 Gaegu/Jua link 제거
4. `frontend/src/index.css` 또는 글로벌 스타일에서 `--font-hand`/`--font-disp` 변수 제거

**사전 검증** (삭제 전 필수):
```bash
# v2 토큰을 사용하는 파일이 남아있는지 확인
grep -rE "(bg|text|border)-(paper|ink|orange|yellow|peach|rule|mute)" frontend/src --include="*.jsx"
# 결과 0건이어야 안전
```

**검증**: `npm run build` 성공 + 9화면 시각 확인.

---

## V3-T18 — v1 components/ 잔재 삭제

**삭제 파일**: `frontend/src/components/` 직속 (hi/ 제외):
- `BottomNav.jsx` (v1) — TabBarHi가 V3-T16에서 coral/Tab으로 대체됨
- `Header.jsx` (v1)
- `MenuCard.jsx`
- `MenuDetailModal.jsx` — V3-T12 풀스크린 라우트로 대체
- `ReviewItem.jsx`
- `StarRating.jsx` — MultiStarInput으로 대체
- `StarDisplay.jsx` — MultiStarSummary/Stars로 대체
- `WeekTab.jsx` — coral/WeekPicker로 대체

**보존 권장**:
- `Toast.jsx` — `useToast` 훅이 의존 (이동 시 `coral/Toast`로 옮기고 useToast import 갱신)
- `SkeletonCard.jsx` — 향후 로딩 상태에 재사용 가능 (또는 `coral/Skeleton`으로 이동)

**삭제 대상 페이지**:
- `frontend/src/pages/MyReviewsPage.jsx` — `/my-reviews`는 `/profile`로 리다이렉트(V3-T16에서 처리)
- `frontend/src/pages/ReviewsPage.jsx` — `/menus`는 V3-T11 AllMenusPage로 대체

**검증**: `npm run build` 성공 + `Grep "components/[A-Z]"` 결과 (hi/ 제외) 0건.

---

## V3-T19 — V11 마이그레이션 (image_url DROP)

**사전 조건**:
1. **Supabase 백업 확보** — 대시보드 > Database > Backups에서 manual backup 트리거
2. FE에서 `imageUrl` 참조 0건 확인 (`Grep "imageUrl" frontend/src`)
3. BE에서 `imageUrl` 참조 0건 확인 (`Grep "imageUrl" backend/src/main`)

**파일**: `backend/src/main/resources/db/migration/V11__drop_review_image_url.sql` (신규)

```sql
ALTER TABLE reviews DROP COLUMN IF EXISTS image_url;
```

**BE 코드 정리**:
- `Review` 엔티티에서 `imageUrl` 필드 제거
- `ReviewRequest` / `ReviewResponse` DTO에서 `imageUrl` 필드 제거 (`@Deprecated` 호환 코드 제거)
- `ReviewService.create/update`에서 `imageUrl` 입력을 `photoUrls[0]`으로 wrap하던 호환 로직 제거
- 관련 테스트 갱신

**검증**:
- 로컬 `./gradlew flywayMigrate` 성공
- `./gradlew test` 31건 모두 통과
- Render에 머지 → 자동 마이그레이션 적용 → 헬스체크 통과
- `psql` 또는 Supabase SQL editor에서 `\d reviews`로 image_url 컬럼 부재 확인

**롤백 불가** — 배포 후 백업으로만 복구 가능.

---

## V3-T20 — 배포 (Render + Vercel)

**Render**:
- 환경변수 점검 (변경 없음 — `SPRING_DATASOURCE_*`, `JWT_SECRET`, `CRON_SECRET`, `ALLOWED_ORIGINS`)
- `main` 머지 → 자동 빌드 + V11 마이그레이션 자동 적용
- 첫 요청 콜드 스타트 30~60초 확인
- `/api/v1/health` 200 OK 확인

**Vercel**:
- `main` 머지 → preview → production promote
- production 도메인 9화면 시각 확인 (375 / 768 / 1280)
- React Router fallback (`vercel.json`) 동작 확인 — `/menus/:id` 직접 접속 시 200

**ALLOWED_ORIGINS 갱신**:
- Vercel preview 도메인이 추가되었으면 Render `ALLOWED_ORIGINS`에 쉼표 구분 추가 → Render 재시작
- production 도메인이 변경되지 않았다면 갱신 불필요

**검증** (스모크):
1. 비로그인 → `/` → `/login` 리다이렉트
2. Google 로그인 → 닉네임 모달(신규 가입자) 또는 `/` 직행
3. `/` BEST 5 + 오늘 메뉴
4. `/weekly` 요일 선택 → 코너별 리스트
5. `/menus` 검색 + 필터 + 정렬
6. `/menus/:id` 상세 + 3축 평균
7. `/menus/:id/review` 등록 → 상세 평균 갱신 확인
8. `/profile` 진행도 + 통계 + 내 리뷰

---

## 완료 정의 (Definition of Done)

- [ ] `frontend/src/components/hi/` 폴더 부재
- [ ] v1 components/ 잔재 8개 파일 삭제 완료 (Toast/SkeletonCard 보존 또는 이동)
- [ ] Tailwind 설정에서 v2 전용 토큰 제거
- [ ] `index.html`에서 Gaegu/Jua 제거
- [ ] V11 SQL 작성·적용·테스트 통과
- [ ] BE/FE에서 `image_url`/`imageUrl` 참조 0건
- [ ] Render + Vercel production 배포 완료
- [ ] 스모크 시나리오 1~8 모두 통과
- [ ] `99-progress.md` 모든 v3 체크박스 완료
- [ ] 본 디렉토리(`coral-redesign/`)를 `archive/`로 이동할 준비 완료
