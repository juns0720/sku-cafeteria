package com.sungkyul.cafeteria.menu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "menu_dates",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_menu_date_slot", columnNames = {"menu_id", "served_date", "meal_slot"})
        }
)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    @Column(nullable = false)
    private LocalDate servedDate;

    @Column(name = "meal_slot", nullable = false)
    @Builder.Default
    private String mealSlot = "LUNCH";
}
