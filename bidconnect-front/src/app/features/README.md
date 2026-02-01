# Features Module

Ce dossier contient les modules fonctionnels de l'application (pages et fonctionnalités métier).

## Structure

```
features/
├── auth/           # Authentification (Login, Register, Forgot Password)
├── dashboard/      # Tableau de bord
├── tenders/        # Gestion des appels d'offres
├── submissions/    # Gestion des soumissions
├── documents/      # Gestion des documents
├── notifications/  # Centre de notifications
└── profile/        # Profil utilisateur
```

## Conventions

- Chaque feature est un module lazy-loaded
- Utilisez des standalone components
- Chaque feature a son propre routing

## Exemples

```bash
# Générer une feature complète
ng g c features/auth/login --standalone
ng g c features/auth/register --standalone

# Générer une page de liste
ng g c features/tenders/tender-list --standalone

# Générer une page de détail
ng g c features/tenders/tender-detail --standalone
```

## Routing

Chaque feature doit avoir son fichier de routes :
- `auth.routes.ts`
- `tenders.routes.ts`
- `submissions.routes.ts`
