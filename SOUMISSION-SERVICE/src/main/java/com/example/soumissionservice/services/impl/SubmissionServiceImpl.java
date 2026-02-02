package com.example.soumissionservice.services.impl;

import com.example.soumissionservice.dto.*;
import com.example.soumissionservice.entity.Submission;
import com.example.soumissionservice.entity.SubmissionStatus;
import com.example.soumissionservice.feignclients.*;
import com.example.soumissionservice.mapper.SubmissionMapper;
import com.example.soumissionservice.repository.SubmissionRepository;
import com.example.soumissionservice.services.EvaluationService;
import com.example.soumissionservice.services.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import com.example.soumissionservice.kafka.NotificationProducer;
import lombok.extern.slf4j.Slf4j;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository repo;
    private final TenderClient tenderClient;
    private final DocumentClient documentClient;
    private final AIClient aiClient;
    private final EvaluationService evaluationService;
    private final UserClient userClient;
    private final NotificationProducer notificationProducer;

    @Qualifier("submissionMapperImpl")
    private final SubmissionMapper subMapper;

    @Value("${services.document.base-url}")
    private String documentServiceUrl;

    // Ce que doit faire createSubmission maintenant (logique correcte)
    // Ordre logique :
    // vérifier le tender
    // uploader le document → récupérer documentId
    // créer la Submission
    // stocker documentId
    // sauvegarder
    // lancer l’analyse IA
    @Override
    public SubmissionResponse createSubmission(SubmissionRequest req) {

        // 1️⃣ Vérifie si l’appel d'offre est ouvert
        TenderResponse tender = tenderClient.getTender(req.tenderId());
        if (!"PUBLISHED".equals(tender.status())) {
            throw new RuntimeException("Tender is not open for submission");
        }

        // 2️⃣ Upload document → récupérer l’ID
        String documentId = documentClient.upload(req.document());

        // 3️⃣ Créer la submission
        Submission s = new Submission();
        s.setTenderId(req.tenderId());
        s.setSupplierId(req.supplierId());
        s.setDocumentId(documentId);
        s.setPrice(req.price());
        s.setTechnical(req.technical());
        s.setDeadline(req.deadline());
        s.setStatus(SubmissionStatus.SUBMITTED);
        s.setCreatedAt(LocalDateTime.now());

        repo.save(s);

        // 4️⃣ Analyse IA

        // aiClient.ingestFile(new IngestionRequest(s.getDocumentId(),
        // "http://localhost:8081/api/documents/" + s.getDocumentId() + "/download"));

        aiClient.ingestFile(new IngestionRequest(
                s.getDocumentId(),
                documentServiceUrl + "/api/documents/" + s.getDocumentId() + "/download"));

        ChatRequest chatrequest = new ChatRequest(
                "give me key point's in the submission with the supplierId: " + s.getSupplierId(),
                "null");

        ChatResponse chatResponse = aiClient.analyze(chatrequest);

        String ragResult = chatResponse.answer();
        s.setRagAnalysis(ragResult);

        // Calculate Score

        Double score = evaluationService.evaluateSubmission(s.getId());
        s.setScore(score);

        repo.save(s);

        // 5️⃣ Send Notification to Tender Owner
        try {
            //UserResponse owner = userClient.getUser(tender.ownerUserId());
            UserResponse owner = new UserResponse("1","ayoubaitbarka2003@gmail.com","Ayoub","ait barka",UserRole.OWNER);
            if (owner != null) {
                NotificationEvent event = NotificationEvent.builder()
                        .eventId(UUID.randomUUID())
                        .eventType(EventType.SUBMISSION_RECEIVED)
                        .timestamp(Instant.now())
                        .recipients(List.of(Recipient.builder()
                                .userId(owner.getId())
                                .email(owner.getEmail())
                                .role(UserRole.OWNER)
                                .build()))
                        .data(Map.of(
                                "title", "New Submission Received",
                                "message", "A new submission has been received for your tender.",
                                "tenderId", tender.id().toString(),
                                "supplierId", s.getSupplierId()))
                        .build();
                notificationProducer.sendNotificationEvent(event);
            }
        } catch (Exception e) {
            log.error("Failed to send submission received notification: {}", e.getMessage());
        }

        return subMapper.toResponse(s);
    }

    @Override
    public boolean deleteSubmission(String submissionId) {

        Submission s = repo.findById(submissionId).orElse(null);
        if (s == null)
            return false;

        // 🔹 Synchronisation document-Service
        if (s.getDocumentId() != null) {
            documentClient.delete(s.getDocumentId());
        }

        repo.delete(s);
        return true;
    }

    @Override
    public SubmissionResponse findSubmission(String id) {
        Submission s = repo.findById(id).orElse(null);
        return subMapper.toResponse(s);
    }

    @Override
    public List<SubmissionResponse> getAllSubmissions() {
        List<Submission> submissions = repo.findAll();
        List<SubmissionResponse> responses = new ArrayList<>();
        for (Submission s : submissions) {
            responses.add(subMapper.toResponse(s));
        }
        return responses;
    }

    @Override
    public List<SubmissionResponse> getByTender(String tenderId) {
        List<Submission> submissions = repo.findByTenderId(tenderId);
        List<SubmissionResponse> responses = new ArrayList<>();
        for (Submission s : submissions) {
            responses.add(subMapper.toResponse(s));
        }
        return responses;
    }

    @Override
    public List<SubmissionResponse> getBySupplier(String supplierId) {
        List<Submission> submissions = repo.findBySupplierId(supplierId);
        List<SubmissionResponse> responses = new ArrayList<>();
        for (Submission s : submissions) {
            responses.add(subMapper.toResponse(s));
        }
        return responses;
    }

    @Override
    public void updateStatus(String id, SubmissionStatus status) {

        Submission s = repo.findById(id).orElse(null);
        if (s == null)
            return;

        SubmissionStatus oldStatus = s.getStatus();
        s.setStatus(status);
        repo.save(s);

        // Send Notification to Supplier if status changed to ACCEPTED or REJECTED
        if ((status == SubmissionStatus.ACCEPTED || status == SubmissionStatus.REJECTED) && oldStatus != status) {
            try {
                //UserResponse supplier = userClient.getUser(s.getSupplierId());
                UserResponse supplier = new UserResponse("1","ayoubaitbarka2003@gmail.com","Ayoub","ait barka",UserRole.SUPPLIER);
                if (supplier != null) {
                    EventType eventType = (status == SubmissionStatus.ACCEPTED) ? EventType.SUBMISSION_ACCEPTED
                            : EventType.SUBMISSION_REJECTED;

                    NotificationEvent event = NotificationEvent.builder()
                            .eventId(UUID.randomUUID())
                            .eventType(eventType)
                            .timestamp(Instant.now())
                            .recipients(List.of(Recipient.builder()
                                    .userId(supplier.getId())
                                    .email(supplier.getEmail())
                                    .role(UserRole.SUPPLIER)
                                    .build()))
                            .data(Map.of(
                                    "title", "Submission " + status.name(),
                                    "message",
                                    "Your submission for tender " + s.getTenderId() + " has been "
                                            + status.name().toLowerCase() + ".",
                                    "tenderId", s.getTenderId(),
                                    "submissionId", s.getId()))
                            .build();
                    notificationProducer.sendNotificationEvent(event);
                }
            } catch (Exception e) {
                log.error("Failed to send submission status update notification: {}", e.getMessage());
            }
        }
    }

}
