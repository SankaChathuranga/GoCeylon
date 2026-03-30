package com.goceylon.member1_auth.controller;

import com.goceylon.common.dto.ApiResponse;
import com.goceylon.member1_auth.dto.*;
import com.goceylon.member1_auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================
 * MEMBER 1 – User Management & Authentication
 * Student ID: IT24103772
 * ============================================
 * REST Controller for authentication and user management.
 * Handles registration, login, profile CRUD, and password management.
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ==================== CREATE ====================

    /**
     * POST /api/auth/register - Register a new user
     */
    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    /**
     * POST /api/auth/login - Login user
     */
    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    // ==================== READ ====================

    /**
     * GET /api/users/profile - Get current user's profile
     */
    @GetMapping("/users/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(Authentication authentication) {
        UserProfileDTO profile = authService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * GET /api/users/{id} - Get user by ID
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getUserById(@PathVariable Long id) {
        UserProfileDTO profile = authService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * GET /api/users - Get all users (Admin only)
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileDTO>>> getAllUsers() {
        List<UserProfileDTO> users = authService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // ==================== UPDATE ====================

    /**
     * PUT /api/users/profile - Update current user's profile
     */
    @PutMapping("/users/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO updatedProfile = authService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedProfile));
    }

    /**
     * PUT /api/users/password - Change password
     */
    @PutMapping("/users/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    // ==================== DELETE ====================

    /**
     * DELETE /api/users/{id} - Deactivate user account
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount(
            @PathVariable Long id,
            Authentication authentication) {
        authService.deactivateAccount(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Account deactivated successfully", null));
    }
}
