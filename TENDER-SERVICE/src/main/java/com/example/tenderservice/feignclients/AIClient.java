package com.example.tenderservice.feignclients;



import com.example.tenderservice.dto.IngestionRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "AI-SERVICE", url = "${services.ai.base-url}")
@Component
public interface AIClient {

    @PostMapping("/api/ai/ingest")
    void ingestFile( IngestionRequest ingestionRequest);
}
