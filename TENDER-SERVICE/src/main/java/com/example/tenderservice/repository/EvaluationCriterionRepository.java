package com.example.tenderservice.repository;

import com.example.tenderservice.entity.EvaluationCriterion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationCriterionRepository extends JpaRepository<EvaluationCriterion, Long> {

    List<EvaluationCriterion> findByTenderId(Long tenderId);
}
