package com.goceylon.member3_discovery.model;

import com.goceylon.member2_listings.model.Activity;
import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 */
@Entity
@Table(name = "itinerary_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
