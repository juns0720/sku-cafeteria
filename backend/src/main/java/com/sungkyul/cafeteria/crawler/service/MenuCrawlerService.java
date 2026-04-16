package com.sungkyul.cafeteria.crawler.service;

import com.sungkyul.cafeteria.crawler.dto.CrawlingResult;
import com.sungkyul.cafeteria.menu.entity.Menu;
import com.sungkyul.cafeteria.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MenuCrawlerService {

    private static final String TARGET_URL = "https://www.sungkyul.ac.kr/skukr/340/subview.do";
    private static final int TIMEOUT_MS = 10_000;

    private final MenuRepository menuRepository;

    public CrawlingResult crawlAndSave() {
        int savedCount = 0;
        int skippedCount = 0;

        try {
            Document doc = Jsoup.connect(TARGET_URL)
                    .timeout(TIMEOUT_MS)
                    .get();

            Element table = doc.selectFirst("table");
            if (table == null) {
                log.error("[Crawler] table 태그를 찾을 수 없습니다.");
                return CrawlingResult.failure("table 태그를 찾을 수 없습니다.");
            }

            // 헤더에서 날짜 파싱 (첫 번째 th = 코너명이므로 skip)
            List<LocalDate> dates = parseDates(table);
            if (dates.isEmpty()) {
                log.error("[Crawler] 날짜 헤더를 파싱할 수 없습니다.");
                return CrawlingResult.failure("날짜 헤더를 파싱할 수 없습니다.");
            }

            log.info("[Crawler] 파싱된 날짜: {}", dates);

            // tbody tr 순회
            Elements rows = table.select("tbody tr");
            for (Element row : rows) {
                Elements cells = row.select("td");
                if (cells.isEmpty()) continue;

                String corner = cells.get(0).text().trim();
                if (corner.isEmpty()) continue;

                // 나머지 td = 요일별 메뉴
                for (int i = 1; i < cells.size() && (i - 1) < dates.size(); i++) {
                    LocalDate servedDate = dates.get(i - 1);
                    Element cell = cells.get(i);

                    // br 태그 기준으로 줄 분리
                    List<String> menuNames = splitByBr(cell);

                    for (String menuName : menuNames) {
                        if (menuName.isEmpty()) continue;

                        boolean exists = menuRepository
                                .findByNameAndServedDateAndCorner(menuName, servedDate, corner)
                                .isPresent();

                        if (exists) {
                            skippedCount++;
                        } else {
                            menuRepository.save(Menu.builder()
                                    .name(menuName)
                                    .corner(corner)
                                    .servedDate(servedDate)
                                    .build());
                            savedCount++;
                        }
                    }
                }
            }

            log.info("[Crawler] 완료 — saved: {}, skipped: {}", savedCount, skippedCount);
            return CrawlingResult.success(savedCount, skippedCount);

        } catch (Exception e) {
            log.error("[Crawler] 크롤링 중 오류 발생: {}", e.getMessage(), e);
            return CrawlingResult.failure(e.getMessage());
        }
    }

    public String debugHtml() {
        try {
            Document doc = Jsoup.connect(TARGET_URL)
                    .timeout(TIMEOUT_MS)
                    .get();
            return doc.outerHtml();
        } catch (Exception e) {
            log.error("[Crawler] debugHtml 오류: {}", e.getMessage(), e);
            return "오류: " + e.getMessage();
        }
    }

    /**
     * thead의 th에서 날짜를 파싱한다. 첫 번째 th(코너명)는 skip.
     * th 텍스트 예시: "04/14(월)", "4/14", "2024-04-14" 등 다양한 형식을 처리한다.
     */
    private List<LocalDate> parseDates(Element table) {
        List<LocalDate> dates = new ArrayList<>();
        Elements headers = table.select("thead tr th");

        int year = LocalDate.now().getYear();

        for (int i = 1; i < headers.size(); i++) {
            String text = headers.get(i).text().trim();
            // 괄호 제거: "04/14(월)" → "04/14"
            text = text.replaceAll("\\(.*\\)", "").trim();

            LocalDate date = tryParseDate(text, year);
            if (date != null) {
                dates.add(date);
            } else {
                log.warn("[Crawler] 날짜 파싱 실패: '{}'", headers.get(i).text());
            }
        }
        return dates;
    }

    private LocalDate tryParseDate(String text, int year) {
        // MM/dd 또는 M/d 형식
        if (text.matches("\\d{1,2}/\\d{1,2}")) {
            try {
                String[] parts = text.split("/");
                int month = Integer.parseInt(parts[0]);
                int day = Integer.parseInt(parts[1]);
                return LocalDate.of(year, month, day);
            } catch (Exception ignored) {}
        }
        // yyyy-MM-dd 형식
        try {
            return LocalDate.parse(text, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException ignored) {}
        // yyyy.MM.dd 형식
        try {
            return LocalDate.parse(text, DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        } catch (DateTimeParseException ignored) {}
        return null;
    }

    /**
     * td 안의 텍스트를 br 태그 기준으로 분리한다.
     */
    private List<String> splitByBr(Element cell) {
        // br을 줄바꿈 문자로 치환 후 분리
        cell.select("br").before("\\n");
        String text = cell.text().replace("\\n", "\n");
        List<String> result = new ArrayList<>();
        for (String line : text.split("\n")) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()) {
                result.add(trimmed);
            }
        }
        return result;
    }
}
