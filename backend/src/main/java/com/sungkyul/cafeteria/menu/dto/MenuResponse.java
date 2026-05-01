package com.sungkyul.cafeteria.menu.dto;

import com.sungkyul.cafeteria.menu.domain.MenuTier;
import com.sungkyul.cafeteria.menu.entity.Menu;

import java.time.DayOfWeek;
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
    public static MenuResponse from(Menu m, LocalDate servedDate, LocalDate referenceDate) {
        boolean isNew = isNewForWeek(m.getFirstSeenAt(), referenceDate);
        return new MenuResponse(
                m.getId(), m.getName(), m.getCorner(),
                servedDate,
                m.getAvgOverall(), (long) m.getReviewCount(),
                MenuTier.of(m.getAvgOverall(), m.getReviewCount()),
                isNew, m.getFirstSeenAt(),
                m.getAvgTaste(), m.getAvgAmount(), m.getAvgValue(), m.getAvgOverall()
        );
    }

    public static MenuResponse from(Menu m, LocalDate servedDate) {
        return from(m, servedDate, LocalDate.now());
    }

    public static MenuResponse from(Menu m) {
        return from(m, null);
    }

    public static boolean isNewForWeek(LocalDate firstSeenAt, LocalDate referenceDate) {
        if (firstSeenAt == null) {
            return false;
        }

        LocalDate baseDate = referenceDate != null ? referenceDate : LocalDate.now();
        LocalDate weekStart = baseDate.with(DayOfWeek.MONDAY);
        LocalDate weekEnd = weekStart.plusDays(6);

        return !firstSeenAt.isBefore(weekStart) && !firstSeenAt.isAfter(weekEnd);
    }
}
