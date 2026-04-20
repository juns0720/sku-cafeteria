package com.sungkyul.cafeteria.menu.domain;

public enum MenuTier {
    GOLD, SILVER, BRONZE;

    public static MenuTier of(Double avgOverall, long reviewCount) {
        if (avgOverall == null) return null;
        if (avgOverall >= 4.5 && reviewCount >= 20) return GOLD;
        if (avgOverall >= 4.0 && reviewCount >= 10) return SILVER;
        if (avgOverall >= 3.5 && reviewCount >= 5)  return BRONZE;
        return null;
    }
}
