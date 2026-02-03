package com.example.userservice.service;

import com.example.userservice.dto.UserResponse;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public UserResponse getById(String id) {
        User u = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return new UserResponse(u.getId(), u.getEmail(), u.getRole(), u.getFullName());
    }
}
