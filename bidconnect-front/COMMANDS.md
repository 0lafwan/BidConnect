# 📋 Commandes d'Installation - BidConnect Frontend

## ✅ Commandes Exécutées

### 1. Création du projet Angular

```bash
ng new bidconnect-front --routing --style=css --standalone --skip-git
```

**Options choisies :**
- ❌ SSR (Server-Side Rendering) : Non
- ❌ AI Tools : None

### 2. Installation de Tailwind CSS

```bash
cd bidconnect-front
npm install -D tailwindcss postcss autoprefixer
```

### 3. Installation des librairies

```bash
# GSAP (Animations)
npm install gsap

# Lenis (Smooth Scroll) - Version mise à jour
npm install lenis

# Lucide Angular (Icônes)
npm install lucide-angular
```

## 📁 Fichiers de Configuration Créés

### 1. `tailwind.config.js`

Configuration complète du design system brutaliste :
- Couleurs personnalisées (brutal-black, brutal-accent, brutal-neon)
- Typographie (Space Grotesk, Inter)
- Ombres brutales (shadow-brutal, shadow-brutal-accent)
- Animations brutales (brutal-pulse, brutal-bounce, brutal-slide)
- Espacements personnalisés

### 2. `src/styles.css`

Styles globaux avec :
- Import de Tailwind (@tailwind base, components, utilities)
- Import des Google Fonts (Space Grotesk, Inter)
- Reset CSS et styles de base
- Composants réutilisables (btn-brutal, card-brutal, input-brutal)
- Utilities personnalisées (text-brutal-gradient, bg-brutal-grid)
- Configuration Lenis smooth scroll
- Styles d'accessibilité

### 3. Architecture des dossiers

```bash
src/app/
├── core/
│   ├── services/
│   ├── guards/
│   ├── interceptors/
│   └── models/
├── shared/
│   ├── components/
│   ├── directives/
│   └── pipes/
├── features/
└── layout/
    ├── header/
    ├── footer/
    └── sidebar/
```

### 4. Services créés

- `core/services/animation.service.ts` : Service GSAP pour animations brutales
- `core/services/smooth-scroll.service.ts` : Service Lenis pour smooth scroll

### 5. Documentation

- `README.md` : Documentation principale du frontend
- `SETUP.md` : Guide de configuration détaillé
- `COMMANDS.md` : Ce fichier (récapitulatif des commandes)

## 🚀 Commandes de Développement

### Démarrer le serveur de développement

```bash
npm start
# ou
ng serve
```

Accès : **http://localhost:4200**

### Build de production

```bash
npm run build
# ou
ng build --configuration production
```

### Tests

```bash
# Tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests E2E
npm run e2e
```

### Linting

```bash
# Vérifier le code
npm run lint

# Fix automatique
npm run lint:fix
```

## 🎨 Commandes de Génération

### Composants

```bash
# Composant standalone
ng g c features/auth/login --standalone

# Composant avec routing
ng g c features/dashboard/dashboard --standalone --route dashboard
```

### Services

```bash
# Service dans core
ng g s core/services/api

# Service dans feature
ng g s features/tenders/services/tender
```

### Guards

```bash
# Auth Guard
ng g g core/guards/auth

# Role Guard
ng g g core/guards/role
```

### Interceptors

```bash
# JWT Interceptor
ng g interceptor core/interceptors/jwt

# Error Interceptor
ng g interceptor core/interceptors/error
```

### Directives

```bash
# Directive personnalisée
ng g d shared/directives/brutal-hover
```

### Pipes

```bash
# Pipe personnalisé
ng g p shared/pipes/date-format
```

## 📦 Packages Installés

```json
{
  "dependencies": {
    "@angular/animations": "^21.1.2",
    "@angular/common": "^21.1.2",
    "@angular/compiler": "^21.1.2",
    "@angular/core": "^21.1.2",
    "@angular/forms": "^21.1.2",
    "@angular/platform-browser": "^21.1.2",
    "@angular/platform-browser-dynamic": "^21.1.2",
    "@angular/router": "^21.1.2",
    "gsap": "^3.x.x",
    "lenis": "^1.x.x",
    "lucide-angular": "^0.x.x",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^21.1.2",
    "@angular/cli": "^21.1.2",
    "@angular/compiler-cli": "^21.1.2",
    "autoprefixer": "^10.x.x",
    "postcss": "^8.x.x",
    "tailwindcss": "^3.x.x",
    "typescript": "~5.7.2"
  }
}
```

## 🎯 Prochaines Étapes

### 1. Créer les composants de base

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
# Button
ng g c shared/components/brutal-button --standalone

# Card
ng g c shared/components/brutal-card --standalone

# Input
ng g c shared/components/brutal-input --standalone

# Modal
ng g c shared/components/brutal-modal --standalone

# Badge
ng g c shared/components/brutal-badge --standalone
```

### 3. Créer les pages d'authentification

```bash
# Login
ng g c features/auth/login --standalone

# Register
ng g c features/auth/register --standalone

# Forgot Password
ng g c features/auth/forgot-password --standalone
```

### 4. Créer les pages principales

```bash
# Dashboard
ng g c features/dashboard/dashboard --standalone

# Tender List
ng g c features/tenders/tender-list --standalone

# Tender Detail
ng g c features/tenders/tender-detail --standalone

# Tender Create
ng g c features/tenders/tender-create --standalone

# Submission List
ng g c features/submissions/submission-list --standalone

# Submission Detail
ng g c features/submissions/submission-detail --standalone
```

### 5. Créer les services API

```bash
# API Service (base)
ng g s core/services/api

# Auth Service
ng g s core/services/auth

# Tender Service
ng g s core/services/tender

# Submission Service
ng g s core/services/submission

# Document Service
ng g s core/services/document

# Notification Service
ng g s core/services/notification

# AI Service
ng g s core/services/ai
```

### 6. Créer les guards

```bash
# Auth Guard
ng g g core/guards/auth

# Role Guard (ADMIN, OWNER, SUPPLIER)
ng g g core/guards/role
```

### 7. Créer les interceptors

```bash
# JWT Interceptor
ng g interceptor core/interceptors/jwt

# Error Interceptor
ng g interceptor core/interceptors/error

# Loading Interceptor
ng g interceptor core/interceptors/loading
```

## 🔧 Configuration Additionnelle

### Créer les fichiers d'environnement

```bash
# Créer le dossier environments
mkdir src/environments

# Créer environment.ts
touch src/environments/environment.ts

# Créer environment.prod.ts
touch src/environments/environment.prod.ts
```

**Contenu de `environment.ts` :**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8072/api',
  services: {
    tender: 'http://localhost:8080',
    document: 'http://localhost:8081',
    submission: 'http://localhost:8084',
    ai: 'http://localhost:8085',
    notification: 'http://localhost:8086'
  }
};
```

### Configurer les path aliases dans tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@layout/*": ["src/app/layout/*"],
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

## 📚 Ressources

- [Angular CLI Documentation](https://angular.dev/cli)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Lenis Documentation](https://lenis.darkroom.engineering/)
- [Lucide Icons](https://lucide.dev/icons/)

---

**Projet initialisé avec succès ! 🚀**
