package com.sungkyul.cafeteria.crawler.dto;

public record CrawlingResult(int savedCount, int skippedCount, String errorMessage) {

    public static CrawlingResult success(int savedCount, int skippedCount) {
        return new CrawlingResult(savedCount, skippedCount, null);
    }

    public static CrawlingResult failure(String errorMessage) {
        return new CrawlingResult(0, 0, errorMessage);
    }
}
