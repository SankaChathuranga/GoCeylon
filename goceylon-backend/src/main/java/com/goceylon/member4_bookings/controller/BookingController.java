package com.goceylon.member4_bookings.controller;

import com.goceylon.common.dto.ApiResponse;
import com.goceylon.member4_bookings.dto.*;
import com.goceylon.member4_bookings.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 * REST Controller for booking and reservation management.
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ==================== CREATE ====================

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDTO>> createBooking(
            Authentication auth, @Valid @RequestBody CreateBookingRequest request) {
        BookingDTO booking = bookingService.createBooking(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", booking));
    }

    // ==================== READ ====================

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingDTO>>> getMyBookings(Authentication auth) {
        List<BookingDTO> bookings = bookingService.getTouristBookings(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDTO>> getBookingById(
            @PathVariable Long id, Authentication auth) {
        BookingDTO booking = bookingService.getBookingById(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @GetMapping("/provider")
    public ResponseEntity<ApiResponse<List<BookingDTO>>> getProviderBookings(Authentication auth) {
        List<BookingDTO> bookings = bookingService.getProviderBookings(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    // ==================== UPDATE ====================

    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<BookingDTO>> confirmBooking(
            @PathVariable Long id, Authentication auth) {
        BookingDTO booking = bookingService.confirmBooking(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDTO>> cancelBooking(
            @PathVariable Long id, Authentication auth) {
        BookingDTO booking = bookingService.cancelBooking(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", booking));
    }

    // ==================== DELETE ====================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(
            @PathVariable Long id, Authentication auth) {
        bookingService.deleteBooking(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking deleted", null));
    }
}
