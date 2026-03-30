package com.goceylon.member2_listings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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
public class ActivityDTO {
    private Long id;
    private Long providerId;
    private String providerName;
    private String title;
    private String description;
    private String category;
    private BigDecimal price;
    private Integer durationHours;
    private Integer maxParticipants;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
