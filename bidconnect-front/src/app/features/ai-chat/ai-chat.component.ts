import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatResponse } from '../../core/services/ai.service';
import gsap from 'gsap';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent implements OnInit, OnDestroy {
  private aiService = inject(AiService);
  
  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  userInput = signal('');
  isLoading = signal(false);
  conversationId?: string;

  ngOnInit(): void {
    // Welcome message
    this.messages.set([{
      role: 'assistant',
      content: '👋 Bonjour ! Je suis votre assistant IA BidConnect. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }]);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  toggleChat(): void {
    const newState = !this.isOpen();
    this.isOpen.set(newState);

    if (newState) {
      // Animate chat window opening
      setTimeout(() => {
        const chatWindow = document.querySelector('.chat-window');
        if (chatWindow) {
          gsap.fromTo(chatWindow,
            { scale: 0.8, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
          );
        }
      }, 10);
    }
  }

  sendMessage(): void {
    const message = this.userInput().trim();
    if (!message || this.isLoading()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMessage]);
    this.userInput.set('');
    this.isLoading.set(true);

    // Scroll to bottom
    setTimeout(() => this.scrollToBottom(), 100);

    // Call AI service
    this.aiService.sendMessage(message, this.conversationId).subscribe({
      next: (response: ChatResponse) => {
        this.conversationId = response.conversationId;
        
        // Add assistant message with typing effect
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isTyping: true
        };
        this.messages.update(msgs => [...msgs, assistantMessage]);
        
        // Typewriter effect
        this.typewriterEffect(response.answer, this.messages().length - 1);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('AI Service Error:', error);
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: '❌ Désolé, une erreur s\'est produite. Veuillez réessayer.',
          timestamp: new Date()
        };
        this.messages.update(msgs => [...msgs, errorMessage]);
        this.isLoading.set(false);
      }
    });
  }

  private typewriterEffect(text: string, messageIndex: number): void {
    let currentIndex = 0;
    const words = text.split(' ');
    
    const typeInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const currentMessages = this.messages();
        const updatedMessages = [...currentMessages];
        
        if (updatedMessages[messageIndex]) {
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            content: words.slice(0, currentIndex + 1).join(' '),
            isTyping: true
          };
          this.messages.set(updatedMessages);
          currentIndex++;
          
          // Scroll to bottom during typing
          this.scrollToBottom();
        }
      } else {
        // Typing complete
        clearInterval(typeInterval);
        const currentMessages = this.messages();
        const updatedMessages = [...currentMessages];
        if (updatedMessages[messageIndex]) {
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            isTyping: false
          };
          this.messages.set(updatedMessages);
        }
      }
    }, 30); // 30ms between words for smooth typing effect
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 50);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages.set([{
      role: 'assistant',
      content: '👋 Conversation réinitialisée. Comment puis-je vous aider ?',
      timestamp: new Date()
    }]);
    this.conversationId = undefined;
  }

  formatMessage(content: string): string {
    // Convert markdown-like formatting to HTML
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/\n/g, '<br>'); // Line breaks
    
    return formatted;
  }
}
