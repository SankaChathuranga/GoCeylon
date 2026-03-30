package com.goceylon.member4_bookings.service;

import com.goceylon.common.exception.*;
import com.goceylon.member1_auth.model.Role;
import com.goceylon.member1_auth.model.User;
import com.goceylon.member1_auth.repository.UserRepository;
import com.goceylon.member2_listings.model.Activity;
import com.goceylon.member2_listings.repository.ActivityRepository;
import com.goceylon.member4_bookings.dto.*;
import com.goceylon.member4_bookings.model.*;
import com.goceylon.member4_bookings.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 * Service layer for booking and reservation management.
 */
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ActivityRepository activityRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }

    // ==================== CREATE ====================

    @Transactional
    public BookingDTO createBooking(String touristEmail, CreateBookingRequest request) {
        User tourist = userRepository.findByEmail(touristEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + request.getActivityId()));

        // Validation: Activity must be active
        if (!activity.getIsActive()) {
            throw new BadRequestException("This activity is no longer available");
        }

        // Validation: Booking date must be in the future
        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Booking date must be in the future");
        }

        // Validation: Check max participants
        if (activity.getMaxParticipants() != null &&
            request.getNumParticipants() > activity.getMaxParticipants()) {
            throw new BadRequestException("Number of participants exceeds maximum allowed: " + activity.getMaxParticipants());
        }

        // Calculate total price
        BigDecimal totalPrice = activity.getPrice().multiply(BigDecimal.valueOf(request.getNumParticipants()));

        // Generate unique reference number
        String referenceNumber = "GC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .referenceNumber(referenceNumber)
                .tourist(tourist)
                .activity(activity)
                .bookingDate(request.getBookingDate())
                .timeSlot(request.getTimeSlot())
                .numParticipants(request.getNumParticipants())
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING)
                .notes(request.getNotes())
                .build();

        Booking saved = bookingRepository.save(booking);
        return mapToBookingDTO(saved);
    }

    // ==================== READ ====================

    public List<BookingDTO> getTouristBookings(String touristEmail) {
        User tourist = userRepository.findByEmail(touristEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByTouristIdOrderByCreatedAtDesc(tourist.getId()).stream()
                .map(this::mapToBookingDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getProviderBookings(String providerEmail) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validation: Only providers can view provider bookings
        if (provider.getRole() != Role.PROVIDER) {
            throw new BadRequestException("Only providers can view provider bookings");
        }

        return bookingRepository.findByActivityProviderIdOrderByCreatedAtDesc(provider.getId()).stream()
                .map(this::mapToBookingDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Validation: Only tourist, provider, or admin can view
        if (!booking.getTourist().getEmail().equals(userEmail) &&
            !booking.getActivity().getProvider().getEmail().equals(userEmail)) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (user.getRole() != Role.ADMIN) {
                throw new UnauthorizedException("You don't have permission to view this booking");
            }
        }

        return mapToBookingDTO(booking);
    }

    // ==================== UPDATE ====================

    @Transactional
    public BookingDTO confirmBooking(Long id, String providerEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Validation: Only the activity provider can confirm
        if (!booking.getActivity().getProvider().getEmail().equals(providerEmail)) {
            throw new UnauthorizedException("Only the activity provider can confirm this booking");
        }

        // Validation: Only pending bookings can be confirmed
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be confirmed. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking updated = bookingRepository.save(booking);
        return mapToBookingDTO(updated);
    }

    @Transactional
    public BookingDTO cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Validation: Only tourist or provider can cancel
        if (!booking.getTourist().getEmail().equals(userEmail) &&
            !booking.getActivity().getProvider().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You don't have permission to cancel this booking");
        }

        // Validation: Cannot cancel completed bookings
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return mapToBookingDTO(updated);
    }

    // ==================== DELETE ====================

    @Transactional
    public void deleteBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Validation: Only cancelled bookings can be deleted
        if (booking.getStatus() != BookingStatus.CANCELLED) {
            throw new BadRequestException("Only cancelled bookings can be deleted");
        }

        // Validation: Only tourist or admin can delete
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!booking.getTourist().getEmail().equals(userEmail) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You don't have permission to delete this booking");
        }

        bookingRepository.delete(booking);
    }

    // ==================== HELPERS ====================

    private BookingDTO mapToBookingDTO(Booking b) {
        return BookingDTO.builder()
                .id(b.getId())
                .referenceNumber(b.getReferenceNumber())
                .touristId(b.getTourist().getId())
                .touristName(b.getTourist().getFirstName() + " " + b.getTourist().getLastName())
                .activityId(b.getActivity().getId())
                .activityTitle(b.getActivity().getTitle())
                .activityLocation(b.getActivity().getLocationName())
                .bookingDate(b.getBookingDate())
                .timeSlot(b.getTimeSlot())
                .numParticipants(b.getNumParticipants())
                .totalPrice(b.getTotalPrice())
                .status(b.getStatus().name())
                .notes(b.getNotes())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
