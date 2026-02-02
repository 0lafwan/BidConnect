package com.example.aiservice.config;

import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * LangChain4j Configuration
 * Defines beans for Chat Memory
 * Note: Embedding Model and Chat Model are auto-configured by Spring Boot
 * starters
 * Note: Qdrant configuration is in QdrantConfig
 */
@Configuration
public class LangChainConfig {

    /**
     * Chat Memory Provider for conversation isolation
     */
    @Bean
    public ChatMemoryProvider chatMemoryProvider() {
        return memoryId -> MessageWindowChatMemory.withMaxMessages(10);
    }
}
