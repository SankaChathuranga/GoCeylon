package com.goceylon.member3_discovery.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteDTO {
    private Long id;
    private Long activityId;
    private String activityTitle;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private String favoriteType;
    private LocalDateTime createdAt;
}
