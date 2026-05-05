-- PostgreSQL does not automatically create indexes for foreign keys.
-- Used by findByMenuId, aggregateByMenuId, and countGroupByUserIdIn.
CREATE INDEX IF NOT EXISTS idx_reviews_menu_id
    ON reviews (menu_id);
