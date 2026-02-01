# 🚀 Guide de Test Rapide - Authentification

## 🎯 Objectif
Tester le système d'authentification en mode MOCK (sans backend).

---

## 📋 Prérequis
- Serveur de développement lancé : `ng serve`
- Navigateur ouvert sur : http://localhost:4200

---

## 🧪 Scénarios de Test

### 1️⃣ Test Connexion ADMIN

**Étapes :**
1. Aller sur http://localhost:4200/login
2. Cliquer sur le bouton **"Admin"** (en bas du formulaire)
3. Le formulaire se remplit automatiquement :
   - Email : `admin@bidconnect.com`
   - Password : `password123`
4. Cliquer sur **"SE CONNECTER"**

**Résultat attendu :**
- ✅ Spinner de chargement pendant ~800ms
- ✅ Redirection vers `/admin`
- ✅ Dashboard ADMIN affiché
- ✅ Header affiche "John" + bouton "DÉCONNEXION" (rouge)
- ✅ Informations utilisateur affichées (email, rôle, ID)

---

### 2️⃣ Test Connexion OWNER

**Étapes :**
1. Si connecté, cliquer sur **"DÉCONNEXION"**
2. Cliquer sur le bouton **"Owner"**
3. Cliquer sur **"SE CONNECTER"**

**Résultat attendu :**
- ✅ Redirection vers `/owner`
- ✅ Dashboard OWNER affiché
- ✅ Statistiques différentes (Mes Appels d'offres, Soumissions reçues, etc.)

---

### 3️⃣ Test Connexion SUPPLIER

**Étapes :**
1. Se déconnecter
2. Cliquer sur le bouton **"Supplier"**
3. Cliquer sur **"SE CONNECTER"**

**Résultat attendu :**
- ✅ Redirection vers `/supplier`
- ✅ Dashboard SUPPLIER affiché
- ✅ Statistiques fournisseur (Appels d'offres disponibles, Mes Soumissions, etc.)

---

### 4️⃣ Test Validation du Formulaire

**Étapes :**
1. Aller sur `/login`
2. Cliquer directement sur **"SE CONNECTER"** (sans remplir)

**Résultat attendu :**
- ✅ Bordures rouges sur les champs vides
- ✅ Messages d'erreur :
  - "Ce champ est requis" sous Email
  - "Ce champ est requis" sous Password

**Étapes supplémentaires :**
3. Taper `test` dans Email
4. Taper `123` dans Password

**Résultat attendu :**
- ✅ "Email invalide" sous Email
- ✅ "Minimum 6 caractères" sous Password

---

### 5️⃣ Test Erreur de Connexion (Simulation)

**Note :** En mode MOCK, toutes les connexions réussissent. Pour tester les erreurs, il faut désactiver le mode MOCK et utiliser le vrai backend.

---

### 6️⃣ Test Protection des Routes

**Étapes :**
1. Se déconnecter (si connecté)
2. Taper manuellement dans l'URL : http://localhost:4200/admin

**Résultat attendu :**
- ✅ Redirection automatique vers `/login`
- ✅ Impossible d'accéder à `/admin` sans connexion

**Étapes supplémentaires :**
3. Se connecter en tant que **SUPPLIER**
4. Taper manuellement : http://localhost:4200/admin

**Résultat attendu :**
- ✅ Redirection vers `/supplier` (son propre dashboard)
- ✅ Impossible d'accéder au dashboard ADMIN avec un rôle SUPPLIER

---

### 7️⃣ Test Guest Guard

**Étapes :**
1. Se connecter (n'importe quel rôle)
2. Taper manuellement : http://localhost:4200/login

**Résultat attendu :**
- ✅ Redirection automatique vers le dashboard approprié
- ✅ Impossible d'accéder à `/login` quand déjà connecté

---

### 8️⃣ Test Déconnexion

**Étapes :**
1. Se connecter (n'importe quel rôle)
2. Cliquer sur **"DÉCONNEXION"** dans le header

**Résultat attendu :**
- ✅ Redirection vers `/login`
- ✅ Token supprimé du localStorage
- ✅ Header affiche "CONNEXION" au lieu de "DÉCONNEXION"

**Vérification localStorage :**
1. Ouvrir DevTools (F12)
2. Onglet **Application** → **Local Storage**
3. Vérifier que `bidconnect_token` et `bidconnect_user` sont supprimés

---

### 9️⃣ Test Animations GSAP

**Animations à observer :**

#### Entrée de la page
- ✅ Carte de login glisse vers le haut (30px) avec fade-in
- ✅ Texture de bruit oscille légèrement

#### Focus sur les inputs
- ✅ Input scale légèrement (1 → 1.01)
- ✅ Bordure devient blanche

#### Erreur de connexion
- ✅ Carte secoue horizontalement (shake effect)
- ✅ Message d'erreur rouge apparaît

#### Toggle mot de passe
- ✅ Icône change (œil ouvert ↔ œil barré)
- ✅ Type input change (password ↔ text)

---

### 🔟 Test Responsive Mobile

**Étapes :**
1. Ouvrir DevTools (F12)
2. Activer le mode responsive (Ctrl+Shift+M)
3. Sélectionner un appareil mobile (iPhone, Galaxy, etc.)

**Résultat attendu :**
- ✅ Carte de login s'adapte (padding réduit)
- ✅ Titre plus petit
- ✅ Options du formulaire en colonne
- ✅ Boutons de test MOCK en grille 3 colonnes

---

## 🎨 Vérifications Visuelles

### Design Brutaliste
- ✅ Fond noir profond (#050505)
- ✅ Texture de bruit visible (opacité ~5%)
- ✅ Carte flottante avec backdrop-blur
- ✅ Bordures fines grises (white/10)
- ✅ Inputs transparents avec bordure inférieure
- ✅ Bouton avec effet d'inversion (blanc → noir)

### Typographie
- ✅ Titre : Space Grotesk, Bold, Uppercase
- ✅ Labels : Inter, Uppercase, Tracking-widest
- ✅ Inputs : Inter, Regular

### Couleurs
- ✅ Texte blanc avec opacités variées
- ✅ Erreurs en rouge (#FF3333)
- ✅ Bouton déconnexion en rouge (brutal-accent)

---

## 🔍 Vérifications Techniques

### LocalStorage
Après connexion, vérifier dans DevTools :
```json
{
  "bidconnect_token": "mock-jwt-token-1738382400000",
  "bidconnect_user": {
    "id": "1",
    "email": "admin@bidconnect.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ADMIN"
  }
}
```

### Network (Mode Production)
Quand le backend sera connecté :
- ✅ Requête POST vers `/api/auth/login`
- ✅ Header `Authorization: Bearer <token>` sur les requêtes suivantes

### Console
- ✅ Aucune erreur dans la console
- ✅ Aucun warning Angular

---

## 🐛 Problèmes Connus

### Mode MOCK
- ⚠️ Toutes les connexions réussissent (pas de validation réelle)
- ⚠️ Token fictif (pas de vérification d'expiration)
- ⚠️ Données utilisateur statiques

### Solutions
- Désactiver le mode MOCK dans `auth.service.ts`
- Connecter au vrai backend User-Service

---

## 📊 Checklist Complète

### Fonctionnalités
- [x] Connexion ADMIN
- [x] Connexion OWNER
- [x] Connexion SUPPLIER
- [x] Validation formulaire
- [x] Protection des routes
- [x] Guest guard
- [x] Déconnexion
- [x] Redirection automatique
- [x] Stockage JWT
- [x] Intercepteur HTTP

### Design
- [x] Fond noir avec texture
- [x] Carte flottante
- [x] Inputs brutalistes
- [x] Bouton avec inversion
- [x] Responsive mobile
- [x] Animations GSAP

### Technique
- [x] Signals Angular
- [x] Functional Guards
- [x] Functional Interceptor
- [x] Lazy loading
- [x] TypeScript strict
- [x] Aucune erreur de compilation

---

## 🎉 Résultat Final

Si tous les tests passent :
✅ **Le système d'authentification est 100% fonctionnel !**

Vous pouvez maintenant :
1. Désactiver le mode MOCK
2. Connecter au backend User-Service
3. Implémenter les dashboards complets
4. Ajouter les fonctionnalités avancées (refresh token, etc.)

---

## 📞 Support

En cas de problème :
1. Vérifier la console du navigateur (F12)
2. Vérifier les logs du serveur Angular
3. Vérifier le localStorage
4. Relancer le serveur : `ng serve`

**Bon test ! 🚀**
