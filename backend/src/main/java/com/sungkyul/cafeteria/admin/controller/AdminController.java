package com.sungkyul.cafeteria.admin.controller;

import com.sungkyul.cafeteria.crawler.dto.CrawlingResult;
import com.sungkyul.cafeteria.crawler.service.MenuCrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MenuCrawlerService menuCrawlerService;

    /** 수동 크롤링 트리거 */
    @PostMapping("/crawl")
    public ResponseEntity<Map<String, Object>> crawl() {
        CrawlingResult result = menuCrawlerService.crawlAndSave();
        return ResponseEntity.ok(Map.of(
                "message", "크롤링 완료",
                "savedCount", result.savedCount(),
                "skippedCount", result.skippedCount()
        ));
    }

    /** 파싱 디버깅용 raw HTML 반환 */
    @GetMapping("/crawl/debug")
    public ResponseEntity<String> debugHtml() {
        return ResponseEntity.ok(menuCrawlerService.debugHtml());
    }
}
