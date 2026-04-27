$ARGUMENTS가 있으면 그것을 단위 ID로 사용하고,
없으면 docs/plans/coral-redesign/99-progress.md를 읽어서 다음 미완료 BE 단위 ID를 자동으로 찾아줘.

Phase 파일 매핑:
- V3-T19 → docs/plans/coral-redesign/03-phase-3-cleanup.md
- PD-T*  → docs/plans/coral-redesign/06-phase-d-photo.md

위에서 정한 단위 ID로 구현 시작해줘.

기준:
- 설계: 위 매핑에 따른 Phase 파일의 해당 단위 섹션
- 도메인 규칙: docs/conventions.md
- API 시그니처: docs/api.md

완료 후:
1. ./gradlew test 실행 → 전체 통과 확인
2. docs/plans/coral-redesign/99-progress.md 의 해당 체크박스만 갱신
3. 커밋 진행 — 메시지 형식: feat(V3-T{ID}): <간략한 설명>

규칙:
- 해당 단위 이외의 코드는 건드리지 말 것
- V3-T19(image_url DROP)는 Supabase 백업 확보 여부를 먼저 확인 후 진행
- 구현 중 설계 변경이 필요하면 먼저 제안하고 승인 후 진행