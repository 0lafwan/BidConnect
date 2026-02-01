# Shared Module

Ce dossier contient les composants, directives et pipes réutilisables dans toute l'application.

## Structure

```
shared/
├── components/     # Composants UI réutilisables (Button, Card, Modal, etc.)
├── directives/     # Directives personnalisées
└── pipes/          # Pipes personnalisés
```

## Conventions

- **Components** : Standalone components avec le préfixe `app-`
- **Directives** : Utilisez le suffixe `.directive.ts`
- **Pipes** : Utilisez le suffixe `.pipe.ts`

## Exemples de composants Brutal

```bash
# Générer un bouton brutal
ng g c shared/components/brutal-button --standalone

# Générer une carte brutale
ng g c shared/components/brutal-card --standalone

# Générer un input brutal
ng g c shared/components/brutal-input --standalone
```

## Design System - Brutalisme Moderne

Tous les composants doivent suivre les principes du design brutaliste :
- Bordures épaisses (2px-4px)
- Ombres décalées (shadow-brutal)
- Couleurs contrastées (noir/blanc/accent)
- Typographie Space Grotesk pour les titres
- Animations GSAP pour les interactions
