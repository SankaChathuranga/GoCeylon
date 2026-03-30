package com.goceylon.member6_reviews.service;

import com.goceylon.common.exception.*;
import com.goceylon.member1_auth.model.Role;
import com.goceylon.member1_auth.model.User;
import com.goceylon.member1_auth.repository.UserRepository;
import com.goceylon.member2_listings.model.Activity;
import com.goceylon.member2_listings.repository.ActivityRepository;
import com.goceylon.member2_listings.repository.EventRepository;
import com.goceylon.member4_bookings.model.BookingStatus;
import com.goceylon.member4_bookings.repository.BookingRepository;
import com.goceylon.member6_reviews.dto.*;
import com.goceylon.member6_reviews.model.*;
import com.goceylon.member6_reviews.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 * Service for reviews, ratings, admin moderation, and analytics.
 */
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ModerationLogRepository moderationLogRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ModerationLogRepository moderationLogRepository,
                         UserRepository userRepository,
                         ActivityRepository activityRepository,
                         EventRepository eventRepository,
                         BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.moderationLogRepository = moderationLogRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
    }

    // ==================== REVIEW CRUD ====================

    // CREATE
    @Transactional
    public ReviewDTO createReview(String touristEmail, CreateReviewRequest request) {
        User tourist = userRepository.findByEmail(touristEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        // Validation: Cannot review own activity
        if (activity.getProvider().getEmail().equals(touristEmail)) {
            throw new BadRequestException("You cannot review your own activity");
        }

        // Validation: Cannot review twice
        if (reviewRepository.existsByTouristIdAndActivityId(tourist.getId(), activity.getId())) {
            throw new BadRequestException("You have already reviewed this activity");
        }

        Review review = Review.builder()
                .tourist(tourist)
                .activity(activity)
                .rating(request.getRating())
                .comment(request.getComment())
                .isFlagged(false)
                .build();

        Review saved = reviewRepository.save(review);
        return mapToReviewDTO(saved);
    }

    // READ
    public List<ReviewDTO> getActivityReviews(Long activityId) {
        return reviewRepository.findByActivityIdOrderByCreatedAtDesc(activityId).stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    public Double getActivityAverageRating(Long activityId) {
        Double avg = reviewRepository.getAverageRatingByActivityId(activityId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    // UPDATE
    @Transactional
    public ReviewDTO updateReview(Long id, String touristEmail, CreateReviewRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Validation: Only the author can update
        if (!review.getTourist().getEmail().equals(touristEmail)) {
            throw new UnauthorizedException("You can only edit your own reviews");
        }

        if (request.getRating() != null) review.setRating(request.getRating());
        if (request.getComment() != null) review.setComment(request.getComment());

        Review updated = reviewRepository.save(review);
        return mapToReviewDTO(updated);
    }

    // DELETE
    @Transactional
    public void deleteReview(Long id, String userEmail) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validation: Only author or admin can delete
        if (!review.getTourist().getEmail().equals(userEmail) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    // ==================== ADMIN FUNCTIONS ====================

    public AnalyticsDTO getAnalytics() {
        Double avgRating = reviewRepository.getOverallAverageRating();

        return AnalyticsDTO.builder()
                .totalUsers(userRepository.count())
                .totalTourists(userRepository.countByRole(Role.TOURIST))
                .totalProviders(userRepository.countByRole(Role.PROVIDER))
                .totalActivities(activityRepository.countByIsActiveTrue())
                .totalEvents(eventRepository.countByIsActiveTrue())
                .totalBookings(bookingRepository.count())
                .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
                .completedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED))
                .totalReviews(reviewRepository.count())
                .flaggedReviews(reviewRepository.countByIsFlaggedTrue())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .build();
    }

    public List<ReviewDTO> getFlaggedReviews() {
        return reviewRepository.findByIsFlaggedTrue().stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ModerationDTO createModerationAction(String adminEmail, ModerationRequest request) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        // Validation: Only admins can moderate
        if (admin.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can perform moderation actions");
        }

        // Perform the moderation action
        switch (request.getActionType().toUpperCase()) {
            case "REVIEW_REMOVED":
                Review review = reviewRepository.findById(request.getTargetId())
                        .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
                reviewRepository.delete(review);
                break;
            case "USER_BANNED":
                User targetUser = userRepository.findById(request.getTargetId())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                targetUser.setIsActive(false);
                userRepository.save(targetUser);
                break;
            case "LISTING_REMOVED":
                if ("ACTIVITY".equals(request.getTargetType())) {
                    Activity activity = activityRepository.findById(request.getTargetId())
                            .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
                    activity.setIsActive(false);
                    activityRepository.save(activity);
                }
                break;
            case "CONTENT_FLAGGED":
                if ("REVIEW".equals(request.getTargetType())) {
                    Review flagReview = reviewRepository.findById(request.getTargetId())
                            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
                    flagReview.setIsFlagged(true);
                    reviewRepository.save(flagReview);
                }
                break;
            default:
                throw new BadRequestException("Invalid action type: " + request.getActionType());
        }

        // Log the moderation action
        ModerationLog log = ModerationLog.builder()
                .admin(admin)
                .actionType(request.getActionType())
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .build();

        ModerationLog saved = moderationLogRepository.save(log);

        return ModerationDTO.builder()
                .id(saved.getId())
                .adminName(admin.getFirstName() + " " + admin.getLastName())
                .actionType(saved.getActionType())
                .targetType(saved.getTargetType())
                .targetId(saved.getTargetId())
                .reason(saved.getReason())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional
    public void updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(active);
        userRepository.save(user);
    }

    // ==================== HELPERS ====================

    private ReviewDTO mapToReviewDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .touristId(r.getTourist().getId())
                .touristName(r.getTourist().getFirstName() + " " + r.getTourist().getLastName())
                .activityId(r.getActivity().getId())
                .activityTitle(r.getActivity().getTitle())
                .rating(r.getRating())
                .comment(r.getComment())
                .isFlagged(r.getIsFlagged())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
