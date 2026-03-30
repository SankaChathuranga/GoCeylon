package com.goceylon.member3_discovery.repository;

import com.goceylon.member3_discovery.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 */
@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    List<Favorite> findByUserIdAndFavoriteType(Long userId, String favoriteType);
    boolean existsByUserIdAndActivityId(Long userId, Long activityId);
    void deleteByIdAndUserId(Long id, Long userId);
}
