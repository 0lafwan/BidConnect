package com.example.soumissionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipient {
    private String userId; // Changed to String to match potential UUID/String IDs
    private String email;
    private UserRole role;
}
