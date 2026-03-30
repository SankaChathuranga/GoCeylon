package com.goceylon.member6_reviews.controller;

import com.goceylon.common.dto.ApiResponse;
import com.goceylon.member6_reviews.dto.*;
import com.goceylon.member6_reviews.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 * REST Controller for reviews and ratings.
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(
            Authentication auth, @Valid @RequestBody CreateReviewRequest request) {
        ReviewDTO review = reviewService.createReview(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", review));
    }

    // READ
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getActivityReviews(
            @PathVariable Long activityId) {
        List<ReviewDTO> reviews = reviewService.getActivityReviews(activityId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/activity/{activityId}/rating")
    public ResponseEntity<ApiResponse<Double>> getActivityRating(
            @PathVariable Long activityId) {
        Double rating = reviewService.getActivityAverageRating(activityId);
        return ResponseEntity.ok(ApiResponse.success(rating));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewDTO>> updateReview(
            @PathVariable Long id, Authentication auth,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewDTO review = reviewService.updateReview(id, auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Review updated", review));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id, Authentication auth) {
        reviewService.deleteReview(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
