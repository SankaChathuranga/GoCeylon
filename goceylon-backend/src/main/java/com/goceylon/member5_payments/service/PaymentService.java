package com.goceylon.member5_payments.service;

import com.goceylon.common.exception.*;
import com.goceylon.member1_auth.model.Role;
import com.goceylon.member1_auth.model.User;
import com.goceylon.member1_auth.repository.UserRepository;
import com.goceylon.member4_bookings.model.*;
import com.goceylon.member4_bookings.repository.BookingRepository;
import com.goceylon.member5_payments.dto.*;
import com.goceylon.member5_payments.model.*;
import com.goceylon.member5_payments.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 * Service for payment processing, invoices, and provider payouts.
 * Uses a mock payment system for demonstration.
 */
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PayoutRepository payoutRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Value("${goceylon.commission-rate:0.10}")
    private double commissionRate;

    public PaymentService(PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository,
                          PayoutRepository payoutRepository,
                          BookingRepository bookingRepository,
                          UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.payoutRepository = payoutRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    // ==================== CREATE ====================

    /**
     * Process a payment for a booking (Mock Payment System).
     * Calculates commission, generates invoice, and creates payout record.
     */
    @Transactional
    public PaymentDTO processPayment(String userEmail, PaymentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        // Validation: Only the tourist who made the booking can pay
        if (!booking.getTourist().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You can only pay for your own bookings");
        }

        // Validation: Booking must be confirmed
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking must be confirmed before payment. Current status: " + booking.getStatus());
        }

        // Validation: Check if already paid
        if (paymentRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new BadRequestException("Payment already exists for this booking");
        }

        // Calculate commission and provider amount
        BigDecimal amount = booking.getTotalPrice();
        BigDecimal commission = amount.multiply(BigDecimal.valueOf(commissionRate)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal providerAmount = amount.subtract(commission);

        // Mock payment processing - simulate transaction
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(amount)
                .commission(commission)
                .providerAmount(providerAmount)
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.COMPLETED) // Mock: always succeeds
                .transactionId(transactionId)
                .paidAt(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Auto-generate invoice
        String invoiceNumber = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Invoice invoice = Invoice.builder()
                .payment(savedPayment)
                .invoiceNumber(invoiceNumber)
                .tourist(user)
                .totalAmount(amount)
                .build();
        invoiceRepository.save(invoice);

        // Create payout record for provider
        Payout payout = Payout.builder()
                .provider(booking.getActivity().getProvider())
                .amount(providerAmount)
                .status("PENDING")
                .build();
        payoutRepository.save(payout);

        // Update booking status to COMPLETED
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        return mapToPaymentDTO(savedPayment);
    }

    // ==================== READ ====================

    public PaymentDTO getPaymentById(Long id, String userEmail) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        // Validation: Only the tourist or admin can view
        if (!payment.getBooking().getTourist().getEmail().equals(userEmail)) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (user.getRole() != Role.ADMIN) {
                throw new UnauthorizedException("You don't have permission to view this payment");
            }
        }

        return mapToPaymentDTO(payment);
    }

    public List<PaymentDTO> getPaymentHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return paymentRepository.findByBookingTouristIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToPaymentDTO)
                .collect(Collectors.toList());
    }

    public InvoiceDTO getInvoiceById(Long id, String userEmail) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        if (!invoice.getTourist().getEmail().equals(userEmail)) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (user.getRole() != Role.ADMIN) {
                throw new UnauthorizedException("You don't have permission to view this invoice");
            }
        }

        return mapToInvoiceDTO(invoice);
    }

    public List<PayoutDTO> getProviderPayouts(String providerEmail) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (provider.getRole() != Role.PROVIDER && provider.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only providers can view payouts");
        }

        return payoutRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId()).stream()
                .map(this::mapToPayoutDTO)
                .collect(Collectors.toList());
    }

    // ==================== UPDATE ====================

    @Transactional
    public PaymentDTO updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        try {
            payment.setStatus(PaymentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment status: " + status);
        }

        Payment updated = paymentRepository.save(payment);
        return mapToPaymentDTO(updated);
    }

    @Transactional
    public PayoutDTO completePayout(Long id) {
        Payout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payout not found"));

        if ("COMPLETED".equals(payout.getStatus())) {
            throw new BadRequestException("Payout is already completed");
        }

        payout.setStatus("COMPLETED");
        payout.setPayoutDate(LocalDateTime.now());
        Payout updated = payoutRepository.save(payout);
        return mapToPayoutDTO(updated);
    }

    // ==================== DELETE ====================

    @Transactional
    public void deleteFailedPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.FAILED) {
            throw new BadRequestException("Only failed payments can be deleted");
        }

        paymentRepository.delete(payment);
    }

    // ==================== HELPERS ====================

    private PaymentDTO mapToPaymentDTO(Payment p) {
        return PaymentDTO.builder()
                .id(p.getId())
                .bookingId(p.getBooking().getId())
                .bookingReference(p.getBooking().getReferenceNumber())
                .amount(p.getAmount())
                .commission(p.getCommission())
                .providerAmount(p.getProviderAmount())
                .paymentMethod(p.getPaymentMethod())
                .status(p.getStatus().name())
                .transactionId(p.getTransactionId())
                .paidAt(p.getPaidAt())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private InvoiceDTO mapToInvoiceDTO(Invoice i) {
        return InvoiceDTO.builder()
                .id(i.getId())
                .invoiceNumber(i.getInvoiceNumber())
                .paymentId(i.getPayment().getId())
                .touristName(i.getTourist().getFirstName() + " " + i.getTourist().getLastName())
                .totalAmount(i.getTotalAmount())
                .activityTitle(i.getPayment().getBooking().getActivity().getTitle())
                .bookingReference(i.getPayment().getBooking().getReferenceNumber())
                .issuedAt(i.getIssuedAt())
                .build();
    }

    private PayoutDTO mapToPayoutDTO(Payout p) {
        return PayoutDTO.builder()
                .id(p.getId())
                .providerId(p.getProvider().getId())
                .providerName(p.getProvider().getFirstName() + " " + p.getProvider().getLastName())
                .amount(p.getAmount())
                .status(p.getStatus())
                .payoutDate(p.getPayoutDate())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
