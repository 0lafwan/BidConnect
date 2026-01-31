package com.example.notificationservice.dto;

import com.example.notificationservice.enums.EventType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {

    @NotNull
    private UUID eventId;

    @NotNull
    private EventType eventType;

    @NotNull
    private Instant timestamp;

    @NotEmpty
    @Valid
    private List<Recipient> recipients;

    @NotNull
    private Map<String, String> data;
}
