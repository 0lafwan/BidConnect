# 🚀 BidConnect Frontend - Guide de Configuration

## ✅ Installation Complétée

Le projet Angular 17+ avec design Brutalisme Moderne a été initialisé avec succès !

## 📦 Packages Installés

- **Angular 21.1.2** (Standalone Components)
- **Tailwind CSS 3.x** (Design System Brutal)
- **GSAP** (Animations avancées)
- **Lenis** (Smooth Scroll)
- **Lucide Angular** (Icônes modernes)

## 🎨 Design System - Brutalisme Moderne

### Couleurs
```css
brutal-black: #050505    /* Background principal */
brutal-dark: #0F0F0F     /* Background secondaire */
brutal-white: #FFFFFF    /* Texte principal */
brutal-accent: #FF3333   /* Accent rouge */
brutal-neon: #00FF88     /* Accent néon vert */
```

### Typographie
- **Titres** : Space Grotesk (Google Fonts)
- **Texte** : Inter (Google Fonts)

### Composants Brutal
- `btn-brutal` : Bouton avec bordure épaisse et ombre décalée
- `card-brutal` : Carte avec effet hover brutal
- `input-brutal` : Input avec focus accent
- `badge-brutal` : Badge uppercase avec bordure

## 🏗️ Architecture des Dossiers

```
src/app/
├── core/                    # Services, Guards, Interceptors, Models
│   ├── services/           # Services singleton (API, Auth, Animation)
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── models/             # Interfaces TypeScript
│
├── shared/                  # Composants réutilisables
│   ├── components/         # UI Components (Button, Card, Modal)
│   ├── directives/         # Directives personnalisées
│   └── pipes/              # Pipes personnalisés
│
├── features/                # Modules fonctionnels (Lazy-loaded)
│   ├── auth/               # Authentification
│   ├── dashboard/          # Tableau de bord
│   ├── tenders/            # Appels d'offres
│   ├── submissions/        # Soumissions
│   └── profile/            # Profil utilisateur
│
└── layout/                  # Layouts (Header, Footer, Sidebar)
    ├── header/
    ├── footer/
    └── sidebar/
```

## 🚀 Commandes de Démarrage

### Développement
```bash
cd bidconnect-front
npm start
# ou
ng serve
```

L'application sera accessible sur : **http://localhost:4200**

### Build Production
```bash
npm run build
# ou
ng build --configuration production
```

### Tests
```bash
npm test
# ou
ng test
```

## 🎯 Prochaines Étapes

### 1. Créer les composants de layout

```bash
# Header
ng g c layout/header --standalone

# Footer
ng g c layout/footer --standalone

# Sidebar
ng g c layout/sidebar --standalone
```

### 2. Créer les composants UI Brutal

```bash
# Bouton brutal
ng g c shared/components/brutal-button --standalone

# Carte brutale
ng g c shared/components/brutal-card --standalone

# Input brutal
ng g c shared/components/brutal-input --standalone

# Modal brutal
ng g c shared/components/brutal-modal --standalone
```

### 3. Créer les features

```bash
# Auth
ng g c features/auth/login --standalone
ng g c features/auth/register --standalone

# Dashboard
ng g c features/dashboard/dashboard --standalone

# Tenders
ng g c features/tenders/tender-list --standalone
ng g c features/tenders/tender-detail --standalone
ng g c features/tenders/tender-create --standalone
```

### 4. Créer les services

```bash
# API Service
ng g s core/services/api

# Auth Service
ng g s core/services/auth

# Tender Service
ng g s core/services/tender

# Notification Service
ng g s core/services/notification
```

### 5. Créer les guards

```bash
# Auth Guard
ng g g core/guards/auth

# Role Guard
ng g g core/guards/role
```

## 🎨 Utilisation du Design System

### Exemple de bouton brutal

```html
<button class="btn-brutal">
  Soumettre
</button>

<button class="btn-brutal-accent">
  Publier l'appel d'offres
</button>

<button class="btn-brutal-neon">
  Analyser avec IA
</button>
```

### Exemple de carte brutale

```html
<div class="card-brutal">
  <h3 class="font-grotesk text-brutal-2xl mb-4">Titre</h3>
  <p class="text-brutal-base">Contenu de la carte</p>
</div>
```

### Exemple d'input brutal

```html
<input 
  type="text" 
  class="input-brutal" 
  placeholder="Rechercher un appel d'offres..."
/>
```

## 🎬 Utilisation des Animations

### Dans un composant

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { AnimationService } from '@core/services/animation.service';
import { SmoothScrollService } from '@core/services/smooth-scroll.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private animationService = inject(AnimationService);
  private smoothScrollService = inject(SmoothScrollService);

  ngOnInit() {
    // Initialiser smooth scroll
    this.smoothScrollService.init();

    // Animer les éléments
    this.animationService.brutalFadeIn('.hero-title', { delay: 0.2 });
    this.animationService.brutalSlide('.hero-subtitle', 'up', { delay: 0.4 });
    this.animationService.scrollReveal('.card-brutal');
  }
}
```

## 🔧 Configuration API Backend

Créer un fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8072/api', // Gateway Server
  services: {
    tender: 'http://localhost:8080',
    document: 'http://localhost:8081',
    submission: 'http://localhost:8084',
    ai: 'http://localhost:8085',
    notification: 'http://localhost:8086'
  }
};
```

## 📚 Documentation

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP](https://greensock.com/gsap/)
- [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
- [Lucide Icons](https://lucide.dev)

## 🎯 Checklist de Développement

- [ ] Créer les layouts (Header, Footer, Sidebar)
- [ ] Créer les composants UI Brutal (Button, Card, Input, Modal)
- [ ] Implémenter l'authentification (Login, Register)
- [ ] Créer les pages Tenders (List, Detail, Create)
- [ ] Créer les pages Submissions (List, Detail, Create)
- [ ] Intégrer les services API
- [ ] Ajouter les guards de sécurité
- [ ] Implémenter les notifications
- [ ] Ajouter le chatbot IA
- [ ] Tests unitaires et E2E

## 🚨 Notes Importantes

1. **Smooth Scroll** : Initialiser `SmoothScrollService` dans `app.component.ts`
2. **Animations** : Utiliser `AnimationService` pour toutes les animations GSAP
3. **Responsive** : Utiliser les breakpoints Tailwind (sm, md, lg, xl, 2xl)
4. **Accessibilité** : Toujours ajouter les attributs ARIA
5. **Performance** : Lazy-load les features avec `loadComponent`

---

**Bon développement ! 🚀**
