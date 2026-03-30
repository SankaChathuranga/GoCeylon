package com.goceylon.member4_bookings.repository;

import com.goceylon.member4_bookings.model.Booking;
import com.goceylon.member4_bookings.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTouristIdOrderByCreatedAtDesc(Long touristId);
    List<Booking> findByActivityProviderIdOrderByCreatedAtDesc(Long providerId);
    Optional<Booking> findByReferenceNumber(String referenceNumber);
    List<Booking> findByStatus(BookingStatus status);
    long countByStatus(BookingStatus status);
    long countByActivityProviderId(Long providerId);
}
