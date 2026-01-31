package com.example.notificationservice.kafka;

import com.example.notificationservice.dto.NotificationEvent;
import com.example.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    /**
     * Consumes notification events from Kafka topic
     * Errors are logged but do not block the consumer
     */
    @KafkaListener(topics = "${spring.kafka.topic.notification-events}", groupId = "${spring.kafka.consumer.group-id}", containerFactory = "kafkaListenerContainerFactory")
    public void consumeNotificationEvent(
            @Payload NotificationEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received notification event from partition {} offset {}: eventId={}, eventType={}",
                    partition, offset, event.getEventId(), event.getEventType());

            notificationService.processNotificationEvent(event);

            log.info("Successfully processed notification event: {}", event.getEventId());

        } catch (Exception e) {
            log.error("Error processing notification event {}: {}", event.getEventId(), e.getMessage(), e);
            // Don't rethrow - we don't want to block Kafka consumer
            // Failed notifications are already marked as FAILED in the database
        }
    }
}
