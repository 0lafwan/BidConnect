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

## 🎬 Scénario de Démo (Walkthrough)

> **Suivez ce guide pour découvrir l'expérience BidConnect complète en 5 minutes (Mode Mock activé)**

### 🎯 Introduction

Ce parcours vous permet de tester toutes les fonctionnalités clés de l'application sans backend actif. Les données sont simulées avec des délais réalistes pour une expérience authentique.

**Durée totale** : ~5 minutes  
**Mode** : Mock (Backend simulé)  
**URL de départ** : `http://localhost:4200`

---

### 📍 Étape 1 : L'Expérience Visuelle (Landing Page)

**Objectif** : Découvrir le design brutaliste et les animations GSAP

#### Actions à effectuer :
1. **Scroller doucement** vers le bas de la page
2. **Observer attentivement** :
   - 🎨 L'effet **Parallaxe** sur l'image du héros (défilement à vitesse différente)
   - 🔍 Le **Zoom lent** (effet Ken Burns) sur l'image de fond
   - 👻 Le **Header Ghost** qui devient flou et transparent au scroll
   - ✨ Les sections qui apparaissent avec un **Fade-in** progressif

3. **Interactions** :
   - Passer la souris sur les cartes de la grille "Services"
   - Observer l'effet **liquide/révélation** avec bordure néon
   - Tester les boutons CTA avec leur animation de hover

#### Ce qu'il faut remarquer :
- ✅ Smooth scroll fluide (Lenis)
- ✅ Animations synchronisées avec le scroll (GSAP ScrollTrigger)
- ✅ Design brutaliste cohérent (bordures épaisses, ombres décalées)
- ✅ Typographie Space Grotesk pour les titres

**Temps estimé** : 1 minute

---

### 👔 Étape 2 : Le Rôle OWNER (Administration)

**Objectif** : Gérer les appels d'offres en tant que propriétaire

#### Actions à effectuer :

1. **Connexion** :
   - Cliquer sur **"Connexion"** dans le header
   - Utiliser le bouton de test rapide **"MOCK OWNER"** (ou `owner@test.com` / `password`)
   - Observer l'animation de transition (1 seconde de délai simulé)

2. **Dashboard Owner** :
   - Observer l'**animation d'entrée** du tableau de bord (Stagger effect sur les cards)
   - Consulter les **statistiques** en haut (4 cards avec icônes)
   - Scroller pour voir les **Appels d'Offres Actifs** et les **Soumissions Reçues**

3. **Créer un Appel d'Offres** :
   - Cliquer sur le bouton **"+ CRÉER UN APPEL D'OFFRES"** (en haut à droite)
   - Remplir le formulaire modal :
     - **Titre** : "Construction Stade Municipal"
     - **Description** : "Construction d'un stade de 10,000 places"
     - **Budget** : 5000000 (5M€)
     - **Date limite** : Choisir une date future
   - Cliquer sur **"Publier"**
   - Observer le délai de simulation (800ms) et la notification de succès

4. **Gérer les Soumissions** :
   - Scroller vers la section **"Soumissions Reçues"**
   - Observer les différents statuts (En attente, Acceptée, Rejetée)
   - Voir les **scores d'évaluation** calculés automatiquement
   - Tester les actions : **Accepter** ou **Rejeter** une soumission

#### Ce qu'il faut remarquer :
- ✅ Interface tableau avec tri et filtres
- ✅ Badges de statut colorés (En cours, Urgent, Clôturé)
- ✅ Scores d'évaluation avec barres de progression
- ✅ Actions contextuelles (Voir, Modifier, Supprimer)
- ✅ Notifications de succès/erreur

**Temps estimé** : 2 minutes

---

### 🏗️ Étape 3 : Le Rôle SUPPLIER (Fournisseur)

**Objectif** : Soumettre une offre en tant que fournisseur

#### Actions à effectuer :

1. **Changement de Rôle** :
   - Cliquer sur l'icône utilisateur en haut à droite
   - Sélectionner **"Déconnexion"**
   - Retourner sur la page de connexion
   - Utiliser le bouton **"MOCK SUPPLIER"** (ou `supplier@test.com` / `password`)

2. **Dashboard Supplier** :
   - Observer le **changement de layout** (Grille de cartes vs Tableau)
   - Consulter les statistiques (Soumissions envoyées, En attente, Acceptées, Taux de succès)
   - Voir les **Appels d'Offres Disponibles** en format cards

3. **Soumettre une Offre** :
   - Trouver une carte avec le badge **"Urgent"** (rouge)
   - Cliquer sur le bouton **"SOUMETTRE UNE OFFRE"**
   - Remplir la modale de soumission :
     - **Montant proposé** : 450000 (450K€)
     - **Délai de réalisation** : 18 (mois)
     - **Description technique** : "Nous proposons une solution innovante..."
     - **Documents** : (Optionnel - simulation d'upload)
   - Cliquer sur **"Envoyer la Soumission"**
   - Observer la notification de succès et la fermeture de la modale

4. **Consulter Mes Soumissions** :
   - Scroller vers la section **"Mes Soumissions"**
   - Voir la nouvelle soumission avec le statut **"En attente"**
   - Observer les détails (montant, délai, score si évalué)

#### Ce qu'il faut remarquer :
- ✅ Layout différent adapté au rôle (cards vs tableau)
- ✅ Filtres par statut et date
- ✅ Badges visuels (Urgent, Nouveau, Clôture proche)
- ✅ Modale de soumission avec validation
- ✅ Feedback immédiat après action

**Temps estimé** : 1.5 minutes

---

### 🤖 Étape 4 : L'Assistant IA (La "Secret Sauce")

**Objectif** : Tester le chatbot RAG intelligent

#### Actions à effectuer :

1. **Ouvrir l'Assistant** :
   - Repérer le bouton flottant **Néon vert** en bas à droite (présent sur TOUTES les pages)
   - Observer l'animation **pulse** continue et le point rouge clignotant
   - Cliquer pour ouvrir la fenêtre de chat
   - Observer l'animation **scale-up** avec effet glassmorphism

2. **Poser des Questions Contextuelles** :

   **Question 1** : Taper `Parle-moi du projet de pont`
   - Observer l'état **"Analyse en cours..."** (3 points animés)
   - Voir l'indicateur **"En train d'écrire..."**
   - Observer la réponse qui s'affiche **mot par mot** (Effet Machine à écrire)
   - Lire les détails : 450m, béton précontraint, 24 mois, 15M€

   **Question 2** : Taper `Quel est le budget ?`
   - Observer le même effet typewriter
   - Voir la réponse détaillée : 15M€ avec répartition (Matériaux 60%, Main d'œuvre 25%, etc.)

   **Question 3** : Taper `Quels sont les critères d'évaluation ?`
   - Voir les 4 critères avec pondération :
     - Prix (40%)
     - Expérience Technique (30%)
     - Délai (20%)
     - Approche Environnementale (10%)

   **Question 4** : Taper `aide`
   - Recevoir le guide d'utilisation complet
   - Voir les exemples de questions suggérées

3. **Tester les Fonctionnalités** :
   - Scroller dans l'historique (auto-scroll actif)
   - Cliquer sur le bouton **↻ Reset** pour réinitialiser la conversation
   - Tester l'envoi avec la touche **Entrée**
   - Observer les timestamps sur chaque message

4. **Tester sur Différentes Pages** :
   - Retourner sur la Landing Page → Le bouton IA est toujours là
   - Aller sur le Dashboard Owner → Le bouton IA est présent
   - L'historique de conversation est **conservé** entre les pages

#### Ce qu'il faut remarquer :
- ✅ Effet machine à écrire réaliste (30ms/mot)
- ✅ Réponses intelligentes et contextuelles (7 types de réponses)
- ✅ Design glassmorphism avec bordure néon
- ✅ Disponibilité globale (toutes les pages)
- ✅ Historique persistant pendant la session
- ✅ Animations fluides (GSAP + CSS)
- ✅ Délai de simulation réaliste (2 secondes)

**Temps estimé** : 2 minutes

---

### 🎨 Étape 5 : Les Détails qui Font la Différence

**Objectif** : Observer les micro-interactions et le polish

#### Actions à effectuer :

1. **Header Dynamique** :
   - Scroller sur n'importe quelle page
   - Observer le header qui devient **transparent avec blur** (glassmorphism)
   - Voir l'icône utilisateur avec le rôle actuel

2. **Animations de Hover** :
   - Passer la souris sur les boutons → Légère élévation
   - Hover sur les cards → Bordure néon qui s'illumine
   - Hover sur les liens → Soulignement animé

3. **Responsive Design** :
   - Ouvrir les DevTools (F12)
   - Passer en mode mobile (iPhone 12)
   - Observer l'adaptation :
     - Menu hamburger sur mobile
     - Grilles qui deviennent verticales
     - Fenêtre IA en plein écran
     - Boutons et textes adaptés

4. **Notifications** :
   - Effectuer une action (créer un tender, soumettre une offre)
   - Observer la notification en haut à droite
   - Voir l'animation de slide-in et fade-out automatique

5. **Loading States** :
   - Observer les spinners pendant les actions
   - Voir les boutons désactivés pendant le traitement
   - Remarquer les messages de feedback

#### Ce qu'il faut remarquer :
- ✅ Cohérence du design sur toutes les pages
- ✅ Animations subtiles mais impactantes
- ✅ Feedback visuel constant
- ✅ Responsive parfait (mobile, tablette, desktop)
- ✅ Performance fluide (60fps)

**Temps estimé** : 1 minute

---

### 📊 Récapitulatif de la Démo

| Fonctionnalité | Testé | Temps |
|----------------|-------|-------|
| Landing Page + Animations | ✅ | 1 min |
| Dashboard Owner + CRUD | ✅ | 2 min |
| Dashboard Supplier + Soumission | ✅ | 1.5 min |
| Assistant IA RAG | ✅ | 2 min |
| Micro-interactions | ✅ | 1 min |
| **TOTAL** | **✅** | **~7.5 min** |

---

### 🔧 Note Technique Importante

**Mode Mock Activé** : Cette démo fonctionne **sans backend actif**. Toutes les données sont simulées côté frontend avec des délais réalistes :

- **Auth Service** : Délai de 1 seconde
- **Tender Service** : Délai de 800ms
- **Submission Service** : Délai de 1 seconde
- **AI Service** : Délai de 2 secondes (simulation RAG)

**Avantages du Mock** :
- ✅ Démo fluide et stable sans dépendances
- ✅ Pas besoin de Java/Python/Docker
- ✅ Réponses intelligentes pré-programmées
- ✅ Parfait pour présentation jury/client

**Activation du Backend Réel** :
Pour connecter au vrai backend, il suffit de changer un flag dans chaque service :
```typescript
// Exemple : ai.service.ts
private useMock = false; // Changer true → false
```

---

### 🎯 Points Forts à Mettre en Avant

1. **Design Brutaliste Moderne** 🎨
   - Bordures épaisses, ombres décalées, couleurs néon
   - Cohérence visuelle sur toute l'application
   - Typographie Space Grotesk distinctive

2. **Animations GSAP Avancées** ✨
   - Parallaxe, Ken Burns, Stagger effects
   - Smooth scroll avec Lenis
   - ScrollTrigger pour animations au scroll

3. **Assistant IA Intelligent** 🤖
   - Effet machine à écrire réaliste
   - Réponses contextuelles (7 types)
   - Disponible partout (bouton flottant)
   - Design glassmorphism élégant

4. **Architecture Scalable** 🏗️
   - Standalone Components (Angular 21)
   - Services avec dualité Mock/Real
   - Guards et Intercepteurs
   - Models typés TypeScript

5. **UX Soignée** 💎
   - Feedback constant (notifications, loading)
   - Responsive parfait (mobile/desktop)
   - Micro-interactions fluides
   - Performance optimale (60fps)

---

### 🐛 Troubleshooting

**Le serveur ne démarre pas** :
```bash
rm -rf node_modules .angular
npm install
npm start
```

**Les animations ne fonctionnent pas** :
→ Vérifier que GSAP et Lenis sont installés
```bash
npm install gsap lenis
```

**L'Assistant IA ne répond pas** :
→ Vérifier la console (F12) pour des erreurs
→ S'assurer que `useMock = true` dans `ai.service.ts`

**Problème de style** :
→ Vérifier que Tailwind compile correctement
```bash
npm run build
```

---

### 📚 Documentation Complète

Pour aller plus loin :
- 📖 [Guide d'Implémentation Complet](PROJECT-FINAL-COMPLETE.md)
- 🤖 [Documentation Assistant IA](AI-ASSISTANT-IMPLEMENTATION.md)
- 👔 [Guide Dashboard Owner](OWNER-DASHBOARD-IMPLEMENTATION.md)
- 🏗️ [Guide Dashboard Supplier](SUPPLIER-DASHBOARD-IMPLEMENTATION.md)
- 🔐 [Guide Authentification](AUTH-IMPLEMENTATION.md)

---

## 🎯 Roadmap

- [x] Configuration initiale (Angular 21, Tailwind, GSAP, Lenis)
- [x] Design System Brutalisme Moderne
- [x] Architecture des dossiers
- [x] Services d'animation et smooth scroll
- [x] Composants UI Brutal (Button, Card, Input, Modal)
- [x] Layouts (Header, Footer, Sidebar)
- [x] Pages d'authentification (Login avec Mock)
- [x] Dashboard Owner (CRUD Tenders + Submissions)
- [x] Dashboard Supplier (Soumissions)
- [x] Gestion des appels d'offres (CRUD complet)
- [x] Gestion des soumissions (Création, Évaluation)
- [x] Intégration chatbot IA (RAG avec effet typewriter)
- [x] Landing Page avec animations avancées
- [x] Services Mock intelligents
- [ ] Centre de notifications en temps réel
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
