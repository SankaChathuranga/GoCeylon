package com.goceylon.member6_reviews.repository;

import com.goceylon.member6_reviews.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByActivityIdOrderByCreatedAtDesc(Long activityId);
    List<Review> findByTouristId(Long touristId);
    List<Review> findByIsFlaggedTrue();
    boolean existsByTouristIdAndActivityId(Long touristId, Long activityId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.activity.id = :activityId")
    Double getAverageRatingByActivityId(Long activityId);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double getOverallAverageRating();

    long countByIsFlaggedTrue();
}
