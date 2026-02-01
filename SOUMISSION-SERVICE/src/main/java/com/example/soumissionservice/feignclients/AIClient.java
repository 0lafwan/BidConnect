package com.example.soumissionservice.feignclients;


import com.example.soumissionservice.dto.ChatRequest;
import com.example.soumissionservice.dto.ChatResponse;
import com.example.soumissionservice.dto.IngestionRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "AI-SERVICE", url = "${services.ai.base-url}")
@Component
public interface AIClient {

    @PostMapping("/api/ai/chat")
    ChatResponse analyze(ChatRequest chatRequest);

    @PostMapping("/api/ai/ingest")
    void ingestFile( IngestionRequest ingestionRequest);
}
