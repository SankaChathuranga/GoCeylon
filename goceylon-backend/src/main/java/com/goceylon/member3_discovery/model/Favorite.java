package com.goceylon.member3_discovery.model;

import com.goceylon.member1_auth.model.User;
import com.goceylon.member2_listings.model.Activity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 * Favorite entity - stores user's saved locations and activities.
 */
@Entity
@Table(name = "favorites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @Column(name = "location_name", length = 255)
    private String locationName;

    private Double latitude;
    private Double longitude;

    @Column(name = "favorite_type", nullable = false, length = 20)
    @NotNull(message = "Favorite type is required")
    private String favoriteType; // ACTIVITY, LOCATION

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
