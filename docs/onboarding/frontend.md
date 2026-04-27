d # Frontend Session Onboarding Checklist

프론트엔드 세션 시작 시 따르는 온보딩 체크리스트.

## 실행 순서

### Step 1. `docs/plans/README.md` 읽기

- 활성 플랜 목록 + 구조 파악

### Step 2. 활성 플랜 `00-overview.md` 읽기

- 4탭 구조·결정 사항·의존성 그래프 숙지
- 설계 드리프트 기록 숙지 (닉네임 단일화, menus 정규화)

### Step 3. 활성 플랜 `99-progress.md` 읽기

- 완료된 V3-T* 단위 확인
- 다음 작업 대상 V3-T* 단위 확인

### Step 4. 다음 단위의 Phase 파일 선택적 읽기

- V3-T1~T6 → `docs/plans/coral-redesign/01-phase-1-foundation.md`의 해당 단위 섹션
- V3-T7~T16 → `docs/plans/coral-redesign/02-phase-2-pages.md`의 해당 단위 섹션
- V3-T17~T20 → `docs/plans/coral-redesign/03-phase-3-cleanup.md`의 해당 단위 섹션
- PD-T* → `docs/plans/coral-redesign/06-phase-d-photo.md`의 해당 단위 섹션

**반드시 해당 단위 섹션만 읽는다** — 다른 Phase 파일 전체를 스캔하지 않는다.

> `docs/plans/archive/ui-ux-v1-phases/` 및 `docs/plans/archive/ui-ux-redesign-v2/`는 **구버전 아카이브** — Coral Redesign 작업 중에는 참조 금지(매핑 표 확인 시 제외).

### Step 5. 디자인 토큰 확인 (필요 시)

- `docs/DESIGN.md` — 컬러(coral/g50~g900)·타이포(Pretendard)·컴포넌트 카탈로그·절대 규칙 체크리스트
- 핸드오프 원본: `new_handoff/` (tokens.md / components.md / screens/01~09)

### Step 6. frontend/ 폴더 구조 + 최근 커밋

- `frontend/src/` 하위 확인
- `git log --oneline -5`

---

## Step 7. 요약 출력 (아래 형식)

---

## 프론트엔드 현황 요약

### 완료된 단계
(`99-progress.md`의 체크된 V3-T* 항목 나열)

### 다음 작업 — [V3-T* 이름]
- **작업 파일**: 해당 Phase md 링크
- **구현 파일**: (생성/수정할 파일 목록)
- **컴포넌트 Props** (해당되면): (시그니처)
- **React Query 키** (해당되면)
- **브라우저 검증 체크리스트** (375 / 768 / 1280):
  - [ ] (검증 항목 1)
  - [ ] (검증 항목 2)
- **선행 의존성**: (V3-T* 등)

### 현재 이슈
(`99-progress.md`의 Known Issues)

---

## 주의사항

- `docs/plans/archive/`(frontend-v1, ui-ux-v1-phases, ui-ux-redesign-v2) 전체는 **아카이브** — 매핑 확인 외에는 읽지 말 것
- 구현 완료 후 `docs/plans/coral-redesign/99-progress.md` 체크박스만 갱신
- 신규 컴포넌트는 `frontend/src/components/coral/` 하위에 둔다 (hi/는 v2, components/는 v1 — Phase v3-3에서 일괄 삭제)
- `position: fixed` UI는 `createPortal(…, document.body)` 사용
- `git commit` / `git push`는 사용자가 직접 진행 — AI는 커밋하지 않음
