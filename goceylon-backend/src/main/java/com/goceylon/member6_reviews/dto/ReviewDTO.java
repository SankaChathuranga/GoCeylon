package com.goceylon.member6_reviews.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long touristId;
    private String touristName;
    private Long activityId;
    private String activityTitle;
    private Integer rating;
    private String comment;
    private Boolean isFlagged;
    private LocalDateTime createdAt;
}
