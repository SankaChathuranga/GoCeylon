package com.goceylon.member6_reviews.controller;

import com.goceylon.common.dto.ApiResponse;
import com.goceylon.member1_auth.dto.UserProfileDTO;
import com.goceylon.member1_auth.service.AuthService;
import com.goceylon.member6_reviews.dto.*;
import com.goceylon.member6_reviews.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 * REST Controller for admin panel features.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ReviewService reviewService;
    private final AuthService authService;

    public AdminController(ReviewService reviewService, AuthService authService) {
        this.reviewService = reviewService;
        this.authService = authService;
    }

    // READ - Analytics
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getAnalytics() {
        AnalyticsDTO analytics = reviewService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    // READ - All users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileDTO>>> getAllUsers() {
        List<UserProfileDTO> users = authService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // UPDATE - User status
    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(
            @PathVariable Long id, @RequestParam boolean active) {
        reviewService.updateUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success(
                active ? "User activated" : "User deactivated", null));
    }

    // READ - Flagged content
    @GetMapping("/flagged")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getFlaggedContent() {
        List<ReviewDTO> flagged = reviewService.getFlaggedReviews();
        return ResponseEntity.ok(ApiResponse.success(flagged));
    }

    // CREATE - Moderation action
    @PostMapping("/moderate")
    public ResponseEntity<ApiResponse<ModerationDTO>> moderate(
            Authentication auth, @Valid @RequestBody ModerationRequest request) {
        ModerationDTO result = reviewService.createModerationAction(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Moderation action completed", result));
    }
}
