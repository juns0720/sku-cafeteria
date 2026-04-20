package com.sungkyul.cafeteria.menu.dto;

import com.sungkyul.cafeteria.menu.domain.MenuTier;
import com.sungkyul.cafeteria.menu.entity.Menu;

import java.time.LocalDate;

public record MenuResponse(
        Long id,
        String name,
        String corner,
        LocalDate servedDate,
        Double averageRating,   // = avgOverall, 기존 호환
        Long reviewCount,       // 기존 호환

        // 신규
        MenuTier tier,
        Boolean isNew,
        LocalDate firstSeenAt,
        Double avgTaste,
        Double avgAmount,
        Double avgValue,
        Double avgOverall
) {
    public static MenuResponse from(Menu m, LocalDate servedDate) {
        boolean isNew = m.getFirstSeenAt() != null
                && !m.getFirstSeenAt().isBefore(LocalDate.now().minusDays(7));
        return new MenuResponse(
                m.getId(), m.getName(), m.getCorner(),
                servedDate,
                m.getAvgOverall(), (long) m.getReviewCount(),
                MenuTier.of(m.getAvgOverall(), m.getReviewCount()),
                isNew, m.getFirstSeenAt(),
                m.getAvgTaste(), m.getAvgAmount(), m.getAvgValue(), m.getAvgOverall()
        );
    }
}
