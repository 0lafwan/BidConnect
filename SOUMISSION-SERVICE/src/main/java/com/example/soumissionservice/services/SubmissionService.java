package com.example.soumissionservice.services;

import com.example.soumissionservice.dto.SubmissionRequest;
import com.example.soumissionservice.dto.SubmissionResponse;
import com.example.soumissionservice.entity.SubmissionStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SubmissionService {
    SubmissionResponse createSubmission(SubmissionRequest request);

    SubmissionResponse findSubmission(String id);

    List<SubmissionResponse> getAllSubmissions();

    List<SubmissionResponse> getByTender(String tenderId);

    List<SubmissionResponse> getBySupplier(String supplierId);

    void updateStatus(String id, SubmissionStatus status);

    boolean deleteSubmission(String submissionId);

}
