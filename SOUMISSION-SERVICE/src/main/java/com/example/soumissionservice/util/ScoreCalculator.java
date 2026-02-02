package com.example.soumissionservice.util;

import com.example.soumissionservice.dto.EvaluationCriterionResponseDTO;
import com.example.soumissionservice.entity.Submission;
import org.springframework.http.ResponseEntity;

import java.util.List;


public class ScoreCalculator {


    public static Double calculate(Submission submission, List<EvaluationCriterionResponseDTO> criteria){

        Double score;
        Double priceweight=0.0;
        Double technicalweight=0.0;
        Double deliveryweight=0.0;

        for(EvaluationCriterionResponseDTO evaluationCriterionResponseDTO : criteria){
            switch(evaluationCriterionResponseDTO.getType()){
                case PRICE -> priceweight = (evaluationCriterionResponseDTO.getWeight()/100)* submission.getPrice();
                case TECHNICAL_QUALITY -> technicalweight= (evaluationCriterionResponseDTO.getWeight()/100)* submission.getTechnical();
                case DELIVERY_TIME ->  deliveryweight = (evaluationCriterionResponseDTO.getWeight()/100)* submission.getDeadline();
            }

        }
        score=priceweight+technicalweight+deliveryweight;
//        criteria.forEach(evaluationCriterion -> {
//            score= submission.getPrice()*evaluationCriterion.getWeight();
//        })

        return score;
    }
}
