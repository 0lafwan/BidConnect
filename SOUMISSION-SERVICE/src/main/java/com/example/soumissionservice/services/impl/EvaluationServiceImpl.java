package com.example.soumissionservice.services.impl;

import com.example.soumissionservice.dto.EvaluationCriterionResponseDTO;
import com.example.soumissionservice.dto.SubmissionResponse;
import com.example.soumissionservice.entity.Submission;
import com.example.soumissionservice.entity.SubmissionStatus;
import com.example.soumissionservice.feignclients.TenderClient;
import com.example.soumissionservice.repository.SubmissionRepository;
import com.example.soumissionservice.services.EvaluationService;
import com.example.soumissionservice.util.ScoreCalculator;
import feign.Body;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final SubmissionRepository repo;
    private final TenderClient tenderClient;

    @Override
    public Double evaluateSubmission(String submissionId) {
        Submission sb = repo.findById(submissionId)
                .orElseThrow(() -> new NotFoundException("Submission not found"));

        ResponseEntity<List<EvaluationCriterionResponseDTO>> criteria = tenderClient.getCriteria(sb.getTenderId());

        Double score =ScoreCalculator.calculate(sb, criteria.getBody());
        return score;
    }
}

