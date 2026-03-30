package com.goceylon.member3_discovery.controller;

import com.goceylon.common.dto.ApiResponse;
import com.goceylon.member3_discovery.dto.*;
import com.goceylon.member3_discovery.service.DiscoveryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 * REST Controller for map discovery, favorites, itineraries, and search preferences.
 */
@RestController
@RequestMapping("/api")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    public DiscoveryController(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    // ==================== NEARBY DISCOVERY ====================

    @GetMapping("/discovery/nearby")
    public ResponseEntity<ApiResponse<List<NearbyActivityDTO>>> getNearbyActivities(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25") double radius) {
        List<NearbyActivityDTO> activities = discoveryService.getNearbyActivities(lat, lng, radius);
        return ResponseEntity.ok(ApiResponse.success(activities));
    }

    // ==================== FAVORITES ====================

    // CREATE
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteDTO>> saveFavorite(
            Authentication auth, @Valid @RequestBody CreateFavoriteRequest request) {
        FavoriteDTO favorite = discoveryService.saveFavorite(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Favorite saved", favorite));
    }

    // READ
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteDTO>>> getUserFavorites(Authentication auth) {
        List<FavoriteDTO> favorites = discoveryService.getUserFavorites(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    // DELETE
    @DeleteMapping("/favorites/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable Long id, Authentication auth) {
        discoveryService.removeFavorite(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Favorite removed", null));
    }

    // ==================== ITINERARIES ====================

    // CREATE
    @PostMapping("/itineraries")
    public ResponseEntity<ApiResponse<ItineraryDTO>> createItinerary(
            Authentication auth, @Valid @RequestBody CreateItineraryRequest request) {
        ItineraryDTO itinerary = discoveryService.createItinerary(auth.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Itinerary created", itinerary));
    }

    // READ
    @GetMapping("/itineraries")
    public ResponseEntity<ApiResponse<List<ItineraryDTO>>> getUserItineraries(Authentication auth) {
        List<ItineraryDTO> itineraries = discoveryService.getUserItineraries(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(itineraries));
    }

    @GetMapping("/itineraries/{id}")
    public ResponseEntity<ApiResponse<ItineraryDTO>> getItineraryById(
            @PathVariable Long id, Authentication auth) {
        ItineraryDTO itinerary = discoveryService.getItineraryById(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success(itinerary));
    }

    // UPDATE
    @PutMapping("/itineraries/{id}")
    public ResponseEntity<ApiResponse<ItineraryDTO>> updateItinerary(
            @PathVariable Long id, Authentication auth,
            @Valid @RequestBody CreateItineraryRequest request) {
        ItineraryDTO itinerary = discoveryService.updateItinerary(id, auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Itinerary updated", itinerary));
    }

    // DELETE
    @DeleteMapping("/itineraries/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItinerary(
            @PathVariable Long id, Authentication auth) {
        discoveryService.deleteItinerary(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Itinerary deleted", null));
    }

    // ==================== SEARCH PREFERENCES ====================

    // CREATE / UPDATE
    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<SearchPreferenceDTO>> savePreferences(
            Authentication auth, @RequestBody SearchPreferenceDTO request) {
        SearchPreferenceDTO prefs = discoveryService.saveSearchPreferences(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Preferences saved", prefs));
    }

    // READ
    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<SearchPreferenceDTO>> getPreferences(Authentication auth) {
        SearchPreferenceDTO prefs = discoveryService.getSearchPreferences(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(prefs));
    }
}
