package com.goceylon.member6_reviews.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 */
@Data
public class ModerationRequest {

    @NotBlank(message = "Action type is required")
    private String actionType; // REVIEW_REMOVED, USER_BANNED, LISTING_REMOVED, CONTENT_FLAGGED

    @NotBlank(message = "Target type is required")
    private String targetType; // REVIEW, USER, ACTIVITY, EVENT

    @NotNull(message = "Target ID is required")
    private Long targetId;

    private String reason;
}
