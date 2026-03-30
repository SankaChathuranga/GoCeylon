package com.goceylon.member2_listings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private Long providerId;
    private String providerName;
    private String title;
    private String description;
    private String category;
    private BigDecimal price;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer maxAttendees;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
