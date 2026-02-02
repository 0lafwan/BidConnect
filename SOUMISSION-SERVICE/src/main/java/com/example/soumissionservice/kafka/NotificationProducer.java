package com.example.soumissionservice.kafka;

import com.example.soumissionservice.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${spring.kafka.topic.notification-events}")
    private String topicName;

    public void sendNotificationEvent(NotificationEvent event) {
        log.info("Sending notification event: {} to topic: {}", event.getEventId(), topicName);
        try {
            kafkaTemplate.send(topicName, event);
            log.info("Successfully sent notification event: {}", event.getEventId());
        } catch (Exception e) {
            log.error("Failed to send notification event: {}. Error: {}", event.getEventId(), e.getMessage());
        }
    }
}
