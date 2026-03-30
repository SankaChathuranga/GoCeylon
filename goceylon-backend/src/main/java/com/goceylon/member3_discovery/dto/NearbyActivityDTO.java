package com.goceylon.member3_discovery.dto;

import lombok.*;
import java.math.BigDecimal;

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
public class NearbyActivityDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private BigDecimal price;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private String imageUrl;
    private String providerName;
    private Double distance; // in km
}
