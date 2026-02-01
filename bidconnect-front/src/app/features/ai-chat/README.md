# 🤖 AI Chat Component - Assistant IA Flottant

## Vue d'ensemble

Composant standalone Angular qui implémente un chatbot RAG (Retrieval-Augmented Generation) flottant, disponible sur toutes les pages de l'application.

---

## 📁 Structure

```
ai-chat/
├── ai-chat.component.ts      # Logique du composant
├── ai-chat.component.html    # Template
├── ai-chat.component.css     # Styles
└── README.md                 # Ce fichier
```

---

## 🎯 Fonctionnalités

### Interface Utilisateur
- ✅ Bouton flottant en bas à droite avec animation pulse
- ✅ Fenêtre de chat glassmorphism (420×600px)
- ✅ Header avec gradient néon et boutons (reset/close)
- ✅ Zone de messages avec scroll automatique
- ✅ Input avec support clavier (Entrée pour envoyer)

### Interactions
- ✅ Ouverture/fermeture avec animation GSAP
- ✅ Envoi de messages (bouton ou Entrée)
- ✅ Réception de réponses avec effet typewriter
- ✅ Historique de conversation persistant
- ✅ Réinitialisation de la conversation
- ✅ Indicateur de chargement animé

### Animations
- ✅ Pulse sur le bouton flottant
- ✅ Scale-up à l'ouverture (GSAP)
- ✅ Slide-in pour les messages
- ✅ Typewriter effect (30ms/mot)
- ✅ Bounce pour le loading (3 points)

---

## 🔧 Utilisation

### Import dans un composant
```typescript
import { AiChatComponent } from './features/ai-chat/ai-chat.component';

@Component({
  imports: [AiChatComponent],
  // ...
})
```

### Ajout dans le template
```html
<app-ai-chat></app-ai-chat>
```

**Note**: Le composant est déjà intégré dans `app.component.html` pour être disponible globalement.

---

## 📡 Service Backend

### Endpoint
```
POST http://localhost:8072/ai-service/api/ai/chat
```

### Request
```typescript
interface ChatRequest {
  query: string;           // Question de l'utilisateur
  conversationId?: string; // ID de conversation (optionnel)
}
```

### Response
```typescript
interface ChatResponse {
  answer: string;          // Réponse de l'IA
  sources: string[];       // Documents sources utilisés
  conversationId: string;  // ID de conversation
}
```

---

## 🎨 Design

### Couleurs
- **Bouton**: `bg-brutal-neon` (#00ff88)
- **Fenêtre**: `bg-brutal-dark/95` (#0a0a0a avec 95% opacité)
- **Messages user**: `bg-brutal-neon` (vert néon)
- **Messages assistant**: `bg-white/10` (glassmorphism)
- **Bordures**: `border-brutal-neon` (4px)

### Dimensions
- **Bouton**: Auto × 56px
- **Fenêtre**: 420px × 600px
- **Mobile**: 100vw-2rem × 100vh-2rem

---

## 🧩 Composants Internes

### ChatMessage Interface
```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}
```

### Signals
```typescript
isOpen = signal(false);              // État ouvert/fermé
messages = signal<ChatMessage[]>([]); // Historique
userInput = signal('');              // Input utilisateur
isLoading = signal(false);           // État de chargement
```

---

## 🎬 Animations

### Ouverture de la fenêtre
```typescript
gsap.fromTo(chatWindow,
  { scale: 0.8, opacity: 0, y: 20 },
  { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
);
```

### Effet Typewriter
```typescript
typewriterEffect(text: string, messageIndex: number): void {
  // Affiche les mots un par un avec intervalle de 30ms
  // Scroll automatique pendant la frappe
  // Indicateur "En train d'écrire..." actif
}
```

---

## 🔄 Mode Mock

### Activation
```typescript
// ai.service.ts
private useMock = true; // Mode mock actif par défaut
```

### Réponses Intelligentes
Le mock détecte les mots-clés et retourne des réponses contextuelles :

| Mots-clés | Réponse |
|-----------|---------|
| pont, bridge | Détails du projet de pont (450m, 24 mois) |
| budget, prix, coût | Budget 15M€ avec répartition |
| délai, durée, temps | Planning détaillé (24 mois) |
| critère, évaluation | 4 critères avec pondération |
| document, fichier | Liste des documents disponibles |
| aide, help | Guide d'utilisation |
| Autres | Réponse générique d'assistance |

### Délai de Simulation
```typescript
return of(response).pipe(delay(2000)); // 2 secondes
```

---

## 🚀 Activation du Backend Réel

### Étape 1: Désactiver le mock
```typescript
// core/services/ai.service.ts
private useMock = false; // Ligne 21
```

### Étape 2: Vérifier l'URL
```typescript
private apiUrl = 'http://localhost:8072/ai-service/api/ai';
```

### Étape 3: Lancer les services
```bash
# Backend
cd AI-SERVICE
./mvnw spring-boot:run

# Gateway
cd gatewayserver
./mvnw spring-boot:run

# Qdrant (Vector DB)
docker run -p 6333:6333 qdrant/qdrant
```

### Étape 4: Ingérer des documents
```bash
POST http://localhost:8072/ai-service/api/ai/ingest
{
  "documentUrl": "https://example.com/tender-doc.pdf",
  "metadata": {
    "tenderId": "tender-001",
    "type": "technical-specs"
  }
}
```

---

## 🧪 Tests

### Test Manuel
```bash
cd bidconnect-front
npm start
```

1. Ouvrir `http://localhost:4200`
2. Vérifier le bouton flottant en bas à droite
3. Cliquer pour ouvrir
4. Taper: "Parle-moi du projet de pont"
5. Observer l'effet typewriter
6. Vérifier l'historique
7. Tester le reset

### Test Automatisé (TODO)
```typescript
describe('AiChatComponent', () => {
  it('should open chat window on button click', () => {
    // Test implementation
  });
  
  it('should send message on Enter key', () => {
    // Test implementation
  });
  
  it('should display typewriter effect', () => {
    // Test implementation
  });
});
```

---

## 📱 Responsive

### Desktop (≥1024px)
- Fenêtre: 420px × 600px
- Position: bottom-6 right-6

### Tablet (768px - 1023px)
- Fenêtre: 400px × 550px
- Position: bottom-4 right-4

### Mobile (<768px)
- Fenêtre: calc(100vw - 2rem) × calc(100vh - 2rem)
- Position: bottom-1rem right-1rem
- Plein écran avec marges

---

## 🔒 Sécurité

### Authorization
```typescript
// Automatique via auth.interceptor.ts
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Sanitization
```typescript
// Angular sanitize automatiquement les inputs
// Pas besoin de sanitization manuelle
```

### Rate Limiting
```typescript
// TODO: Implémenter côté backend
// Limiter à X requêtes par minute
```

---

## 🐛 Debugging

### Console Logs
```typescript
// Activer les logs détaillés
console.log('AI Service Error:', error);
console.log('Message sent:', message);
console.log('Response received:', response);
```

### Problèmes Courants

**Le bouton n'apparaît pas**
→ Vérifier que le composant est importé dans `app.ts`

**Pas d'effet typewriter**
→ Vérifier la méthode `typewriterEffect()` et l'intervalle

**Réponses instantanées**
→ Vérifier le délai de 2000ms dans le mock

**Scroll ne fonctionne pas**
→ Vérifier `.messages-container` avec `overflow-y-auto`

---

## 📊 Performance

### Optimisations
- ✅ Signals pour réactivité fine-grained
- ✅ OnPush change detection (implicite avec signals)
- ✅ Lazy rendering des messages
- ✅ Debounce sur l'input (TODO)
- ✅ Virtual scrolling pour longs historiques (TODO)

### Métriques
- Temps de réponse mock: 2000ms
- Temps de réponse réel: ~500-2000ms (selon backend)
- Typewriter speed: 30ms/mot
- Animation duration: 300ms

---

## 🎓 Apprentissages

### Angular Signals
```typescript
// Réactivité moderne sans RxJS
const isOpen = signal(false);
isOpen.set(true);
const value = isOpen();
```

### GSAP Animations
```typescript
// Animations fluides et performantes
gsap.fromTo(element, from, to);
```

### Typewriter Effect
```typescript
// Affichage progressif du texte
setInterval(() => {
  // Ajouter un mot à la fois
}, 30);
```

---

## 🔮 Améliorations Futures

### Phase 2
- [ ] Historique persistant (localStorage)
- [ ] Export de conversation (PDF)
- [ ] Suggestions de questions
- [ ] Citations des sources avec liens
- [ ] Feedback sur les réponses (👍/👎)

### Phase 3
- [ ] Voice input (Web Speech API)
- [ ] Multi-langues (i18n)
- [ ] Thèmes personnalisables
- [ ] Raccourcis clavier (Ctrl+K)
- [ ] Mode plein écran

### Phase 4
- [ ] Streaming de réponses (SSE)
- [ ] Markdown avancé (code blocks, tables)
- [ ] Pièces jointes (images, PDFs)
- [ ] Chatbot proactif (notifications)
- [ ] Analytics (questions fréquentes)

---

## 📚 Ressources

### Documentation
- [Angular Signals](https://angular.dev/guide/signals)
- [GSAP](https://greensock.com/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [LangChain](https://js.langchain.com/docs/)

### Guides Projet
- `AI-ASSISTANT-IMPLEMENTATION.md` - Implémentation complète
- `QUICK-TEST-AI-ASSISTANT.md` - Guide de test rapide
- `PROJECT-FINAL-COMPLETE.md` - Vue d'ensemble du projet

---

## 👥 Contribution

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Naming conventions Angular
- Comments en français

### Git Workflow
```bash
git checkout -b feature/ai-chat-improvement
# Faire les modifications
git commit -m "feat(ai-chat): add voice input support"
git push origin feature/ai-chat-improvement
```

---

## 📄 License

MIT License - BidConnect Project

---

*AI Chat Component - BidConnect Frontend* 🤖✨
