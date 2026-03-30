package com.goceylon.member6_reviews.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationDTO {
    private Long id;
    private String adminName;
    private String actionType;
    private String targetType;
    private Long targetId;
    private String reason;
    private LocalDateTime createdAt;
}
