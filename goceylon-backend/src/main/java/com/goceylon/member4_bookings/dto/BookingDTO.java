package com.goceylon.member4_bookings.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private String referenceNumber;
    private Long touristId;
    private String touristName;
    private Long activityId;
    private String activityTitle;
    private String activityLocation;
    private LocalDate bookingDate;
    private String timeSlot;
    private Integer numParticipants;
    private BigDecimal totalPrice;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
}
