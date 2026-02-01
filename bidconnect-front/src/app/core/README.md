# Core Module

Ce dossier contient les services, guards, interceptors et modèles essentiels de l'application.

## Structure

```
core/
├── services/       # Services singleton (API, Auth, State Management)
├── guards/         # Route guards (AuthGuard, RoleGuard)
├── interceptors/   # HTTP interceptors (JWT, Error handling)
└── models/         # Interfaces et types TypeScript
```

## Conventions

- **Services** : Utilisez le suffixe `.service.ts`
- **Guards** : Utilisez le suffixe `.guard.ts`
- **Interceptors** : Utilisez le suffixe `.interceptor.ts`
- **Models** : Utilisez le suffixe `.model.ts` ou `.interface.ts`

## Exemples

```bash
# Générer un service
ng g s core/services/auth

# Générer un guard
ng g g core/guards/auth

# Générer un interceptor
ng g interceptor core/interceptors/jwt
```
