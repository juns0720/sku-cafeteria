package com.sungkyul.cafeteria.crawler.scheduler;

import com.sungkyul.cafeteria.crawler.dto.CrawlingResult;
import com.sungkyul.cafeteria.crawler.service.MenuCrawlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CrawlerScheduler {

    private final MenuCrawlerService menuCrawlerService;

    /** 매주 월요일 오전 8시 자동 실행 */
    @Scheduled(cron = "0 0 8 * * MON")
    public void run() {
        log.info("[Scheduler] 학식 크롤링 시작");
        CrawlingResult result = menuCrawlerService.crawlAndSave();
        if (result.errorMessage() != null) {
            log.error("[Scheduler] 크롤링 실패: {}", result.errorMessage());
        } else {
            log.info("[Scheduler] 크롤링 완료 — saved: {}, skipped: {}",
                    result.savedCount(), result.skippedCount());
        }
    }
}
