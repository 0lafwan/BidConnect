# 🔐 Implémentation de l'Authentification - BidConnect

## ✅ Statut : COMPLET

L'authentification complète avec le style **Brutalisme Sombre** a été implémentée avec succès.

---

## 📁 Fichiers Créés

### 🔑 Core - Services & Guards

#### `core/services/auth.service.ts`
- **Gestion complète de l'authentification** avec Signals Angular
- **Mode MOCK activé** pour tester l'UI sans backend
- Méthodes principales :
  - `login(credentials)` : Connexion utilisateur
  - `logout()` : Déconnexion
  - `isAuthenticated()` : Vérification de l'état
  - `hasRole()` / `hasAnyRole()` : Vérification des rôles
- **Stockage JWT** dans localStorage
- **Redirection automatique** selon le rôle (ADMIN/OWNER/SUPPLIER)
- **Gestion des erreurs HTTP** avec messages personnalisés

#### `core/guards/auth.guard.ts`
- **authGuard** : Protège les routes authentifiées
- **guestGuard** : Redirige les utilisateurs déjà connectés
- Vérification des rôles requis par route
- Redirection intelligente selon le rôle

#### `core/interceptors/auth.interceptor.ts`
- **Intercepteur HTTP fonctionnel** (Angular 17+)
- Ajoute automatiquement le header `Authorization: Bearer <token>`
- Compatible avec toutes les requêtes HTTP

#### `core/models/user.model.ts`
- Types TypeScript pour l'authentification :
  - `User` : Modèle utilisateur
  - `UserRole` : 'ADMIN' | 'OWNER' | 'SUPPLIER'
  - `LoginCredentials` : Email + Password
  - `LoginResponse` : Token + User
  - `DecodedToken` : Payload JWT

---

### 🎨 Features - Login Component

#### `features/auth/login/login.ts`
- **Composant standalone** avec Signals
- **Formulaire réactif** (ReactiveFormsModule)
- **Validation en temps réel** avec messages d'erreur
- **Animations GSAP** :
  - Entrée de la carte (slide up + fade in)
  - Texture de bruit animée
  - Secousse en cas d'erreur
  - Scale sur focus des inputs
- **Toggle mot de passe** (afficher/masquer)
- **Boutons de test MOCK** pour remplir rapidement le formulaire

#### `features/auth/login/login.html`
- **Design Brutaliste Sombre** :
  - Fond noir avec texture de bruit
  - Carte flottante avec backdrop-blur
  - Inputs transparents avec bordure inférieure
  - Bouton brutal avec effet d'inversion
- **Accessibilité** :
  - Labels ARIA
  - Autocomplete
  - Messages d'erreur clairs
- **Responsive** : Mobile-first design

#### `features/auth/login/login.css`
- **Style complet** avec Tailwind CSS
- **Animations CSS** :
  - Spinner de chargement
  - Transitions fluides
  - Hover effects
- **Responsive breakpoints**
- **Mode MOCK** : Boutons de test stylisés

---

### 📊 Features - Dashboards (Placeholders)

#### `features/dashboards/admin/admin-dashboard.ts`
- Dashboard temporaire pour tester la redirection ADMIN
- Affiche les informations utilisateur
- Bouton de déconnexion

#### `features/dashboards/owner/owner-dashboard.ts`
- Dashboard temporaire pour tester la redirection OWNER
- Statistiques fictives
- Interface cohérente avec le design brutal

#### `features/dashboards/supplier/supplier-dashboard.ts`
- Dashboard temporaire pour tester la redirection SUPPLIER
- Cartes de statistiques
- Style uniforme

---

## 🔧 Configuration

### `app.config.ts`
```typescript
providers: [
  provideHttpClient(
    withInterceptors([authInterceptor])
  )
]
```
- **HttpClient** configuré avec l'intercepteur d'authentification

### `app.routes.ts`
```typescript
{
  path: 'login',
  canActivate: [guestGuard]
},
{
  path: 'admin',
  canActivate: [authGuard],
  data: { roles: ['ADMIN'] }
}
```
- **Routes protégées** avec guards
- **Lazy loading** de tous les composants
- **Redirection automatique** selon l'état d'authentification

### `layout/header/header.ts` (Mis à jour)
- **Intégration AuthService**
- Affichage conditionnel :
  - Bouton "Connexion" si non connecté
  - Nom + Bouton "Déconnexion" si connecté
- **Bouton de déconnexion** avec style brutal-accent

---

## 🎯 Fonctionnalités

### ✅ Mode MOCK (Activé par défaut)
Pour tester l'UI sans backend :

1. **Boutons de test rapide** :
   - Cliquer sur "Admin" → Remplit `admin@bidconnect.com`
   - Cliquer sur "Owner" → Remplit `owner@bidconnect.com`
   - Cliquer sur "Supplier" → Remplit `supplier@bidconnect.com`

2. **Mot de passe** : N'importe quel mot de passe (min 6 caractères)

3. **Redirection automatique** :
   - Admin → `/admin`
   - Owner → `/owner`
   - Supplier → `/supplier`

### 🔄 Désactiver le Mode MOCK
Dans `auth.service.ts`, ligne 20 :
```typescript
private readonly MOCK_MODE = false; // Passer à false
```

Puis configurer l'URL du backend :
```typescript
private readonly API_URL = 'http://localhost:8072/api/auth';
```

---

## 🎨 Design Brutaliste

### Palette de Couleurs
- **Fond** : `#050505` (brutal-black)
- **Carte** : `bg-black/50` + `backdrop-blur-xl`
- **Bordures** : `border-white/10`
- **Texte** : Blanc avec opacités variées
- **Accent** : `#FF3333` (brutal-accent)
- **Neon** : `#00FF88` (brutal-neon)

### Typographie
- **Titres** : Space Grotesk, Bold, Uppercase
- **Corps** : Inter, Regular
- **Tracking** : Très large (widest)

### Animations GSAP
1. **Entrée de la carte** : `y: 30, opacity: 0 → 0, 1`
2. **Texture de bruit** : Opacité oscillante
3. **Focus inputs** : Scale 1 → 1.01
4. **Erreur** : Secousse horizontale (shake)

---

## 🧪 Tests

### Scénarios de Test

#### 1. Connexion Réussie (MOCK)
```
Email: admin@bidconnect.com
Password: password123
Résultat: Redirection vers /admin
```

#### 2. Validation du Formulaire
- Email vide → "Ce champ est requis"
- Email invalide → "Email invalide"
- Password < 6 caractères → "Minimum 6 caractères"

#### 3. Navigation Protégée
- Accéder à `/admin` sans connexion → Redirection vers `/login`
- Accéder à `/login` déjà connecté → Redirection vers dashboard

#### 4. Déconnexion
- Cliquer sur "Déconnexion" → Retour à `/login`
- Token supprimé du localStorage

---

## 🚀 Commandes

### Développement
```bash
cd bidconnect-front
ng serve
```
Ouvrir : http://localhost:4200/login

### Build Production
```bash
ng build
```

### Tests
```bash
ng test
```

---

## 📦 Dépendances Utilisées

- **@angular/common/http** : HttpClient + Interceptors
- **@angular/forms** : ReactiveFormsModule
- **@angular/router** : Guards + Navigation
- **gsap** : Animations
- **rxjs** : Observables + Signals

---

## 🔜 Prochaines Étapes

### Backend Integration
1. Désactiver le mode MOCK
2. Configurer l'URL du User-Service
3. Tester avec le vrai backend
4. Gérer le refresh token

### Fonctionnalités Supplémentaires
- [ ] Page "Mot de passe oublié"
- [ ] Page "Inscription"
- [ ] Persistance "Se souvenir de moi"
- [ ] Gestion de l'expiration du token
- [ ] Refresh token automatique

### Dashboards Complets
- [ ] Admin Dashboard (gestion utilisateurs)
- [ ] Owner Dashboard (gestion appels d'offres)
- [ ] Supplier Dashboard (soumissions)

---

## 📸 Captures d'Écran

### Page de Connexion
- Fond noir avec texture de bruit
- Carte flottante centrée
- Inputs minimalistes avec bordure inférieure
- Bouton brutal avec effet d'inversion
- Boutons de test MOCK en bas

### Header (Connecté)
- Logo avec mix-blend-mode
- Navigation centrale
- Nom utilisateur + Bouton déconnexion (rouge)

### Dashboards
- Fond noir uniforme
- Cartes de statistiques
- Informations utilisateur
- Bouton de déconnexion

---

## 🎉 Résultat

✅ **Authentification complète** avec JWT  
✅ **Guards & Interceptors** fonctionnels  
✅ **Design Brutalisme Sombre** respecté  
✅ **Animations GSAP** fluides  
✅ **Mode MOCK** pour tester sans backend  
✅ **Redirection automatique** par rôle  
✅ **Build réussi** : 440.77 kB (123.70 kB gzipped)  
✅ **Serveur de dev** : http://localhost:4200  

**Le système d'authentification est prêt à être utilisé !** 🚀
