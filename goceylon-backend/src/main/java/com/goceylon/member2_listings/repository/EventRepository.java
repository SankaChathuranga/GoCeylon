package com.goceylon.member2_listings.repository;

import com.goceylon.member2_listings.model.Event;
import com.goceylon.member2_listings.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByIsActiveTrue();
    List<Event> findByProviderIdAndIsActiveTrue(Long providerId);
    List<Event> findByCategoryAndIsActiveTrue(Category category);
    List<Event> findByEventDateAfterAndIsActiveTrue(LocalDate date);
    List<Event> findByEventDateBetweenAndIsActiveTrue(LocalDate start, LocalDate end);
    long countByIsActiveTrue();
}
