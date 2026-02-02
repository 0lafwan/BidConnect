package com.example.aiservice.dto;

/**
 * Request for RAG chat
 */
public record ChatRequest(
                String query,
                String conversationId, // Optional: for maintaining chat history
                String userRole, // Optional: for persona selecting
                String contextId // Optional: for tender or submission context
) {
}
