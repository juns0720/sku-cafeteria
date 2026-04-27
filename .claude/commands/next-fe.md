$ARGUMENTS가 있으면 그것을 단위 ID로 사용하고,
없으면 docs/plans/coral-redesign/99-progress.md를 읽어서 다음 미완료 FE 단위 ID를 자동으로 찾아줘.

Phase 파일 매핑:
- V3-T1~T6   → docs/plans/coral-redesign/01-phase-1-foundation.md
- V3-T7~T16  → docs/plans/coral-redesign/02-phase-2-pages.md
- V3-T17~T20 → docs/plans/coral-redesign/03-phase-3-cleanup.md
- PD-T*      → docs/plans/coral-redesign/06-phase-d-photo.md

위에서 정한 단위 ID로 구현 시작해줘.

기준:
- 설계: 위 매핑에 따른 Phase 파일의 해당 단위 섹션
- 디자인 토큰·SVG path는 new_handoff/source/ 및 docs/DESIGN.md를 1차 기준으로

완료 후:
1. npm run build 실행 → 빌드 성공 확인
2. docs/plans/coral-redesign/99-progress.md 의 해당 체크박스만 갱신
3. 커밋 진행 — 메시지 형식: feat(V3-T{ID}): <간략한 설명>
4. 브라우저 검증 리스트 출력 (375 / 768 / 1280 뷰포트 기준, 사용자가 직접 확인)


규칙:
- 해당 단위 이외의 코드는 건드리지 말 것
- 신규 컴포넌트는 반드시 frontend/src/components/coral/ 하위에 생성
- 구현 중 설계 변경이 필요하면 먼저 제안하고 승인 후 진행