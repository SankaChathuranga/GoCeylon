package com.goceylon.member1_auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * ============================================
 * MEMBER 1 – User Management & Authentication
 * Student ID: IT24103772
 * ============================================
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
