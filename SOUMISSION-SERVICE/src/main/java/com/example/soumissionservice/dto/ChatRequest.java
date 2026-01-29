package com.example.soumissionservice.dto;

/**
 * Request for RAG chat
 */
public record ChatRequest(
        String query,
        String conversationId // Optional: for maintaining chat history
) {
}
