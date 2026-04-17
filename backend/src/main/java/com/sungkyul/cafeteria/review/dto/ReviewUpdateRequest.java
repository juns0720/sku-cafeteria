package com.sungkyul.cafeteria.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record ReviewUpdateRequest(
        @Min(1) @Max(5) int rating,
        @Size(max = 500) String comment
) {}
