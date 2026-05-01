# Phase 1 — DB 마이그레이션 (Flyway V8~V11)

> **역할**: Phase 1 각 단위의 SQL 초안 / 백필 / 검증 쿼리. 진행 상태는 [`99-progress.md`](./99-progress.md).
> **선행**: V1~V7 적용 완료. dev/prod 모두 `ddl-auto=validate`.

---

## 공통 안전 원칙

- **확장 후 축소(expand-contract)**: 새 컬럼은 nullable 또는 DEFAULT를 가져야 한다. NOT NULL 승격은 백필 후 별도 마이그레이션에서.
- **백필은 idempotent**: `COALESCE`/`WHERE x IS NULL`로 재실행해도 안전하게.
- **prod에서 스냅샷 필수**: V11(`image_url` DROP)은 되돌릴 수 없다. Phase 5 진입 전 Supabase 백업 확보 (대시보드 > Database > Backups).

---

## P1-T1 · V8 menus 집계 캐시 + 메타 컬럼

**파일**: `backend/src/main/resources/db/migration/V8__add_menus_aggregate_and_meta.sql`

```sql
-- 1) 컬럼 추가 (모두 nullable 또는 DEFAULT)
ALTER TABLE menus ADD COLUMN first_seen_at  DATE;
ALTER TABLE menus ADD COLUMN last_seen_at   DATE;
ALTER TABLE menus ADD COLUMN avg_taste      DOUBLE PRECISION;
ALTER TABLE menus ADD COLUMN avg_amount     DOUBLE PRECISION;
ALTER TABLE menus ADD COLUMN avg_value      DOUBLE PRECISION;
ALTER TABLE menus ADD COLUMN avg_overall    DOUBLE PRECISION;
ALTER TABLE menus ADD COLUMN review_count   INT NOT NULL DEFAULT 0;

-- 2) first/last_seen_at 백필 (menu_dates에서 파생)
UPDATE menus m SET
  first_seen_at = sub.first_d,
  last_seen_at  = sub.last_d
FROM (
  SELECT menu_id, MIN(served_date) AS first_d, MAX(served_date) AS last_d
  FROM menu_dates
  GROUP BY menu_id
) sub
WHERE m.id = sub.menu_id;

-- 3) review_count + avg_* 백필 (reviews에서 파생)
UPDATE menus m SET
  avg_taste    = sub.at,
  avg_amount   = sub.aa,
  avg_value    = sub.av,
  avg_overall  = (sub.at + sub.aa + sub.av) / 3.0,
  review_count = sub.cnt
FROM (
  SELECT menu_id,
         AVG(taste_rating)::DOUBLE PRECISION  AS at,
         AVG(amount_rating)::DOUBLE PRECISION AS aa,
         AVG(value_rating)::DOUBLE PRECISION  AS av,
         COUNT(*)                              AS cnt
  FROM reviews
  GROUP BY menu_id
) sub
WHERE m.id = sub.menu_id;

-- 4) 자주 조회되는 컬럼 인덱스
CREATE INDEX IF NOT EXISTS idx_menus_avg_overall ON menus (avg_overall DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_menus_first_seen   ON menus (first_seen_at DESC NULLS LAST);
```

**검증**:

```sql
-- 백필 누락 없는지 (menu_dates 있는 메뉴는 first/last 모두 채워져야 함)
SELECT COUNT(*) FROM menus m
WHERE EXISTS (SELECT 1 FROM menu_dates d WHERE d.menu_id = m.id)
  AND (first_seen_at IS NULL OR last_seen_at IS NULL);
-- 기대: 0

-- review_count 일치
SELECT m.id, m.review_count, COALESCE(r.cnt, 0) AS actual
FROM menus m
LEFT JOIN (SELECT menu_id, COUNT(*) AS cnt FROM reviews GROUP BY menu_id) r
  ON r.menu_id = m.id
WHERE m.review_count <> COALESCE(r.cnt, 0);
-- 기대: 0행
```

**소요**: 30분 / **위험**: 낮음

---

## P1-T2 · V9 menu_dates.meal_slot

**파일**: `V9__add_menu_dates_meal_slot.sql`

```sql
-- 1) 컬럼 추가 (default LUNCH로 기존 행 자동 채움)
ALTER TABLE menu_dates
  ADD COLUMN meal_slot VARCHAR(10) NOT NULL DEFAULT 'LUNCH';

ALTER TABLE menu_dates
  ADD CONSTRAINT menu_dates_meal_slot_chk
  CHECK (meal_slot IN ('LUNCH', 'DINNER'));

-- 2) 기존 UNIQUE(menu_id, served_date) → (menu_id, served_date, meal_slot)
ALTER TABLE menu_dates DROP CONSTRAINT IF EXISTS uk_menu_dates_menu_date;
ALTER TABLE menu_dates DROP CONSTRAINT IF EXISTS menu_dates_menu_id_served_date_key;
-- (실제 제약 이름은 `\d menu_dates`로 확인 후 명시)

ALTER TABLE menu_dates
  ADD CONSTRAINT uk_menu_dates_menu_date_slot
  UNIQUE (menu_id, served_date, meal_slot);

CREATE INDEX IF NOT EXISTS idx_menu_dates_date_slot
  ON menu_dates (served_date, meal_slot);
```

**주의**: 실제 UNIQUE 제약 이름은 V2 마이그레이션 결과를 `\d menu_dates`로 확인. 잘못 명시하면 DROP 실패.

**검증**:

```sql
SELECT meal_slot, COUNT(*) FROM menu_dates GROUP BY meal_slot;
-- 기대: LUNCH만 N건

-- UNIQUE 제약 동작 확인 (롤백 트랜잭션)
BEGIN;
INSERT INTO menu_dates (menu_id, served_date, meal_slot)
SELECT menu_id, served_date, 'LUNCH' FROM menu_dates LIMIT 1;
-- 기대: ERROR: duplicate key value
ROLLBACK;
```

**소요**: 20분 / **위험**: 중간 (UNIQUE 재정의)

---

## P1-T3 · V10 reviews.photo_urls

**파일**: `V10__add_review_photo_urls_and_user_avatar_color.sql` (T3+T4를 한 마이그레이션에 묶음)

```sql
-- 1) photo_urls 추가 (기본 빈 배열, NOT NULL)
ALTER TABLE reviews
  ADD COLUMN photo_urls TEXT[] NOT NULL DEFAULT '{}';

-- 2) 길이 제한 (최대 3장)
ALTER TABLE reviews
  ADD CONSTRAINT reviews_photo_urls_max3
  CHECK (cardinality(photo_urls) <= 3);

-- 3) 기존 image_url 백필
UPDATE reviews
SET photo_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND cardinality(photo_urls) = 0;

-- 4) image_url 컬럼은 V11(Phase 5)까지 보존 — 여기서 DROP 금지!
```

**검증**:

```sql
-- 백필 완전성
SELECT COUNT(*) FROM reviews
WHERE image_url IS NOT NULL AND cardinality(photo_urls) = 0;
-- 기대: 0

-- CHECK 동작
BEGIN;
UPDATE reviews SET photo_urls = ARRAY['a','b','c','d'] WHERE id = (SELECT id FROM reviews LIMIT 1);
-- 기대: ERROR: violates check constraint
ROLLBACK;
```

**소요**: 20분 / **위험**: 낮음

---

## P1-T4 · V10 (계속) users.avatar_color

위 V10 마이그레이션 끝에 이어서:

```sql
-- 5) avatar_color
ALTER TABLE users
  ADD COLUMN avatar_color VARCHAR(7) NOT NULL DEFAULT '#EF8A3D';

ALTER TABLE users
  ADD CONSTRAINT users_avatar_color_format
  CHECK (avatar_color ~ '^#[0-9A-Fa-f]{6}$');
```

**검증**:

```sql
SELECT COUNT(*) FROM users WHERE avatar_color IS NULL;
-- 기대: 0
SELECT COUNT(*) FROM users WHERE avatar_color !~ '^#[0-9A-Fa-f]{6}$';
-- 기대: 0
```

**소요**: 10분 / **위험**: 낮음

---

## P1-T5 · V11 reviews.image_url DROP (Phase 5에서 실행)

**선결조건**:
- FE/BE 모두 `photo_urls`만 사용 (응답 DTO에서 imageUrl 필드 제거됨)
- Supabase 백업 확보 완료 (대시보드 > Database > Backups)
- 사용자 사전 승인

**파일**: `V11__drop_review_image_url.sql`

```sql
ALTER TABLE reviews DROP COLUMN image_url;
```

**검증**:
- `\d reviews`로 컬럼 부재 확인
- 백엔드 빌드 성공 (`Review` 엔티티에서 `imageUrl` 필드 삭제 후)

**소요**: 5분 / **위험**: 높음 (롤백 불가)

---

## 참고: `Menu.corner` ENUM 전환 안 함 (D4)

- 디자인 핸드오프는 `Corner` enum을 권장하지만, **DB는 VARCHAR(255) 유지**.
- 이유:
  - 크롤러가 신규 코너 문자열을 만나도 INSERT가 깨지지 않음
  - PG enum 변환은 `ALTER TYPE` + 모든 사용처 재작성 비용이 큼
- 대신 Java 레이어에서 `Corner` enum + `CornerMapper.fromString` (Phase 2 Task 2-1)로 처리.
- 매핑 실패 시 `KOREAN`으로 fallback + WARN 로그.
