package com.example.soumissionservice.feignclients;


import com.example.soumissionservice.dto.ChatRequest;
import com.example.soumissionservice.dto.ChatResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "AI-SERVICE", url = "http://localhost:8085")
@Component
public interface AIClient {

    ChatResponse analyze(ChatRequest chatRequest);


}
