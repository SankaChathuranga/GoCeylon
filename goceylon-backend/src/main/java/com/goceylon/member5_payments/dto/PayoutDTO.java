package com.goceylon.member5_payments.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutDTO {
    private Long id;
    private Long providerId;
    private String providerName;
    private BigDecimal amount;
    private String status;
    private LocalDateTime payoutDate;
    private LocalDateTime createdAt;
}
