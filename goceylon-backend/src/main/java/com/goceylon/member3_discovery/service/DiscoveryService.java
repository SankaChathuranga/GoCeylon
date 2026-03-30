package com.goceylon.member3_discovery.service;

import com.goceylon.common.exception.*;
import com.goceylon.member1_auth.model.User;
import com.goceylon.member1_auth.repository.UserRepository;
import com.goceylon.member2_listings.model.Activity;
import com.goceylon.member2_listings.repository.ActivityRepository;
import com.goceylon.member3_discovery.dto.*;
import com.goceylon.member3_discovery.model.*;
import com.goceylon.member3_discovery.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 * Service for map-based discovery, favorites, itineraries, and search preferences.
 */
@Service
public class DiscoveryService {

    private final ActivityRepository activityRepository;
    private final FavoriteRepository favoriteRepository;
    private final ItineraryRepository itineraryRepository;
    private final SearchPreferenceRepository searchPreferenceRepository;
    private final UserRepository userRepository;

    public DiscoveryService(ActivityRepository activityRepository,
                            FavoriteRepository favoriteRepository,
                            ItineraryRepository itineraryRepository,
                            SearchPreferenceRepository searchPreferenceRepository,
                            UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.favoriteRepository = favoriteRepository;
        this.itineraryRepository = itineraryRepository;
        this.searchPreferenceRepository = searchPreferenceRepository;
        this.userRepository = userRepository;
    }

    // ==================== NEARBY DISCOVERY ====================

    public List<NearbyActivityDTO> getNearbyActivities(double lat, double lng, double radiusKm) {
        // Validation: radius must be positive
        if (radiusKm <= 0 || radiusKm > 500) {
            throw new BadRequestException("Radius must be between 0 and 500 km");
        }

        double deltaLat = radiusKm / 111.0;
        double deltaLng = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));

        List<Activity> activities = activityRepository.findNearbyActivities(
                lat - deltaLat, lat + deltaLat,
                lng - deltaLng, lng + deltaLng);

        return activities.stream().map(a -> {
            double distance = calculateDistance(lat, lng, a.getLatitude(), a.getLongitude());
            if (distance <= radiusKm) {
                return NearbyActivityDTO.builder()
                        .id(a.getId())
                        .title(a.getTitle())
                        .description(a.getDescription())
                        .category(a.getCategory().name())
                        .price(a.getPrice())
                        .latitude(a.getLatitude())
                        .longitude(a.getLongitude())
                        .locationName(a.getLocationName())
                        .imageUrl(a.getImageUrl())
                        .providerName(a.getProvider().getFirstName() + " " + a.getProvider().getLastName())
                        .distance(Math.round(distance * 100.0) / 100.0)
                        .build();
            }
            return null;
        }).filter(a -> a != null).collect(Collectors.toList());
    }

    // ==================== FAVORITES CRUD ====================

    // CREATE
    @Transactional
    public FavoriteDTO saveFavorite(String userEmail, CreateFavoriteRequest request) {
        User user = getUserOrThrow(userEmail);

        // Validation: prevent duplicate activity favorites
        if ("ACTIVITY".equals(request.getFavoriteType()) && request.getActivityId() != null) {
            if (favoriteRepository.existsByUserIdAndActivityId(user.getId(), request.getActivityId())) {
                throw new BadRequestException("Activity is already in your favorites");
            }
        }

        // Validation: for LOCATION type, coordinates are required
        if ("LOCATION".equals(request.getFavoriteType())) {
            if (request.getLatitude() == null || request.getLongitude() == null) {
                throw new BadRequestException("Latitude and longitude are required for location favorites");
            }
        }

        Activity activity = null;
        if (request.getActivityId() != null) {
            activity = activityRepository.findById(request.getActivityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .activity(activity)
                .locationName(request.getLocationName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .favoriteType(request.getFavoriteType())
                .build();

        Favorite saved = favoriteRepository.save(favorite);
        return mapToFavoriteDTO(saved);
    }

    // READ
    public List<FavoriteDTO> getUserFavorites(String userEmail) {
        User user = getUserOrThrow(userEmail);
        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(this::mapToFavoriteDTO)
                .collect(Collectors.toList());
    }

    // DELETE
    @Transactional
    public void removeFavorite(Long id, String userEmail) {
        User user = getUserOrThrow(userEmail);
        Favorite favorite = favoriteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));

        if (!favorite.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only remove your own favorites");
        }

        favoriteRepository.delete(favorite);
    }

    // ==================== ITINERARY CRUD ====================

    // CREATE
    @Transactional
    public ItineraryDTO createItinerary(String userEmail, CreateItineraryRequest request) {
        User user = getUserOrThrow(userEmail);

        // Validation: end date must be after start date
        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new BadRequestException("End date must be after start date");
            }
        }

        Itinerary itinerary = Itinerary.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .items(new ArrayList<>())
                .build();

        if (request.getItems() != null) {
            for (CreateItineraryRequest.CreateItineraryItemRequest itemReq : request.getItems()) {
                Activity activity = null;
                if (itemReq.getActivityId() != null) {
                    activity = activityRepository.findById(itemReq.getActivityId())
                            .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
                }
                ItineraryItem item = ItineraryItem.builder()
                        .itinerary(itinerary)
                        .activity(activity)
                        .dayNumber(itemReq.getDayNumber())
                        .orderIndex(itemReq.getOrderIndex())
                        .notes(itemReq.getNotes())
                        .build();
                itinerary.getItems().add(item);
            }
        }

        Itinerary saved = itineraryRepository.save(itinerary);
        return mapToItineraryDTO(saved);
    }

    // READ
    public List<ItineraryDTO> getUserItineraries(String userEmail) {
        User user = getUserOrThrow(userEmail);
        return itineraryRepository.findByUserId(user.getId()).stream()
                .map(this::mapToItineraryDTO)
                .collect(Collectors.toList());
    }

    public ItineraryDTO getItineraryById(Long id, String userEmail) {
        User user = getUserOrThrow(userEmail);
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only view your own itineraries");
        }
        return mapToItineraryDTO(itinerary);
    }

    // UPDATE
    @Transactional
    public ItineraryDTO updateItinerary(Long id, String userEmail, CreateItineraryRequest request) {
        User user = getUserOrThrow(userEmail);
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only update your own itineraries");
        }

        if (request.getTitle() != null) itinerary.setTitle(request.getTitle());
        if (request.getDescription() != null) itinerary.setDescription(request.getDescription());
        if (request.getStartDate() != null) itinerary.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) itinerary.setEndDate(request.getEndDate());

        if (request.getItems() != null) {
            itinerary.getItems().clear();
            for (CreateItineraryRequest.CreateItineraryItemRequest itemReq : request.getItems()) {
                Activity activity = null;
                if (itemReq.getActivityId() != null) {
                    activity = activityRepository.findById(itemReq.getActivityId())
                            .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
                }
                ItineraryItem item = ItineraryItem.builder()
                        .itinerary(itinerary)
                        .activity(activity)
                        .dayNumber(itemReq.getDayNumber())
                        .orderIndex(itemReq.getOrderIndex())
                        .notes(itemReq.getNotes())
                        .build();
                itinerary.getItems().add(item);
            }
        }

        Itinerary updated = itineraryRepository.save(itinerary);
        return mapToItineraryDTO(updated);
    }

    // DELETE
    @Transactional
    public void deleteItinerary(Long id, String userEmail) {
        User user = getUserOrThrow(userEmail);
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own itineraries");
        }

        itineraryRepository.delete(itinerary);
    }

    // ==================== SEARCH PREFERENCES CRUD ====================

    // CREATE / UPDATE
    @Transactional
    public SearchPreferenceDTO saveSearchPreferences(String userEmail, SearchPreferenceDTO request) {
        User user = getUserOrThrow(userEmail);

        SearchPreference pref = searchPreferenceRepository.findByUserId(user.getId())
                .orElse(SearchPreference.builder().user(user).build());

        if (request.getPreferredCategories() != null) pref.setPreferredCategories(request.getPreferredCategories());
        if (request.getMaxDistanceKm() != null) pref.setMaxDistanceKm(request.getMaxDistanceKm());
        if (request.getMinPrice() != null) pref.setMinPrice(request.getMinPrice());
        if (request.getMaxPrice() != null) pref.setMaxPrice(request.getMaxPrice());

        SearchPreference saved = searchPreferenceRepository.save(pref);
        return mapToSearchPrefDTO(saved);
    }

    // READ
    public SearchPreferenceDTO getSearchPreferences(String userEmail) {
        User user = getUserOrThrow(userEmail);
        SearchPreference pref = searchPreferenceRepository.findByUserId(user.getId())
                .orElse(SearchPreference.builder().maxDistanceKm(50).build());
        return mapToSearchPrefDTO(pref);
    }

    // ==================== HELPERS ====================

    private User getUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private FavoriteDTO mapToFavoriteDTO(Favorite f) {
        return FavoriteDTO.builder()
                .id(f.getId())
                .activityId(f.getActivity() != null ? f.getActivity().getId() : null)
                .activityTitle(f.getActivity() != null ? f.getActivity().getTitle() : null)
                .locationName(f.getLocationName())
                .latitude(f.getLatitude())
                .longitude(f.getLongitude())
                .favoriteType(f.getFavoriteType())
                .createdAt(f.getCreatedAt())
                .build();
    }

    private ItineraryDTO mapToItineraryDTO(Itinerary i) {
        List<ItineraryItemDTO> items = i.getItems().stream()
                .map(item -> ItineraryItemDTO.builder()
                        .id(item.getId())
                        .activityId(item.getActivity() != null ? item.getActivity().getId() : null)
                        .activityTitle(item.getActivity() != null ? item.getActivity().getTitle() : null)
                        .dayNumber(item.getDayNumber())
                        .orderIndex(item.getOrderIndex())
                        .notes(item.getNotes())
                        .build())
                .collect(Collectors.toList());

        return ItineraryDTO.builder()
                .id(i.getId())
                .title(i.getTitle())
                .description(i.getDescription())
                .startDate(i.getStartDate())
                .endDate(i.getEndDate())
                .items(items)
                .createdAt(i.getCreatedAt())
                .build();
    }

    private SearchPreferenceDTO mapToSearchPrefDTO(SearchPreference p) {
        return SearchPreferenceDTO.builder()
                .preferredCategories(p.getPreferredCategories())
                .maxDistanceKm(p.getMaxDistanceKm())
                .minPrice(p.getMinPrice())
                .maxPrice(p.getMaxPrice())
                .build();
    }
}
