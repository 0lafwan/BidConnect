import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

export interface ChatRequest {
  query: string;
  conversationId?: string;
  userRole?: string;
  contextId?: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  conversationId: string;
}

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = '/bindconnect/ai-service/api/ai';

  // Mock mode flag - set to false when backend is ready
  private useMock = false;

  sendMessage(userMessage: string, conversationId?: string): Observable<ChatResponse> {
    if (this.useMock) {
      return this.mockResponse(userMessage, conversationId);
    }

    // REAL IMPLEMENTATION
    const request: ChatRequest = {
      query: userMessage,
      conversationId: conversationId,
      userRole: this.authService.userRole() || undefined,
      contextId: this.extractContextId() // Try to find tenderId or other context
    };

    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, request);
  }

  private extractContextId(): string | undefined {
    // Basic logic to extract context from URL
    const url = window.location.href;
    const match = url.match(/tender\/(\d+)/) || url.match(/submission\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : undefined;
  }

  private mockResponse(userMessage: string, conversationId?: string): Observable<ChatResponse> {
    const lowerMessage = userMessage.toLowerCase();
    let answer = '';

    // Intelligent mock responses based on keywords
    if (lowerMessage.includes('pont') || lowerMessage.includes('bridge')) {
      answer = `🌉 **Projet de Pont Autoroutier**\n\n` +
        `D'après les documents d'appel d'offres, ce projet concerne la construction d'un pont autoroutier de 450 mètres.\n\n` +
        `**Caractéristiques principales :**\n` +
        `• Longueur totale : 450m\n` +
        `• Type : Structure en béton précontraint\n` +
        `• Capacité : 4 voies de circulation\n` +
        `• Durée estimée : 24 mois\n\n` +
        `**Critères d'évaluation :**\n` +
        `• Prix (40%)\n` +
        `• Expérience technique (30%)\n` +
        `• Délai de réalisation (20%)\n` +
        `• Approche environnementale (10%)\n\n` +
        `Souhaitez-vous plus de détails sur un aspect spécifique ?`;
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('prix') || lowerMessage.includes('coût')) {
      answer = `💰 **Informations Budgétaires**\n\n` +
        `Le budget estimé pour ce projet est de **15 millions d'euros**.\n\n` +
        `**Répartition indicative :**\n` +
        `• Matériaux : 60% (9M€)\n` +
        `• Main d'œuvre : 25% (3.75M€)\n` +
        `• Équipements : 10% (1.5M€)\n` +
        `• Études et contrôles : 5% (0.75M€)\n\n` +
        `Les soumissions doivent inclure un détail complet des coûts.`;
    } else if (lowerMessage.includes('délai') || lowerMessage.includes('durée') || lowerMessage.includes('temps')) {
      answer = `⏱️ **Calendrier du Projet**\n\n` +
        `**Durée de réalisation :** 24 mois maximum\n\n` +
        `**Phases principales :**\n` +
        `1. Études préliminaires : 3 mois\n` +
        `2. Fondations : 6 mois\n` +
        `3. Structure principale : 12 mois\n` +
        `4. Finitions et tests : 3 mois\n\n` +
        `**Date limite de soumission :** 30 jours à partir de la publication\n\n` +
        `Un planning détaillé doit être fourni avec votre soumission.`;
    } else if (lowerMessage.includes('critère') || lowerMessage.includes('évaluation') || lowerMessage.includes('notation')) {
      answer = `📊 **Critères d'Évaluation**\n\n` +
        `Votre soumission sera évaluée selon les critères suivants :\n\n` +
        `**1. Prix (40 points)**\n` +
        `• Compétitivité de l'offre\n` +
        `• Rapport qualité-prix\n\n` +
        `**2. Expérience Technique (30 points)**\n` +
        `• Projets similaires réalisés\n` +
        `• Qualifications de l'équipe\n\n` +
        `**3. Délai (20 points)**\n` +
        `• Réalisme du planning\n` +
        `• Capacité de respect des délais\n\n` +
        `**4. Approche Environnementale (10 points)**\n` +
        `• Impact écologique\n` +
        `• Solutions durables\n\n` +
        `**Score minimum requis :** 60/100`;
    } else if (lowerMessage.includes('document') || lowerMessage.includes('fichier') || lowerMessage.includes('télécharger')) {
      answer = `📄 **Documents Disponibles**\n\n` +
        `Les documents suivants sont disponibles pour ce projet :\n\n` +
        `• **Cahier des charges technique** (PDF, 45 pages)\n` +
        `• **Plans architecturaux** (DWG, 12 fichiers)\n` +
        `• **Étude géotechnique** (PDF, 28 pages)\n` +
        `• **Spécifications matériaux** (PDF, 15 pages)\n` +
        `• **Modèle de soumission** (DOCX)\n\n` +
        `Vous pouvez les télécharger depuis la section "Documents" de l'appel d'offres.`;
    } else if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('comment')) {
      answer = `🤖 **Assistant IA BidConnect**\n\n` +
        `Je suis votre assistant intelligent pour les appels d'offres !\n\n` +
        `**Je peux vous aider avec :**\n` +
        `• Informations sur les projets (budget, délais, critères)\n` +
        `• Analyse des documents d'appel d'offres\n` +
        `• Conseils pour optimiser votre soumission\n` +
        `• Réponses aux questions techniques\n\n` +
        `**Exemples de questions :**\n` +
        `• "Quel est le budget du projet de pont ?"\n` +
        `• "Quels sont les critères d'évaluation ?"\n` +
        `• "Quel délai de réalisation est demandé ?"\n\n` +
        `Posez-moi vos questions ! 💬`;
    } else {
      answer = `🤖 **Assistant BidConnect**\n\n` +
        `J'ai bien reçu votre question : "${userMessage}"\n\n` +
        `Je suis en mesure de vous fournir des informations détaillées sur :\n` +
        `• Les projets d'appels d'offres actifs\n` +
        `• Les critères d'évaluation et de notation\n` +
        `• Les budgets et délais\n` +
        `• Les documents techniques\n\n` +
        `Pourriez-vous préciser votre question ? Par exemple :\n` +
        `• "Parle-moi du projet de pont"\n` +
        `• "Quel est le budget ?"\n` +
        `• "Quels sont les critères d'évaluation ?"`;
    }

    const response: ChatResponse = {
      answer: answer,
      sources: ['tender-doc-001', 'technical-specs-v2', 'evaluation-criteria'],
      conversationId: conversationId || `conv-${Date.now()}`
    };

    // Simulate network delay (2 seconds)
    return of(response).pipe(delay(2000));
  }
}
