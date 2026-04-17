package com.sungkyul.cafeteria.menu.service;

import com.sungkyul.cafeteria.menu.dto.MenuResponse;
import com.sungkyul.cafeteria.menu.dto.TodayMenuResponse;
import com.sungkyul.cafeteria.menu.entity.Menu;
import com.sungkyul.cafeteria.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public TodayMenuResponse getTodayMenus() {
        LocalDate today = LocalDate.now();
        List<Menu> menus = menuRepository.findByServedDate(today);

        List<MenuResponse> responses = menus.stream()
                .map(menu -> new MenuResponse(
                        menu.getId(),
                        menu.getName(),
                        menu.getCorner(),
                        menu.getServedDate(),
                        menuRepository.findAverageRatingByMenuId(menu.getId()),
                        menuRepository.countReviewsByMenuId(menu.getId())
                ))
                .toList();

        return new TodayMenuResponse(today, responses);
    }
}
