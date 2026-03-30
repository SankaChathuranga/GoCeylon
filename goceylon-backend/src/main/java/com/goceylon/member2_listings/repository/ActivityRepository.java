package com.goceylon.member2_listings.repository;

import com.goceylon.member2_listings.model.Activity;
import com.goceylon.member2_listings.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByIsActiveTrue();
    List<Activity> findByProviderIdAndIsActiveTrue(Long providerId);
    List<Activity> findByCategoryAndIsActiveTrue(Category category);

    @Query("SELECT a FROM Activity a WHERE a.isActive = true AND " +
           "a.latitude BETWEEN :minLat AND :maxLat AND " +
           "a.longitude BETWEEN :minLng AND :maxLng")
    List<Activity> findNearbyActivities(
            @Param("minLat") double minLat, @Param("maxLat") double maxLat,
            @Param("minLng") double minLng, @Param("maxLng") double maxLng);

    long countByIsActiveTrue();
}
