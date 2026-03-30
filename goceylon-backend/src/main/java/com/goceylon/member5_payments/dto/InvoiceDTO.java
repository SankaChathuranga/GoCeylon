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
public class InvoiceDTO {
    private Long id;
    private String invoiceNumber;
    private Long paymentId;
    private String touristName;
    private BigDecimal totalAmount;
    private String activityTitle;
    private String bookingReference;
    private LocalDateTime issuedAt;
}
