package com.goceylon.member2_listings.service;

import com.goceylon.common.exception.*;
import com.goceylon.member1_auth.model.Role;
import com.goceylon.member1_auth.model.User;
import com.goceylon.member1_auth.repository.UserRepository;
import com.goceylon.member2_listings.dto.*;
import com.goceylon.member2_listings.model.*;
import com.goceylon.member2_listings.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 * Service layer for managing activity and event listings.
 * Handles CRUD operations with business validations.
 */
@Service
public class ListingService {

    private final ActivityRepository activityRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public ListingService(ActivityRepository activityRepository,
                          EventRepository eventRepository,
                          UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // ==================== ACTIVITY CRUD ====================

    // CREATE
    @Transactional
    public ActivityDTO createActivity(String providerEmail, CreateActivityRequest request) {
        User provider = getProviderOrThrow(providerEmail);

        // Validation: Only providers can create activities
        if (provider.getRole() != Role.PROVIDER) {
            throw new BadRequestException("Only providers can create activities");
        }

        // Validation: Valid category
        Category category;
        try {
            category = Category.valueOf(request.getCategory().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid category: " + request.getCategory());
        }

        Activity activity = Activity.builder()
                .provider(provider)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .price(request.getPrice())
                .durationHours(request.getDurationHours())
                .maxParticipants(request.getMaxParticipants())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .locationName(request.getLocationName())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        Activity saved = activityRepository.save(activity);
        return mapToActivityDTO(saved);
    }

    // READ
    public List<ActivityDTO> getAllActivities() {
        return activityRepository.findByIsActiveTrue().stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    public ActivityDTO getActivityById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        return mapToActivityDTO(activity);
    }

    public List<ActivityDTO> getActivitiesByProvider(Long providerId) {
        return activityRepository.findByProviderIdAndIsActiveTrue(providerId).stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    public List<ActivityDTO> getActivitiesByCategory(String categoryStr) {
        Category category;
        try {
            category = Category.valueOf(categoryStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid category: " + categoryStr);
        }
        return activityRepository.findByCategoryAndIsActiveTrue(category).stream()
                .map(this::mapToActivityDTO)
                .collect(Collectors.toList());
    }

    // UPDATE
    @Transactional
    public ActivityDTO updateActivity(Long id, String providerEmail, CreateActivityRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        // Validation: Only the owner can update
        if (!activity.getProvider().getEmail().equals(providerEmail)) {
            throw new UnauthorizedException("You can only update your own activities");
        }

        if (request.getTitle() != null) activity.setTitle(request.getTitle());
        if (request.getDescription() != null) activity.setDescription(request.getDescription());
        if (request.getCategory() != null) {
            try {
                activity.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid category: " + request.getCategory());
            }
        }
        if (request.getPrice() != null) activity.setPrice(request.getPrice());
        if (request.getDurationHours() != null) activity.setDurationHours(request.getDurationHours());
        if (request.getMaxParticipants() != null) activity.setMaxParticipants(request.getMaxParticipants());
        if (request.getLatitude() != null) activity.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) activity.setLongitude(request.getLongitude());
        if (request.getLocationName() != null) activity.setLocationName(request.getLocationName());
        if (request.getImageUrl() != null) activity.setImageUrl(request.getImageUrl());

        Activity updated = activityRepository.save(activity);
        return mapToActivityDTO(updated);
    }

    // DELETE
    @Transactional
    public void deleteActivity(Long id, String userEmail) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validation: Only owner or admin can delete
        if (!activity.getProvider().getEmail().equals(userEmail) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only delete your own activities");
        }

        activity.setIsActive(false);
        activityRepository.save(activity);
    }

    // ==================== EVENT CRUD ====================

    // CREATE
    @Transactional
    public EventDTO createEvent(String providerEmail, CreateEventRequest request) {
        User provider = getProviderOrThrow(providerEmail);

        if (provider.getRole() != Role.PROVIDER) {
            throw new BadRequestException("Only providers can create events");
        }

        // Validation: Event date must be in the future
        if (request.getEventDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Event date must be in the future");
        }

        Category category;
        try {
            category = Category.valueOf(request.getCategory().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid category: " + request.getCategory());
        }

        Event event = Event.builder()
                .provider(provider)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .price(request.getPrice())
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxAttendees(request.getMaxAttendees())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .locationName(request.getLocationName())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        Event saved = eventRepository.save(event);
        return mapToEventDTO(saved);
    }

    // READ
    public List<EventDTO> getAllEvents() {
        return eventRepository.findByIsActiveTrue().stream()
                .map(this::mapToEventDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToEventDTO(event);
    }

    public List<EventDTO> getUpcomingEvents() {
        return eventRepository.findByEventDateAfterAndIsActiveTrue(LocalDate.now()).stream()
                .map(this::mapToEventDTO)
                .collect(Collectors.toList());
    }

    // UPDATE
    @Transactional
    public EventDTO updateEvent(Long id, String providerEmail, CreateEventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        if (!event.getProvider().getEmail().equals(providerEmail)) {
            throw new UnauthorizedException("You can only update your own events");
        }

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getCategory() != null) {
            try {
                event.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid category: " + request.getCategory());
            }
        }
        if (request.getPrice() != null) event.setPrice(request.getPrice());
        if (request.getEventDate() != null) {
            if (request.getEventDate().isBefore(LocalDate.now())) {
                throw new BadRequestException("Event date must be in the future");
            }
            event.setEventDate(request.getEventDate());
        }
        if (request.getStartTime() != null) event.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) event.setEndTime(request.getEndTime());
        if (request.getMaxAttendees() != null) event.setMaxAttendees(request.getMaxAttendees());
        if (request.getLatitude() != null) event.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) event.setLongitude(request.getLongitude());
        if (request.getLocationName() != null) event.setLocationName(request.getLocationName());
        if (request.getImageUrl() != null) event.setImageUrl(request.getImageUrl());

        Event updated = eventRepository.save(event);
        return mapToEventDTO(updated);
    }

    // DELETE
    @Transactional
    public void deleteEvent(Long id, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!event.getProvider().getEmail().equals(userEmail) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only delete your own events");
        }

        event.setIsActive(false);
        eventRepository.save(event);
    }

    // ==================== HELPERS ====================

    private User getProviderOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ActivityDTO mapToActivityDTO(Activity a) {
        return ActivityDTO.builder()
                .id(a.getId())
                .providerId(a.getProvider().getId())
                .providerName(a.getProvider().getFirstName() + " " + a.getProvider().getLastName())
                .title(a.getTitle())
                .description(a.getDescription())
                .category(a.getCategory().name())
                .price(a.getPrice())
                .durationHours(a.getDurationHours())
                .maxParticipants(a.getMaxParticipants())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .locationName(a.getLocationName())
                .imageUrl(a.getImageUrl())
                .isActive(a.getIsActive())
                .createdAt(a.getCreatedAt())
                .build();
    }

    private EventDTO mapToEventDTO(Event e) {
        return EventDTO.builder()
                .id(e.getId())
                .providerId(e.getProvider().getId())
                .providerName(e.getProvider().getFirstName() + " " + e.getProvider().getLastName())
                .title(e.getTitle())
                .description(e.getDescription())
                .category(e.getCategory().name())
                .price(e.getPrice())
                .eventDate(e.getEventDate())
                .startTime(e.getStartTime())
                .endTime(e.getEndTime())
                .maxAttendees(e.getMaxAttendees())
                .latitude(e.getLatitude())
                .longitude(e.getLongitude())
                .locationName(e.getLocationName())
                .imageUrl(e.getImageUrl())
                .isActive(e.getIsActive())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
