package com.goceylon.member4_bookings.model;

import com.goceylon.member1_auth.model.User;
import com.goceylon.member2_listings.model.Activity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 * Booking entity - represents a reservation made by a tourist.
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_number", unique = true, nullable = false, length = 20)
    private String referenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tourist_id", nullable = false)
    private User tourist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "booking_date", nullable = false)
    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @Column(name = "time_slot", length = 50)
    private String timeSlot;

    @Column(name = "num_participants", nullable = false)
    @NotNull(message = "Number of participants is required")
    @Min(value = 1, message = "At least 1 participant is required")
    @Max(value = 100, message = "Maximum 100 participants allowed")
    private Integer numParticipants;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
