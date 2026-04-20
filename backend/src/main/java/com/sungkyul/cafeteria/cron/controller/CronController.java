package com.sungkyul.cafeteria.cron.controller;

import com.sungkyul.cafeteria.crawler.dto.CrawlingResult;
import com.sungkyul.cafeteria.crawler.service.MenuCrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/cron")
@RequiredArgsConstructor
public class CronController {

    @Value("${cron.secret}")
    private String cronSecret;

    private final MenuCrawlerService crawlerService;

    @PostMapping("/crawl")
    public CrawlingResult crawl(
            @RequestHeader(value = "X-Cron-Secret", required = false) String secret) {
        if (secret == null || !cronSecret.equals(secret)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return crawlerService.crawlAndSave();
    }
}
