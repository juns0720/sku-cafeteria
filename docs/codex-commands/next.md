사용자가 `codex:next` 뒤에 단위 ID를 붙였으면 그 값을 사용할 것.
예: `codex:next V3-T8`

단위 ID가 없으면 docs/plans/coral-redesign/99-progress.md를 읽어서 다음 미완료 단위 ID를 자동으로 찾는다.

---

## Phase 파일 매핑

| 단위 ID 패턴 | Phase 파일 |
|---|---|
| DB-T* / FE-T* / BUG-T* / PWA-T* | docs/plans/coral-redesign/05-phase-e-performance.md |
| V3-T1 ~ T6  | docs/plans/coral-redesign/01-phase-1-foundation.md |
| V3-T7 ~ T16 | docs/plans/coral-redesign/02-phase-2-pages.md |
| V3-T17 ~ T20 | docs/plans/coral-redesign/03-phase-3-cleanup.md |
| PD-T* | docs/plans/coral-redesign/06-phase-d-photo.md |

## 레이어 판별

- **BE 단위**: DB-T*, V3-T19, PD-T1, PD-T2
- **FE 단위**: V3-T1~T18, V3-T20, PD-T3, BUG-T*, FE-T*, PWA-T*

---

위에서 정한 단위 ID로 구현을 시작한다.

## 참조 기준

- 설계: 위 매핑에 따른 Phase 파일의 해당 단위 섹션
- 도메인 규칙: docs/conventions.md
- API 시그니처: docs/api.md
- 디자인 토큰 및 SVG path (FE 단위): new_handoff/source/ 및 docs/DESIGN.md 1차 기준

## 완료 후 - BE 단위

1. `./gradlew test` 실행 및 전체 통과 확인
2. docs/plans/coral-redesign/99-progress.md 해당 체크박스만 갱신
3. 커밋 메시지 형식: `feat({단위ID}): <간략한 설명>`

## 완료 후 - FE 단위

1. `npm run build` 실행 및 빌드 성공 확인
2. docs/plans/coral-redesign/99-progress.md 해당 체크박스만 갱신
3. 커밋 메시지 형식: `feat({단위ID}): <간략한 설명>`
4. 브라우저 검증 리스트 출력 (375 / 768 / 1280 뷰포트 기준, 사용자가 직접 확인)

## 공통 규칙

- 해당 단위 이외의 코드는 건드리지 말 것
- 신규 FE 컴포넌트는 반드시 `frontend/src/components/coral/` 하위에 생성
- V3-T19(image_url DROP)는 Supabase 백업 확보 여부를 먼저 확인 후 진행
- 구현 중 설계 변경이 필요하면 먼저 제안하고 승인 후 진행
