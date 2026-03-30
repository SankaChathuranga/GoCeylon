package com.goceylon.member2_listings.controller;

import com.goceylon.common.dto.ApiResponse;
import com.goceylon.member2_listings.dto.*;
import com.goceylon.member2_listings.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 * REST Controller for activity and event listing management.
 */
@RestController
@RequestMapping("/api")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    // ==================== ACTIVITY ENDPOINTS ====================

    // CREATE
    @PostMapping("/activities")
    public ResponseEntity<ApiResponse<ActivityDTO>> createActivity(
            Authentication auth, @Valid @RequestBody CreateActivityRequest request) {
        ActivityDTO activity = listingService.createActivity(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Activity created successfully", activity));
    }

    // READ
    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<ActivityDTO>>> getAllActivities(
            @RequestParam(required = false) String category) {
        List<ActivityDTO> activities;
        if (category != null && !category.isEmpty()) {
            activities = listingService.getActivitiesByCategory(category);
        } else {
            activities = listingService.getAllActivities();
        }
        return ResponseEntity.ok(ApiResponse.success(activities));
    }

    @GetMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<ActivityDTO>> getActivityById(@PathVariable Long id) {
        ActivityDTO activity = listingService.getActivityById(id);
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @GetMapping("/activities/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<ActivityDTO>>> getActivitiesByProvider(
            @PathVariable Long providerId) {
        List<ActivityDTO> activities = listingService.getActivitiesByProvider(providerId);
        return ResponseEntity.ok(ApiResponse.success(activities));
    }

    // UPDATE
    @PutMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<ActivityDTO>> updateActivity(
            @PathVariable Long id, Authentication auth,
            @Valid @RequestBody CreateActivityRequest request) {
        ActivityDTO activity = listingService.updateActivity(id, auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Activity updated successfully", activity));
    }

    // DELETE
    @DeleteMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(
            @PathVariable Long id, Authentication auth) {
        listingService.deleteActivity(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Activity deleted successfully", null));
    }

    // ==================== EVENT ENDPOINTS ====================

    // CREATE
    @PostMapping("/events")
    public ResponseEntity<ApiResponse<EventDTO>> createEvent(
            Authentication auth, @Valid @RequestBody CreateEventRequest request) {
        EventDTO event = listingService.createEvent(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", event));
    }

    // READ
    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventDTO>>> getAllEvents(
            @RequestParam(required = false) Boolean upcoming) {
        List<EventDTO> events;
        if (Boolean.TRUE.equals(upcoming)) {
            events = listingService.getUpcomingEvents();
        } else {
            events = listingService.getAllEvents();
        }
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventDTO>> getEventById(@PathVariable Long id) {
        EventDTO event = listingService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    // UPDATE
    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventDTO>> updateEvent(
            @PathVariable Long id, Authentication auth,
            @Valid @RequestBody CreateEventRequest request) {
        EventDTO event = listingService.updateEvent(id, auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", event));
    }

    // DELETE
    @DeleteMapping("/events/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id, Authentication auth) {
        listingService.deleteEvent(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
