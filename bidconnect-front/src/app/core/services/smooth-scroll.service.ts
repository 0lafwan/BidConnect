import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private lenis: Lenis | null = null;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Initialise Lenis smooth scroll
   */
  init() {
    if (!this.isBrowser || this.lenis) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation frame loop
    const raf = (time: number) => {
      this.lenis?.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    console.log('✅ Lenis Smooth Scroll initialized');
  }

  /**
   * Scroll vers un élément
   */
  scrollTo(target: string | number | HTMLElement, options?: any) {
    if (!this.lenis) return;
    this.lenis.scrollTo(target, options);
  }

  /**
   * Scroll vers le haut
   */
  scrollToTop(options?: any) {
    this.scrollTo(0, options);
  }

  /**
   * Stop le scroll
   */
  stop() {
    if (!this.lenis) return;
    this.lenis.stop();
  }

  /**
   * Start le scroll
   */
  start() {
    if (!this.lenis) return;
    this.lenis.start();
  }

  /**
   * Détruit l'instance Lenis
   */
  destroy() {
    if (!this.lenis) return;
    this.lenis.destroy();
    this.lenis = null;
    console.log('🗑️ Lenis Smooth Scroll destroyed');
  }

  /**
   * Obtient l'instance Lenis
   */
  getInstance(): Lenis | null {
    return this.lenis;
  }
}
