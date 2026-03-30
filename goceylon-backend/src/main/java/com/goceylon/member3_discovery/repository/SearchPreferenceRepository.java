package com.goceylon.member3_discovery.repository;

import com.goceylon.member3_discovery.model.SearchPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 */
@Repository
public interface SearchPreferenceRepository extends JpaRepository<SearchPreference, Long> {
    Optional<SearchPreference> findByUserId(Long userId);
}
