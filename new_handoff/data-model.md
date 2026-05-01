# 데이터 모델 & 비즈니스 규칙

## Prisma 스키마

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id          String   @id @default(cuid())
  email       String   @unique           // @sungkyul.ac.kr 만 허용
  nickname    String   @unique           // 2~12자
  initial     String                     // 닉네임 첫 글자 — 아바타 표시용
  joinedAt    DateTime @default(now())
  reviews     Review[]
  badges      UserBadge[]
}

model Menu {
  id          String   @id @default(cuid())
  name        String   @unique           // 메뉴명 (정규화 키)
  category    String                     // 한식/양식/일품/분식/중식/특식
  illustration String  @default("bowl")  // bowl | soup | chop
  firstSeenAt DateTime @default(now())   // ★ NEW 판정 기준
  servings    Serving[]
  reviews     Review[]
  // 집계 (캐시) — 야간 배치 또는 리뷰 작성 시 갱신
  ratingOverall Float? @default(0)
  ratingTaste   Float? @default(0)
  ratingPortion Float? @default(0)
  ratingValue   Float? @default(0)
  reviewCount   Int    @default(0)
}

model Serving {
  id          String   @id @default(cuid())
  menuId      String
  menu        Menu     @relation(fields: [menuId], references: [id])
  date        DateTime                   // 제공 일자 (date 형)
  mealType    String                     // 조식/중식/석식
  corner      String                     // 학생식당 코너 (한식 코너 등)
  source      String                     // 크롤링 소스 URL/식별자
  @@unique([menuId, date, mealType])
}

model Review {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  menuId      String
  menu        Menu     @relation(fields: [menuId], references: [id])
  servingDate DateTime
  taste       Int                        // 1~5
  portion     Int                        // 1~5
  value       Int                        // 1~5
  comment     String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  @@unique([userId, menuId, servingDate])
}

model UserBadge {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  badgeKey    String                     // 'novice' | 'expert' | 'master' ...
  awardedAt   DateTime @default(now())
  @@unique([userId, badgeKey])
}
```

## 파생 필드 / 집계

| 필드 | 계산식 |
|---|---|
| `Menu.ratingOverall` | `(Σ taste + Σ portion + Σ value) / (3 * count)` |
| `Menu.ratingTaste/Portion/Value` | 각 축 평균 |
| `Menu.reviewCount` | 해당 메뉴의 리뷰 row 수 |

리뷰 작성/수정/삭제 시 트랜잭션 안에서 `Menu` 집계도 함께 업데이트.

## NEW 판정 (주간 식단)

```
Menu.isNew = (Menu.firstSeenAt 이 이번 주 월요일 00:00 이후)
```

매주 월요일 크롤러가 메뉴를 적재할 때:
1. 이름이 정확히 일치하는 기존 Menu 조회
2. 있으면 → Serving만 추가 (Menu 그대로)
3. 없으면 → **새 Menu 생성** (`firstSeenAt = now()`) → Serving 추가

UI에서 `Menu.firstSeenAt >= 이번 주 월요일`이면 NEW 뱃지를 띄움.

## BEST 판정 (전체 메뉴)

```
top: Menu.reviewCount >= 10 AND Menu.ratingOverall >= 4.5
```

- 홈의 "오늘의 베스트 5" — 오늘 운영 중인 메뉴 중 `reviewCount >= 5` 조건 통과 메뉴를 별점순 5개 (없으면 빈 상태)
- 전체 화면의 "BEST" 뱃지 — 위 top 조건

## 뱃지 (Profile 진행도)

| key | 이름 | 조건 |
|---|---|---|
| `novice` | 새내기 | 첫 리뷰 |
| `expert` | 미식가 | 누적 리뷰 10개 |
| `master` | 대가 | 누적 리뷰 30개 |
| `legend` | 전설 | 누적 리뷰 100개 |
| `early` | 얼리버드 | NEW 메뉴 첫 리뷰어 |

## API 라우트 (Next.js Route Handlers 기준)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/today` | 오늘 운영 메뉴 + 베스트 5 |
| GET | `/api/week?start=YYYY-MM-DD` | 해당 주차 식단 |
| GET | `/api/menus?category=&sort=&q=` | 전체 메뉴 (필터/정렬/검색) |
| GET | `/api/menu/[id]` | 메뉴 상세 + 리뷰 페이지 1 |
| GET | `/api/menu/[id]/reviews?cursor=` | 리뷰 페이징 |
| POST | `/api/review` | 리뷰 작성 |
| PATCH | `/api/review/[id]` | 리뷰 수정 (작성자만) |
| DELETE | `/api/review/[id]` | 리뷰 삭제 (작성자만) |
| GET | `/api/me` | 내 프로필 + 통계 |
| GET | `/api/me/reviews?cursor=` | 내 리뷰 |
| GET | `/api/nickname/check?value=` | 닉네임 중복/유효성 |
| POST | `/api/onboarding/nickname` | 닉네임 확정 |

## 인증

- NextAuth + Google Provider
- `signIn` 콜백에서 `email.endsWith('@sungkyul.ac.kr')` 검증, 통과 못하면 거절
- 신규 가입(=`User` 신규 생성) 후 nickname이 비어있으면 `/onboarding` 으로 강제 이동

## 크롤러

- 매주 월요일 새벽 (cron) — 학교 홈페이지 학식 페이지 크롤
- 파싱: 코너별 / 요일별 메뉴
- 적재: `Menu` upsert (이름 기준) + `Serving` insert
- 실패 시 Slack/이메일 알림

## 인덱스

```sql
@@index([category])          -- Menu
@@index([servingDate])       -- Serving
@@index([menuId, createdAt]) -- Review
@@index([userId, createdAt]) -- Review
```

## 마이그레이션 노트

기존 코드베이스에 이미 일부 모델이 있다면:
1. 위 스키마와 diff 후 점진적 마이그레이션
2. `firstSeenAt` 필드를 추가하면서 기존 Menu들은 1990-01-01 같은 과거 날짜로 백필 (= NEW 아님)
3. 집계 필드(`ratingOverall` 등)는 reviews 테이블 기반으로 일괄 재계산하는 SQL을 한 번 돌려놓고 시작
