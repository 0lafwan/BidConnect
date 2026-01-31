package com.example.notificationservice.dto;

import com.example.notificationservice.enums.EventType;
import com.example.notificationservice.enums.NotificationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Notification details response")
public class NotificationResponse {

    @Schema(description = "Notification ID", example = "1")
    private Long id;

    @Schema(description = "User ID", example = "123")
    private Long userId;

    @Schema(description = "Recipient email address", example = "user@example.com")
    private String email;

    @Schema(description = "Type of notification event")
    private EventType eventType;

    @Schema(description = "Email subject", example = "New Tender Published")
    private String subject;

    @Schema(description = "Email content/message")
    private String content;

    @Schema(description = "Delivery status")
    private NotificationStatus status;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Sent timestamp (null if not sent)")
    private LocalDateTime sentAt;
}
