package com.goceylon.member3_discovery.dto;

import lombok.*;

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
public class ItineraryItemDTO {
    private Long id;
    private Long activityId;
    private String activityTitle;
    private Integer dayNumber;
    private Integer orderIndex;
    private String notes;
}
