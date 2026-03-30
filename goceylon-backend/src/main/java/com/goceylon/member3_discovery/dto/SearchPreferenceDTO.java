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
public class SearchPreferenceDTO {
    private String preferredCategories;
    private Integer maxDistanceKm;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
