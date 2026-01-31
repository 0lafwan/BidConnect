package com.example.notificationservice.service;

import com.example.notificationservice.dto.NotificationEvent;
import com.example.notificationservice.dto.Recipient;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.enums.NotificationStatus;
import com.example.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    /**
     * Processes a notification event by sending emails to all recipients
     * and persisting notification records in the database
     * 
     * @param event The notification event from Kafka
     */
    @Transactional
    public void processNotificationEvent(NotificationEvent event) {
        log.info("Processing notification event: {} with {} recipients",
                event.getEventId(), event.getRecipients().size());

        for (Recipient recipient : event.getRecipients()) {
            processRecipient(event, recipient);
        }
    }

    /**
     * Processes a single recipient independently
     * Failures for one recipient do not affect others
     */
    private void processRecipient(NotificationEvent event, Recipient recipient) {
        try {
            // Create notification record in database with PENDING status
            Notification notification = Notification.builder()
                    .userId(recipient.getUserId())
                    .email(recipient.getEmail())
                    .eventType(event.getEventType())
                    .subject(event.getData().getOrDefault("title", event.getEventType().getDefaultSubject()))
                    .content(event.getData().getOrDefault("message", ""))
                    .status(NotificationStatus.PENDING)
                    .build();

            notification = notificationRepository.save(notification);

            // Prepare template variables
            Map<String, Object> variables = new HashMap<>();
            variables.put("recipientName", recipient.getEmail().split("@")[0]); // Simple name extraction
            variables.put("title", event.getData().getOrDefault("title", ""));
            variables.put("message", event.getData().getOrDefault("message", ""));
            variables.put("eventType", event.getEventType().name());
            variables.putAll(event.getData()); // Add all data fields

            // Send email
            String templateName = event.getEventType().getTemplateName();
            boolean emailSent = emailService.sendEmail(
                    recipient.getEmail(),
                    notification.getSubject(),
                    templateName,
                    variables);

            // Update notification status
            if (emailSent) {
                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(LocalDateTime.now());
                log.info("Successfully sent notification {} to {}", notification.getId(), recipient.getEmail());
            } else {
                notification.setStatus(NotificationStatus.FAILED);
                log.warn("Failed to send notification {} to {}", notification.getId(), recipient.getEmail());
            }

            notificationRepository.save(notification);

        } catch (Exception e) {
            log.error("Error processing recipient {}: {}", recipient.getEmail(), e.getMessage(), e);
            // Don't rethrow - we want to continue processing other recipients
        }
    }
}
