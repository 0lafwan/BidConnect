package com.example.tenderservice;

import com.example.tenderservice.dto.TenderContactInfoDto;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableFeignClients
@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "AuditAware")
@EnableConfigurationProperties(value = {TenderContactInfoDto.class})
public class TenderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TenderServiceApplication.class, args);
    }
}
