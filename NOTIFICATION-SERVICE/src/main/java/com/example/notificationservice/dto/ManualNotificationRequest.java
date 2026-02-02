package com.example.notificationservice.dto;

import com.example.notificationservice.enums.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to manually send a notification")
public class ManualNotificationRequest {

    @NotNull
    @Schema(description = "User ID", example = "user-123", required = true)
    private String userId;

    @NotBlank
    @Email
    @Schema(description = "Recipient email address", example = "user@example.com", required = true)
    private String email;

    @NotNull
    @Schema(description = "Type of notification", required = true)
    private EventType eventType;

    @NotBlank
    @Schema(description = "Email subject/title", example = "Important Update", required = true)
    private String title;

    @NotBlank
    @Schema(description = "Email message content", example = "This is an important notification", required = true)
    private String message;
}
