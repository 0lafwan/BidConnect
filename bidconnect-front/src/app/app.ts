import { Component, signal, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SmoothScrollService } from './core/services/smooth-scroll.service';
import { AnimationService } from './core/services/animation.service';
import { HeaderComponent } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('BidConnect');
  
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private smoothScrollService = inject(SmoothScrollService);
  private animationService = inject(AnimationService);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    // Initialiser le smooth scroll
    this.smoothScrollService.init();
    
    console.log('🎨 BidConnect Frontend - Brutalisme Moderne');
    console.log('✅ Smooth Scroll activé');
    console.log('✅ GSAP Animations prêtes');
    console.log('✅ Header Global chargé');
  }

  ngOnDestroy() {
    // Nettoyer les animations et le smooth scroll
    this.animationService.killAll();
    this.smoothScrollService.destroy();
  }
}

