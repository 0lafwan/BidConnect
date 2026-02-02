package com.example.notificationservice.controller;

import com.example.notificationservice.dto.ManualNotificationRequest;
import com.example.notificationservice.dto.NotificationResponse;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.enums.EventType;
import com.example.notificationservice.enums.NotificationStatus;
import com.example.notificationservice.repository.NotificationRepository;
import com.example.notificationservice.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management and history API")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @GetMapping
    @Operation(summary = "Get all notifications", description = "Retrieve all notification records with optional filtering")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved notifications")
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        List<Notification> notifications = notificationRepository.findAll();
        return ResponseEntity.ok(notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get notifications by user ID", description = "Retrieve all notifications sent to a specific user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user notifications")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUser(
            @Parameter(description = "User ID", required = true) @PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        return ResponseEntity.ok(notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get notifications by status", description = "Retrieve all notifications with a specific delivery status")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved notifications by status")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByStatus(
            @Parameter(description = "Notification status", required = true) @PathVariable NotificationStatus status) {
        List<Notification> notifications = notificationRepository.findByStatus(status);
        return ResponseEntity.ok(notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/event-type/{eventType}")
    @Operation(summary = "Get notifications by event type", description = "Retrieve all notifications of a specific event type")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved notifications by event type")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByEventType(
            @Parameter(description = "Event type", required = true) @PathVariable EventType eventType) {
        List<Notification> notifications = notificationRepository.findByEventType(eventType);
        return ResponseEntity.ok(notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get notification by ID", description = "Retrieve a specific notification by its ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved notification")
    @ApiResponse(responseCode = "404", description = "Notification not found")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @Parameter(description = "Notification ID", required = true) @PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(notification -> ResponseEntity.ok(toResponse(notification)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/send")
    @Operation(summary = "Send manual notification", description = "Manually trigger a notification email (for testing or admin purposes)")
    @ApiResponse(responseCode = "201", description = "Notification sent successfully", content = @Content(schema = @Schema(implementation = NotificationResponse.class)))
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @ApiResponse(responseCode = "500", description = "Failed to send notification")
    public ResponseEntity<NotificationResponse> sendManualNotification(
            @Valid @RequestBody ManualNotificationRequest request) {

        // Create notification record
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .email(request.getEmail())
                .eventType(request.getEventType())
                .subject(request.getTitle())
                .content(request.getMessage())
                .status(NotificationStatus.PENDING)
                .build();

        notification = notificationRepository.save(notification);

        // Prepare template variables
        Map<String, Object> variables = new HashMap<>();
        variables.put("recipientName", request.getEmail().split("@")[0]);
        variables.put("title", request.getTitle());
        variables.put("message", request.getMessage());
        variables.put("eventType", request.getEventType().name());

        // Send email
        String templateName = request.getEventType().getTemplateName();
        boolean emailSent = emailService.sendEmail(
                request.getEmail(),
                request.getTitle(),
                templateName,
                variables);

        // Update status
        if (emailSent) {
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } else {
            notification.setStatus(NotificationStatus.FAILED);
        }

        notification = notificationRepository.save(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(notification));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get notification statistics", description = "Retrieve statistics about notification delivery")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        long total = notificationRepository.count();
        long sent = notificationRepository.findByStatus(NotificationStatus.SENT).size();
        long failed = notificationRepository.findByStatus(NotificationStatus.FAILED).size();
        long pending = notificationRepository.findByStatus(NotificationStatus.PENDING).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("sent", sent);
        stats.put("failed", failed);
        stats.put("pending", pending);
        stats.put("successRate", total > 0 ? (sent * 100.0 / total) : 0);

        return ResponseEntity.ok(stats);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .email(notification.getEmail())
                .eventType(notification.getEventType())
                .subject(notification.getSubject())
                .content(notification.getContent())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .sentAt(notification.getSentAt())
                .build();
    }
}
