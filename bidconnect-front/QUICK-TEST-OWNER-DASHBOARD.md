# 🧪 Test Rapide : Owner Dashboard

## 🎯 Objectif
Vérifier que le bug de la page noire est résolu et que le dashboard fonctionne correctement.

---

## 📋 Prérequis

1. **Serveur de développement lancé :**
   ```bash
   cd bidconnect-front
   npm start
   ```

2. **Navigateur ouvert :** http://localhost:4200

3. **Console ouverte :** F12 (pour voir les logs)

---

## ✅ Test 1 : Connexion et Affichage Initial

### Étapes
1. Aller sur http://localhost:4200
2. Cliquer sur "CONNEXION" dans le header
3. Se connecter avec :
   - Email : `owner@bidconnect.com`
   - Mot de passe : n'importe quoi (mode MOCK)
4. Observer la redirection vers `/owner`

### Résultat Attendu
- ✅ **Page visible immédiatement** (fond noir brutal)
- ✅ **Header du dashboard affiché** : "OWNER DASHBOARD" + "Bienvenue, John Doe"
- ✅ **Bouton "DÉCONNEXION"** visible en haut à droite
- ✅ **Pas de page noire**

### Logs Console Attendus
```
🔵 OwnerDashboard - ngOnInit called
🔵 Current user: { id: '1', email: 'owner@bidconnect.com', ... }
🔵 Loading tenders...
🔵 Owner ID: 1
🔵 OwnerDashboard - ngAfterViewInit called
🔵 Tenders container: ElementRef { nativeElement: div.dashboard-container }
✅ Container opacity set to 1 via gsap.set
```

---

## ✅ Test 2 : Chargement des Tenders (Mode MOCK)

### Étapes
1. Attendre 800ms (délai MOCK)
2. Observer l'affichage du tableau

### Résultat Attendu
- ✅ **Tableau des tenders affiché** avec 3 lignes :
  - "Construction du Nouveau Pont"
  - "Rénovation du Bâtiment Municipal"
  - "Fourniture de Matériel Informatique"
- ✅ **Animation FadeIn fluide** (lignes apparaissent avec stagger)
- ✅ **Colonnes visibles** : Titre, Date Limite, Statut, Critères, Actions

### Logs Console Attendus
```
✅ Tenders loaded: [{ id: 1, title: '...', ... }, ...]
🎬 Triggering animation...
🎬 animateTendersIn called
🔵 Found 3 tender rows to animate
✅ Container opacity forced to 1 before animation
✅ Tender rows animation completed
```

---

## ✅ Test 3 : Boutons d'Action

### Étapes
1. Cliquer sur le bouton "PUBLIER" (icône ✓) du premier tender (Brouillon)
2. Confirmer l'action
3. Observer le rechargement

### Résultat Attendu
- ✅ **Confirmation demandée** : "Voulez-vous publier cet appel d'offres ?"
- ✅ **Rechargement de la liste** après confirmation
- ✅ **Statut changé** : "Brouillon" → "Publié"

### Logs Console Attendus
```
🔵 Loading tenders...
✅ Tenders loaded: [...]
🎬 Triggering animation...
```

---

## ✅ Test 4 : Création d'un Tender

### Étapes
1. Cliquer sur "CRÉER UN APPEL D'OFFRES"
2. Observer le changement de vue

### Résultat Attendu
- ✅ **Formulaire affiché** avec :
  - Champ "TITRE"
  - Champ "DESCRIPTION" (textarea)
  - Champ "DATE LIMITE"
  - 3 critères par défaut (Prix 40%, Technique 35%, Délai 25%)
  - Zone d'upload de fichiers
- ✅ **Bouton "RETOUR À LA LISTE"** visible
- ✅ **Pas de page noire**

---

## ✅ Test 5 : Remplir le Formulaire

### Étapes
1. Remplir le formulaire :
   - Titre : "Test Tender"
   - Description : "Ceci est un test de création d'appel d'offres"
   - Date limite : 2026-03-01
2. Cliquer sur "CRÉER L'APPEL D'OFFRES"

### Résultat Attendu
- ✅ **Validation réussie** (pas d'erreur)
- ✅ **Retour à la vue liste** automatique
- ✅ **Nouveau tender affiché** dans le tableau
- ✅ **Statut "Brouillon"** par défaut

### Logs Console Attendus
```
Tender créé: { id: 4, title: 'Test Tender', ... }
🔵 Loading tenders...
✅ Tenders loaded: [...]
```

---

## ✅ Test 6 : Validation du Formulaire

### Étapes
1. Cliquer sur "CRÉER UN APPEL D'OFFRES"
2. Laisser tous les champs vides
3. Cliquer sur "CRÉER L'APPEL D'OFFRES"

### Résultat Attendu
- ✅ **Messages d'erreur affichés** :
  - "Ce champ est requis" sous Titre
  - "Ce champ est requis" sous Description
  - "Ce champ est requis" sous Date Limite
- ✅ **Bordures rouges** sur les champs invalides
- ✅ **Formulaire non soumis**

---

## ✅ Test 7 : Upload de Fichiers

### Étapes
1. Cliquer sur "CRÉER UN APPEL D'OFFRES"
2. Cliquer sur la zone d'upload
3. Sélectionner un fichier PDF

### Résultat Attendu
- ✅ **Fichier affiché** dans la liste des fichiers sélectionnés
- ✅ **Nom du fichier visible**
- ✅ **Bouton "X"** pour supprimer le fichier

---

## ✅ Test 8 : Navigation Header

### Étapes
1. Depuis le dashboard Owner, cliquer sur le logo "BIDCONNECT"

### Résultat Attendu
- ✅ **Pas de redirection** vers la landing page
- ✅ **Reste sur `/owner`** (comportement intelligent du logo)

---

## ✅ Test 9 : Déconnexion

### Étapes
1. Cliquer sur "DÉCONNEXION"

### Résultat Attendu
- ✅ **Redirection vers `/login`**
- ✅ **Token supprimé** du localStorage
- ✅ **Formulaire de login affiché**

---

## ❌ Tests de Régression (Ce qui NE doit PAS arriver)

### ❌ Page Noire
- **Symptôme :** Page totalement noire après connexion
- **Statut :** ✅ RÉSOLU

### ❌ Formulaire Disparaît
- **Symptôme :** Formulaire flash puis disparaît
- **Statut :** ✅ RÉSOLU (bug précédent sur login)

### ❌ Animation Bloquée
- **Symptôme :** Contenu reste invisible (opacity: 0)
- **Statut :** ✅ RÉSOLU (gsap.set + CSS !important)

### ❌ ViewChild Undefined
- **Symptôme :** Console error "Cannot read property 'nativeElement' of undefined"
- **Statut :** ✅ RÉSOLU (static: true + élément racine)

---

## 🐛 Si un Test Échoue

### Problème : Page Noire
1. Ouvrir la console (F12)
2. Chercher les logs :
   - ❌ Si "CRITICAL: Tenders container not found" → Problème ViewChild
   - ❌ Si pas de logs du tout → Problème de routing
3. Vérifier `app.routes.ts` : route `/owner` existe ?
4. Vérifier `owner-dashboard.html` : `#tendersContainer` sur `.dashboard-container` ?

### Problème : Animation Ne Fonctionne Pas
1. Vérifier les logs :
   - ⚠️ "No tender rows found" → Normal si liste vide
   - ❌ "Tenders container not found" → Problème ViewChild
2. Vérifier que GSAP est importé : `import gsap from 'gsap';`

### Problème : Données Ne Chargent Pas
1. Vérifier les logs :
   - ❌ "No owner ID found" → Problème AuthService
   - ❌ "Error loading tenders" → Problème TenderService
2. Vérifier `auth.service.ts` : `MOCK_MODE = true` ?
3. Vérifier `tender.service.ts` : `MOCK_MODE = true` ?

---

## 📊 Checklist Complète

- [ ] Test 1 : Connexion et affichage initial ✅
- [ ] Test 2 : Chargement des tenders ✅
- [ ] Test 3 : Boutons d'action ✅
- [ ] Test 4 : Création d'un tender ✅
- [ ] Test 5 : Remplir le formulaire ✅
- [ ] Test 6 : Validation du formulaire ✅
- [ ] Test 7 : Upload de fichiers ✅
- [ ] Test 8 : Navigation header ✅
- [ ] Test 9 : Déconnexion ✅

---

## ✅ Résultat Final

**Tous les tests passent** = Owner Dashboard fonctionnel ✅

**Date :** 2026-02-01  
**Version :** Angular 21.1.2  
**Build :** 27.98 kB (owner-dashboard)  
**Mode :** MOCK (Backend non requis)
