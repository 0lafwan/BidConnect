package com.example.tenderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEvent {
    private UUID eventId;
    private EventType eventType;
    private Instant timestamp;
    private List<Recipient> recipients;
    private Map<String, String> data;
}
