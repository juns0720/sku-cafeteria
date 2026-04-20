package com.sungkyul.cafeteria.menu.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MenuTierTest {

    @Test
    void avgNull_null() {
        assertThat(MenuTier.of(null, 30)).isNull();
    }

    @Test
    void GOLD_조건충족() {
        assertThat(MenuTier.of(4.5, 20)).isEqualTo(MenuTier.GOLD);
    }

    @Test
    void GOLD_리뷰수부족_SILVER로cascade() {
        // avg 4.5 >= 4.0, count 19 >= 10 → SILVER
        assertThat(MenuTier.of(4.5, 19)).isEqualTo(MenuTier.SILVER);
    }

    @Test
    void SILVER_조건충족() {
        assertThat(MenuTier.of(4.0, 10)).isEqualTo(MenuTier.SILVER);
    }

    @Test
    void SILVER_리뷰수부족_BRONZE로cascade() {
        // avg 4.0 >= 3.5, count 9 >= 5 → BRONZE
        assertThat(MenuTier.of(4.0, 9)).isEqualTo(MenuTier.BRONZE);
    }

    @Test
    void BRONZE_조건충족() {
        assertThat(MenuTier.of(3.5, 5)).isEqualTo(MenuTier.BRONZE);
    }

    @Test
    void BRONZE_리뷰수부족_null() {
        assertThat(MenuTier.of(3.5, 4)).isNull();
    }

    @Test
    void 평균미달_null() {
        assertThat(MenuTier.of(3.4, 100)).isNull();
    }
}
