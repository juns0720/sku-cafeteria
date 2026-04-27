이 프로젝트는 성결대학교 학식 리뷰 풀스택 웹앱이야.
백엔드: Spring Boot 3.5 / Java 17 / PostgreSQL / Flyway / Gradle
프론트: React 19 / Vite / TailwindCSS v3 / React Query v5
배포: Render(BE) / Vercel(FE)

아래 순서대로 파일을 읽고 프로젝트 현황을 파악해줘. 코드는 아직 건드리지 마.

1. docs/plans/README.md
2. docs/plans/coral-redesign/00-overview.md
3. docs/plans/coral-redesign/99-progress.md
4. docs/architecture.md  ← 패키지 구조·Auth·Security·Flyway 이력
5. docs/api.md            ← 전체 엔드포인트 시그니처

참고: v3 Coral Redesign은 FE 전용이 대부분.
BE 잔여 작업은 V3-T19(reviews.image_url DROP)와 Phase D(Cloudinary)뿐.

파악 완료 후 아래 형식으로 요약해줘:

### 완료된 BE 단위
(P1-T* ~ P2-T* 완료 항목 나열)

### 다음 BE 작업
- 단위 ID:
- 참조 Phase 파일:
- 선행 조건 (있으면):

### 주의사항
(Known Issues + V11 DROP 관련 주의사항 등)