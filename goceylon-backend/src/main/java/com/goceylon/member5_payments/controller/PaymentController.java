package com.goceylon.member5_payments.controller;

import com.goceylon.common.dto.ApiResponse;
import com.goceylon.member5_payments.dto.*;
import com.goceylon.member5_payments.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 * REST Controller for payment processing, invoices, and payouts.
 */
@RestController
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ==================== CREATE ====================

    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<PaymentDTO>> processPayment(
            Authentication auth, @Valid @RequestBody PaymentRequest request) {
        PaymentDTO payment = paymentService.processPayment(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment processed successfully", payment));
    }

    // ==================== READ ====================

    @GetMapping("/payments/{id}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentById(
            @PathVariable Long id, Authentication auth) {
        PaymentDTO payment = paymentService.getPaymentById(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/payments/history")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentHistory(Authentication auth) {
        List<PaymentDTO> payments = paymentService.getPaymentHistory(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<ApiResponse<InvoiceDTO>> getInvoiceById(
            @PathVariable Long id, Authentication auth) {
        InvoiceDTO invoice = paymentService.getInvoiceById(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success(invoice));
    }

    @GetMapping("/payouts/provider")
    public ResponseEntity<ApiResponse<List<PayoutDTO>>> getProviderPayouts(Authentication auth) {
        List<PayoutDTO> payouts = paymentService.getProviderPayouts(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(payouts));
    }

    // ==================== UPDATE ====================

    @PutMapping("/payments/{id}/status")
    public ResponseEntity<ApiResponse<PaymentDTO>> updatePaymentStatus(
            @PathVariable Long id, @RequestParam String status) {
        PaymentDTO payment = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated", payment));
    }

    @PutMapping("/payouts/{id}/complete")
    public ResponseEntity<ApiResponse<PayoutDTO>> completePayout(@PathVariable Long id) {
        PayoutDTO payout = paymentService.completePayout(id);
        return ResponseEntity.ok(ApiResponse.success("Payout completed", payout));
    }

    // ==================== DELETE ====================

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFailedPayment(@PathVariable Long id) {
        paymentService.deleteFailedPayment(id);
        return ResponseEntity.ok(ApiResponse.success("Failed payment deleted", null));
    }
}
