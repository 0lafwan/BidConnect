package com.example.tenderservice.mapper;

import com.example.tenderservice.config.ServiceUrlsConfig;
import com.example.tenderservice.dto.*;
import com.example.tenderservice.entity.TenderDocumentRef;
import org.mapstruct.*;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Mapper(componentModel = "spring")
public abstract class TenderDocumentRefMapper {

    @Autowired
    protected ServiceUrlsConfig serviceUrls;

    public TenderDocumentRef toEntity(TenderDocumentRefRequestDTO dto) {
        // default mapping
        return null;
    }

    @Mapping(
            target = "downloadUrl",
            expression = "java(serviceUrls.getDocumentServiceUrl() + \"/api/documents/\" + entity.getDocumentId() + \"/download\")"
    )
    public abstract TenderDocumentRefResponseDTO toResponseDTO(TenderDocumentRef entity);
}

