package com.example.tenderservice.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class ServiceUrlsConfig {

    @Value("${services.document.base-url}")
    private String documentServiceUrl;

    @Value("${services.ai.base-url}")
    private String aiServiceUrl;
}
