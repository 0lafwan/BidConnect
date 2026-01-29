package com.example.soumissionservice.dto;

import com.example.soumissionservice.entity.enumeration.EvaluationCriterionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationCriterionResponseDTO {
    private Long id;
    private EvaluationCriterionType type;
    private Integer weight;
}
