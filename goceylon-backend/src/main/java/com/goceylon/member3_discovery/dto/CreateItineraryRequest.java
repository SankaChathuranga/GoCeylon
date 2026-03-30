package com.goceylon.member3_discovery.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 */
@Data
public class CreateItineraryRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<CreateItineraryItemRequest> items;

    @Data
    public static class CreateItineraryItemRequest {
        private Long activityId;

        @NotNull(message = "Day number is required")
        @Min(value = 1, message = "Day number must be at least 1")
        private Integer dayNumber;

        @NotNull(message = "Order index is required")
        @Min(value = 0, message = "Order index must be at least 0")
        private Integer orderIndex;

        private String notes;
    }
}
