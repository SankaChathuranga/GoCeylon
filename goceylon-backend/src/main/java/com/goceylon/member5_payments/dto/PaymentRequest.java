package com.goceylon.member5_payments.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 */
@Data
public class PaymentRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "^(CREDIT_CARD|DEBIT_CARD|BANK_TRANSFER|DIGITAL_WALLET)$",
             message = "Payment method must be CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, or DIGITAL_WALLET")
    private String paymentMethod;

    // Mock card details (for demonstration)
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;
}
