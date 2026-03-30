package com.goceylon.member5_payments.repository;

import com.goceylon.member5_payments.model.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 */
@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long> {
    List<Payout> findByProviderIdOrderByCreatedAtDesc(Long providerId);
    List<Payout> findByStatus(String status);
}
