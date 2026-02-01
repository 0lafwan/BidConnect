import { Component, signal, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SmoothScrollService } from './core/services/smooth-scroll.service';
import { AnimationService } from './core/services/animation.service';
import { HeaderComponent } from './layout/header/header';
import { AiChatComponent } from './features/ai-chat/ai-chat.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, AiChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('BidConnect');
  
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private isBrowser: boolean;
  private smoothScrollService = inject(SmoothScrollService);
  private animationService = inject(AnimationService);

  // Signal pour contrôler la visibilité du header global
  showGlobalHeader = signal(true);

  // Routes où le header global ne doit PAS s'afficher
  private readonly dashboardRoutes = ['/admin', '/owner', '/supplier'];

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    // Initialiser le smooth scroll
    this.smoothScrollService.init();
    
    // Écouter les changements de route pour gérer la visibilité du header
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateHeaderVisibility(event.urlAfterRedirects);
      });

    // Vérifier l'URL initiale
    this.updateHeaderVisibility(this.router.url);
    
    console.log('🎨 BidConnect Frontend - Brutalisme Moderne');
    console.log('✅ Smooth Scroll activé');
    console.log('✅ GSAP Animations prêtes');
    console.log('✅ Header Global chargé');
  }

  /**
   * Met à jour la visibilité du header selon l'URL
   */
  private updateHeaderVisibility(url: string): void {
    const isDashboard = this.dashboardRoutes.some(route => url.startsWith(route));
    this.showGlobalHeader.set(!isDashboard);
    
    if (isDashboard) {
      console.log('📊 Dashboard détecté - Header global masqué');
    }
  }

  ngOnDestroy() {
    // Nettoyer les animations et le smooth scroll
    this.animationService.killAll();
    this.smoothScrollService.destroy();
  }
}

