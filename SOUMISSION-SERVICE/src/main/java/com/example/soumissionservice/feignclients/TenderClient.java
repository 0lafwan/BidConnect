package com.example.soumissionservice.feignclients;

import com.example.soumissionservice.dto.EvaluationCriterionResponseDTO;
import com.example.soumissionservice.dto.TenderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "tender-service", url = "${services.tender.base-url}")
@Component
public interface TenderClient {

    @GetMapping("/api/v1/tenders/{id}")
    TenderResponse getTender(@PathVariable("id") String id);

    @GetMapping("/api/v1/tenders/{id}/criteria")
    ResponseEntity<List<EvaluationCriterionResponseDTO>> getCriteria(@PathVariable("id") String id);

}
