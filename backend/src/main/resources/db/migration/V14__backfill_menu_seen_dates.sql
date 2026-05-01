-- V14: menus.first_seen_at / last_seen_at 누락 데이터 보정
-- menu_dates 기준으로 파생해 null 값만 채운다.

UPDATE menus m
SET
    first_seen_at = COALESCE(m.first_seen_at, sub.first_d),
    last_seen_at = COALESCE(m.last_seen_at, sub.last_d)
FROM (
    SELECT
        menu_id,
        MIN(served_date) AS first_d,
        MAX(served_date) AS last_d
    FROM menu_dates
    GROUP BY menu_id
) sub
WHERE m.id = sub.menu_id
  AND (m.first_seen_at IS NULL OR m.last_seen_at IS NULL);
