package com.goceylon.member6_reviews.dto;

import lombok.*;

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
public class AnalyticsDTO {
    private long totalUsers;
    private long totalTourists;
    private long totalProviders;
    private long totalActivities;
    private long totalEvents;
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long totalReviews;
    private long flaggedReviews;
    private double averageRating;
}
