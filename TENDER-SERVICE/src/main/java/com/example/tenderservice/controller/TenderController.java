package com.example.tenderservice.controller;

import com.example.tenderservice.constants.TenderConstants;
import com.example.tenderservice.dto.*;
import com.example.tenderservice.service.ITenderService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tenders")
@Validated
@RequiredArgsConstructor
@Tag(
        name = "Tender Management APIs",
        description = "REST APIs for creating, updating, publishing, closing, and retrieving tenders in BidConnect"
)
public class TenderController {

    private final ITenderService tenderService;
    private final TenderContactInfoDto tenderContactInfoDto;

    // ============================================================
    // CREATE -------------------------------------------------------
    // ============================================================
    @Operation(
            summary = "Create a new tender",
            description = "- Create a new tender by providing the necessary fields inside the request body : \n" +
                    "\n" +
                    "- Pour le champ id de tender il sera gérer coté bdd (auto increment)\n" +
                    "\n" +
                    "- Pour les champs : organisationId, ownerId il seront chargé coté frontend après l'authentification, ainsi des valeurs par defaut dans le formulaire de creation d'une offre \n" +
                    "\n" +
                    "- Pour le champ status il sera mis par defaut a DRAFT lors de la creation d'une offre\n"+
                    "\n" +
                    "- Pour le champ publicationDate il sera mis a la date courant lors de la publication de l'offre\n"+
                    "\n" +
                    "- Pour les champs de suivi (createdAt, createdBy, updatedAt, updatedBy) ils seront gérés automatiquement par Spring Data JPA (auditing)\n" +
                    "\n" +
                    "+ Pour le champ documents, il sera géré via l'upload de fichier :\n" +
                    "\n" +
                    " - Tender-service reçoit : json + fichier\n"+
                    "\n" +
                    " - Tender-service envoie les fichiers à : document-service (via Feign client)\n" +
                    "\n" +
                    " - Document-service :\n" +
                    "\n" +
                    "- Stocke dans MinIO\n" +
                    "\n" +
                    "- Retourne : documentId\n" +
                    "\n" +
                    "- Tender-service : stocke ces infos dans la bdd.\n"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = TenderConstants.STATUS_201,
                    description = TenderConstants.MESSAGE_201,
                    content = @Content(schema = @Schema(implementation = TenderResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = TenderConstants.STATUS_500,
                    description = TenderConstants.MESSAGE_500,
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            )
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TenderResponseDTO> createTender(
            @RequestPart("data") String data,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        TenderRequestDTO rawJson = mapper.readValue(data, TenderRequestDTO.class);

        TenderResponseDTO response = tenderService.createTender(rawJson, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // UPDATE -------------------------------------------------------
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<TenderResponseDTO> updateTender(
            @PathVariable Long id,
            @Valid @RequestBody TenderRequestDTO dto
    ) {
        return ResponseEntity.ok(tenderService.updateTender(id, dto));
    }

    // ============================================================
    // DELETE -------------------------------------------------------
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTender(@PathVariable Long id) {
        boolean result = tenderService.deleteTender(id);

        if (result) {
            return ResponseEntity.ok(TenderConstants.MESSAGE_200);
        }

        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                .body(TenderConstants.MESSAGE_417_DELETE);
    }

    // ============================================================
    // GET BY ID ----------------------------------------------------
    // ============================================================
    @GetMapping("/{id}")
    public ResponseEntity<TenderResponseDTO> getTenderById(@PathVariable Long id) {
        return ResponseEntity.ok(tenderService.getTenderById(id));
    }

    // ============================================================
    // GET ALL ------------------------------------------------------
    // ============================================================
    @GetMapping
    public ResponseEntity<List<TenderResponseDTO>> getAllTenders() {
        return ResponseEntity.ok(tenderService.getAllTenders());
    }

    // ============================================================
    // GET BY ORGANIZATION ------------------------------------------
    // ============================================================
    @GetMapping("/organization/{orgId}")
    public ResponseEntity<List<TenderResponseDTO>> getByOrganization(@PathVariable Long orgId) {
        return ResponseEntity.ok(tenderService.getTendersByOrganization(orgId));
    }

    // ============================================================
    // GET BY OWNER -------------------------------------------------
    // ============================================================
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<TenderResponseDTO>> getByOwner(@PathVariable String ownerId) {
        return ResponseEntity.ok(tenderService.getTendersByOwnerUser(ownerId));
    }

    // ============================================================
    // PUBLISH -------------------------------------------------------
    // ============================================================
    @PatchMapping("/{id}/publish")
    public ResponseEntity<TenderResponseDTO> publishTender(@PathVariable Long id) {
        return ResponseEntity.ok(tenderService.publishTender(id));
    }

    // ============================================================
    // CLOSE ---------------------------------------------------------
    // ============================================================
    @PatchMapping("/{id}/close")
    public ResponseEntity<TenderResponseDTO> closeTender(@PathVariable Long id) {
        return ResponseEntity.ok(tenderService.closeTender(id));
    }


    // ============================================================
// GET CRITERIA BY TENDER ID
// ============================================================
    @GetMapping("/{id}/criteria")
    public ResponseEntity<List<EvaluationCriterionResponseDTO>> getTenderCriteria(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(tenderService.getCriteriaByTenderId(id));
    }



    // ============================================================
    // CONFIG-SERVER TEST ENDPOINT ----------------------------------
    // ============================================================
    @Operation(
            summary = "Get Contact Info",
            description = "Contact Info details that can be reached out in case of any issues"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "HTTP Status OK"),
            @ApiResponse(
                    responseCode = "500",
                    description = "HTTP Status Internal Server Error",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            )
    })
    @GetMapping("/contact-info")
    public ResponseEntity<TenderContactInfoDto> getContactInfo() {
        return ResponseEntity.status(HttpStatus.OK).body(tenderContactInfoDto);
    }
}
