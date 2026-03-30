package com.goceylon.member3_discovery.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 */
@Data
public class CreateFavoriteRequest {
    private Long activityId;
    private String locationName;
    private Double latitude;
    private Double longitude;

    @NotBlank(message = "Favorite type is required")
    @Pattern(regexp = "^(ACTIVITY|LOCATION)$", message = "Favorite type must be ACTIVITY or LOCATION")
    private String favoriteType;
}
