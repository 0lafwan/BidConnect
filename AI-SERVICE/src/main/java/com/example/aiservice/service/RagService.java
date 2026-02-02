package com.example.aiservice.service;

import com.example.aiservice.dto.ChatRequest;
import com.example.aiservice.dto.ChatResponse;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service for RAG-based chat functionality
 * Retrieves relevant document chunks and generates contextual answers
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RagService {

    private final ChatLanguageModel chatModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;
    private final ChatMemoryProvider chatMemoryProvider;

    /**
     * Process a chat query using RAG
     */
    public ChatResponse chat(ChatRequest request) {
        log.info("Processing chat query: {} | Role: {} | contextId: {} | conversationId: {}",
                request.query(), request.userRole(), request.contextId(), request.conversationId());

        try {
            // 1. Create content retriever for RAG
            // Optimized: higher minScore and lower maxResults to avoid irrelevant context
            // for greetings
            ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                    .embeddingStore(embeddingStore)
                    .embeddingModel(embeddingModel)
                    .maxResults(3)
                    .minScore(0.6)
                    .build();

            // 2. Build AI Service with RAG
            Assistant assistant = AiServices.builder(Assistant.class)
                    .chatLanguageModel(chatModel)
                    .chatMemoryProvider(chatMemoryProvider)
                    .contentRetriever(retriever)
                    .build();

            // 3. Prepare query with context if available
            String query = request.query();
            if (request.contextId() != null) {
                query = "[Context ID: " + request.contextId() + "] " + query;
            }

            // 4. Resolve memory ID (consistent for the same conversation)
            String conversationId = request.conversationId() != null
                    ? request.conversationId()
                    : UUID.randomUUID().toString();

            // 5. Get answer using the appropriate persona
            String role = (request.userRole() != null) ? request.userRole().toUpperCase() : "";
            String answer = switch (role) {
                case "SUPPLIER" -> assistant.chatWithSupplier(conversationId, query);
                case "OWNER" -> assistant.chatWithOwner(conversationId, query);
                case "ADMIN" -> assistant.chatWithAdmin(conversationId, query);
                default -> assistant.chatDefault(conversationId, query);
            };

            log.info("Chat response generated successfully for role: {}", request.userRole());

            return new ChatResponse(answer, List.of(), conversationId);

        } catch (Exception e) {
            log.error("Chat processing failed", e);
            return new ChatResponse(
                    "Sorry, I encountered an error processing your question: " + e.getMessage(),
                    List.of(),
                    request.conversationId());
        }
    }

    /**
     * AI Assistant interface for LangChain4j
     * Separate methods with fixed SystemMessage avoid dynamic template compilation
     * issues
     */
    interface Assistant {
        @SystemMessage("You are an expert Bidding Consultant for BidConnect. " +
                "Your goal is to help suppliers understand tender requirements and optimize submissions. " +
                "IMPORTANT: If the user says 'hello' or asks 'who are you', introduce yourself as a Bidding Consultant. "
                +
                "Only use retrieved context if it directly relates to the user's specific question about a tender.")
        String chatWithSupplier(@MemoryId String memoryId, @UserMessage String userMessage);

        @SystemMessage("You are an expert Tender Evaluator for BidConnect. " +
                "Your goal is to help project owners evaluate submissions and ensure compliance. " +
                "IMPORTANT: If the user says 'hello' or asks 'who are you', introduce yourself as a Tender Evaluator. "
                +
                "Only use retrieved context if it directly relates to the user's specific question about an evaluation.")
        String chatWithOwner(@MemoryId String memoryId, @UserMessage String userMessage);

        @SystemMessage("You are a Platform Support Specialist for BidConnect. " +
                "Your goal is to help administrators manage the platform. " +
                "IMPORTANT: If the user says 'hello' or asks 'who are you', introduce yourself as Platform Support. " +
                "Only use retrieved context if it relates to technical or system questions.")
        String chatWithAdmin(@MemoryId String memoryId, @UserMessage String userMessage);

        @SystemMessage("You are a helpful assistant for the BidConnect platform. " +
                "If you don't know the user's specific role, be polite and offer general help.")
        String chatDefault(@MemoryId String memoryId, @UserMessage String userMessage);
    }
}
