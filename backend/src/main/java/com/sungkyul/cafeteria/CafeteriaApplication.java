package com.sungkyul.cafeteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CafeteriaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CafeteriaApplication.class, args);
    }
}