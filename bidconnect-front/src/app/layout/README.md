# Layout Module

Ce dossier contient les composants de mise en page (header, footer, sidebar).

## Structure

```
layout/
├── header/         # En-tête de l'application
├── footer/         # Pied de page
└── sidebar/        # Barre latérale (navigation)
```

## Composants

### Header
- Logo BidConnect
- Navigation principale
- Menu utilisateur
- Notifications badge

### Footer
- Liens utiles
- Informations légales
- Réseaux sociaux

### Sidebar
- Navigation contextuelle
- Filtres (pour les listes)
- Actions rapides

## Exemples

```bash
# Générer le header
ng g c layout/header --standalone

# Générer le footer
ng g c layout/footer --standalone

# Générer la sidebar
ng g c layout/sidebar --standalone
```

## Design Brutal

Les layouts doivent respecter :
- Header fixe avec bordure inférieure brutale
- Footer avec séparateur brutal
- Sidebar avec ombre brutale
- Animations GSAP pour les transitions
