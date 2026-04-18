ALTER TABLE users
    DROP CONSTRAINT uk_users_custom_nickname,
    DROP COLUMN custom_nickname,
    ADD COLUMN is_nickname_set BOOLEAN NOT NULL DEFAULT false;
