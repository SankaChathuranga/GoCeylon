package com.goceylon.member6_reviews.repository;

import com.goceylon.member6_reviews.model.ModerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 */
@Repository
public interface ModerationLogRepository extends JpaRepository<ModerationLog, Long> {
    List<ModerationLog> findByAdminIdOrderByCreatedAtDesc(Long adminId);
    List<ModerationLog> findAllByOrderByCreatedAtDesc();
}
