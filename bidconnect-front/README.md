# 🎨 BidConnect Frontend - Brutalisme Moderne

Application Angular 17+ pour la plateforme de gestion des marchés publics BidConnect.

## 🚀 Technologies

- **Angular 21.1.2** (Standalone Components)
- **Tailwind CSS 3.x** (Design System Brutal)
- **GSAP** (Animations avancées)
- **Lenis** (Smooth Scroll)
- **Lucide Angular** (Icônes modernes)
- **TypeScript 5.x**

## 🎨 Design System - Brutalisme Moderne

### Principes de Design

Le design brutaliste moderne se caractérise par :
- **Bordures épaisses** (2px-4px) avec contraste élevé
- **Ombres décalées** (shadow-brutal) pour un effet 3D
- **Typographie audacieuse** (Space Grotesk pour les titres)
- **Couleurs contrastées** (noir profond / blanc pur / accents vifs)
- **Animations subtiles** mais impactantes (GSAP)
- **Grilles et structures visibles**

### Palette de Couleurs

```css
/* Backgrounds */
--brutal-black: #050505    /* Background principal */
--brutal-dark: #0F0F0F     /* Background secondaire */
--brutal-gray: #1A1A1A     /* Background tertiaire */

/* Texte */
--brutal-white: #FFFFFF    /* Texte principal */

/* Accents */
--brutal-accent: #FF3333   /* Rouge vif (CTA, erreurs) */
--brutal-neon: #00FF88     /* Vert néon (succès, IA) */

/* Bordures */
--brutal-border: #2A2A2A   /* Bordures subtiles */
```

### Typographie

- **Titres** : Space Grotesk (300, 400, 500, 600, 700)
- **Corps de texte** : Inter (300, 400, 500, 600, 700)

## 📁 Architecture

```
src/app/
├── core/                    # Services, Guards, Interceptors
│   ├── services/           # API, Auth, Animation, Smooth Scroll
│   ├── guards/             # Auth Guard, Role Guard
│   ├── interceptors/       # JWT, Error Handling
│   └── models/             # Interfaces TypeScript
│
├── shared/                  # Composants réutilisables
│   ├── components/         # Button, Card, Input, Modal, Badge
│   ├── directives/         # Directives personnalisées
│   └── pipes/              # Pipes personnalisés
│
├── features/                # Modules fonctionnels (Lazy-loaded)
│   ├── auth/               # Login, Register, Forgot Password
│   ├── dashboard/          # Tableau de bord
│   ├── tenders/            # Liste, Détail, Création d'appels d'offres
│   ├── submissions/        # Gestion des soumissions
│   ├── documents/          # Gestion des documents
│   ├── notifications/      # Centre de notifications
│   └── profile/            # Profil utilisateur
│
└── layout/                  # Layouts principaux
    ├── header/             # En-tête avec navigation
    ├── footer/             # Pied de page
    └── sidebar/            # Barre latérale
```

## 🚀 Installation

### Prérequis

- Node.js 18+ ou 20+
- npm 9+ ou yarn
- Angular CLI 17+

### Installation des dépendances

```bash
cd bidconnect-front
npm install
```

### Démarrage en développement

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur : **http://localhost:4200**

### Build de production

```bash
npm run build
# ou
ng build --configuration production
```

Les fichiers de build seront dans le dossier `dist/`.

## 🎯 Composants UI Brutal

### Boutons

```html
<!-- Bouton standard -->
<button class="btn-brutal">Soumettre</button>

<!-- Bouton accent (rouge) -->
<button class="btn-brutal-accent">Publier</button>

<!-- Bouton néon (vert) -->
<button class="btn-brutal-neon">Analyser avec IA</button>
```

### Cartes

```html
<div class="card-brutal">
  <h3 class="font-grotesk text-brutal-2xl mb-4">Titre</h3>
  <p class="text-brutal-base">Contenu de la carte</p>
</div>

<!-- Carte avec accent -->
<div class="card-brutal-accent">
  <h3>Appel d'offres urgent</h3>
</div>
```

### Inputs

```html
<input 
  type="text" 
  class="input-brutal" 
  placeholder="Rechercher..."
/>

<textarea 
  class="input-brutal" 
  rows="4"
  placeholder="Description..."
></textarea>
```

### Badges

```html
<span class="badge-brutal">En cours</span>
<span class="badge-brutal-accent">Urgent</span>
```

## 🎬 Animations

### Service d'Animation

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { AnimationService } from '@core/services/animation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private animationService = inject(AnimationService);

  ngOnInit() {
    // Fade in brutal
    this.animationService.brutalFadeIn('.hero-title', { delay: 0.2 });
    
    // Slide brutal
    this.animationService.brutalSlide('.hero-subtitle', 'up', { delay: 0.4 });
    
    // Scroll reveal
    this.animationService.scrollReveal('.card-brutal');
    
    // Hover brutal
    this.animationService.brutalHover('.btn-brutal');
  }
}
```

### Smooth Scroll

Le smooth scroll est automatiquement initialisé dans `app.component.ts`.

```typescript
// Scroll vers un élément
this.smoothScrollService.scrollTo('#section-id');

// Scroll vers le haut
this.smoothScrollService.scrollToTop();

// Stop/Start le scroll
this.smoothScrollService.stop();
this.smoothScrollService.start();
```

## 🔧 Configuration

### Environnements

Créer `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8072/api', // Gateway
  services: {
    tender: 'http://localhost:8080',
    document: 'http://localhost:8081',
    submission: 'http://localhost:8084',
    ai: 'http://localhost:8085',
    notification: 'http://localhost:8086'
  }
};
```

### Tailwind Configuration

Le fichier `tailwind.config.js` contient toutes les classes personnalisées :
- Couleurs brutales
- Typographie (Space Grotesk, Inter)
- Ombres brutales
- Animations brutales
- Espacements personnalisés

## 📚 Commandes Utiles

### Génération de composants

```bash
# Composant standalone
ng g c features/tenders/tender-list --standalone

# Service
ng g s core/services/tender

# Guard
ng g g core/guards/auth

# Interceptor
ng g interceptor core/interceptors/jwt

# Directive
ng g d shared/directives/brutal-hover

# Pipe
ng g p shared/pipes/date-format
```

### Tests

```bash
# Tests unitaires
npm test

# Tests E2E
npm run e2e

# Coverage
npm run test:coverage
```

### Linting

```bash
# Lint
npm run lint

# Fix automatique
npm run lint:fix
```

## 🌐 Intégration Backend

### Services API

Tous les services communiquent avec le backend via le Gateway Server (port 8072).

```typescript
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tenders`;

  getTenders() {
    return this.http.get(`${this.apiUrl}`);
  }

  getTenderById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createTender(tender: any) {
    return this.http.post(`${this.apiUrl}`, tender);
  }
}
```

## 🎯 Roadmap

- [x] Configuration initiale (Angular 17+, Tailwind, GSAP, Lenis)
- [x] Design System Brutalisme Moderne
- [x] Architecture des dossiers
- [x] Services d'animation et smooth scroll
- [ ] Composants UI Brutal (Button, Card, Input, Modal)
- [ ] Layouts (Header, Footer, Sidebar)
- [ ] Pages d'authentification (Login, Register)
- [ ] Dashboard
- [ ] Gestion des appels d'offres (CRUD)
- [ ] Gestion des soumissions
- [ ] Intégration chatbot IA
- [ ] Centre de notifications
- [ ] Profil utilisateur
- [ ] Tests unitaires et E2E

## 📖 Documentation

- [Guide de Configuration](SETUP.md)
- [Angular Documentation](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP](https://greensock.com/gsap/)
- [Lenis](https://lenis.darkroom.engineering/)

## 🤝 Contribution

1. Créer une branche feature : `git checkout -b feature/nom-feature`
2. Commit les changements : `git commit -m 'Add feature'`
3. Push vers la branche : `git push origin feature/nom-feature`
4. Ouvrir une Pull Request

## 📝 Licence

Ce projet fait partie de la plateforme BidConnect.

---

**Développé avec ❤️ et Brutalisme Moderne**
