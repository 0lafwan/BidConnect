package com.example.notificationservice.dto;

import com.example.notificationservice.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipient {

    @NotNull
    private String userId;

    @NotNull
    @Email
    private String email;

    @NotNull
    private UserRole role;
}
