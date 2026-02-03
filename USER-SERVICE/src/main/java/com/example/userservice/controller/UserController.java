package com.example.userservice.controller;

import com.example.userservice.dto.UserResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            // En pratique ça n'arrive pas si SecurityConfig protège bien /api/users/me
            throw new RuntimeException("Unauthenticated");
        }

        // ✅ Identifiant Keycloak (claim "sub")
        String id = jwt.getSubject();

        // ✅ Email (souvent présent). Fallback vers preferred_username si besoin.
        String email = jwt.getClaimAsString("email");
        if (email == null || email.isBlank()) {
            email = jwt.getClaimAsString("preferred_username");
        }

        // ✅ Récupérer roles depuis realm_access.roles
        List<String> roles = extractRealmRoles(jwt);

        // ✅ Mapper vers vos rôles métier
        String role = mapToBusinessRole(roles);

        return new UserResponse(id, email, role);
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRealmRoles(Jwt jwt) {
        Object realmAccessObj = jwt.getClaim("realm_access");
        if (!(realmAccessObj instanceof Map)) {
            return List.of();
        }

        Map<String, Object> realmAccess = (Map<String, Object>) realmAccessObj;
        Object rolesObj = realmAccess.get("roles");
        if (!(rolesObj instanceof List)) {
            return List.of();
        }

        return (List<String>) rolesObj;
    }

    private String mapToBusinessRole(List<String> roles) {
        // Keycloak roles sont souvent en minuscule : admin/owner/supplier
        if (roles.contains("admin")) return "ADMIN";
        if (roles.contains("owner")) return "OWNER";
        if (roles.contains("supplier")) return "SUPPLIER";

        // Si vous utilisez des rôles en MAJUSCULES dans Keycloak, ça marche aussi :
        if (roles.contains("ADMIN")) return "ADMIN";
        if (roles.contains("OWNER")) return "OWNER";
        if (roles.contains("SUPPLIER")) return "SUPPLIER";

        return "UNKNOWN";
    }
}
