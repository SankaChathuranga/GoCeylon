package com.goceylon.member4_bookings.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 */
@Data
public class CreateBookingRequest {

    @NotNull(message = "Activity ID is required")
    private Long activityId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    private String timeSlot;

    @NotNull(message = "Number of participants is required")
    @Min(value = 1, message = "At least 1 participant is required")
    @Max(value = 100, message = "Maximum 100 participants allowed")
    private Integer numParticipants;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
