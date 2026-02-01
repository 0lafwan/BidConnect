import { Component, OnInit, OnDestroy, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import gsap from 'gsap';
import { AuthService } from '../../core/services/auth.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private smoothScrollService = inject(SmoothScrollService);
  private router = inject(Router);
  private isBrowser: boolean;
  private scrollSubscription?: Subscription;

  // Signals pour la réactivité
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  // État d'authentification
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  // Navigation items
  navItems = [
    { label: 'SERVICES', path: '/services', anchor: 'services' },
    { label: 'PROJETS', path: '/projects', anchor: 'projects' },
    { label: 'À PROPOS', path: '/about', anchor: 'about' }
  ];

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Obtenir le lien du logo selon l'état d'authentification
   */
  getLogoLink(): string {
    if (!this.isAuthenticated()) {
      return '/';
    }

    const role = this.currentUser()?.role;
    if (role) {
      return `/${role.toLowerCase()}`;
    }

    return '/';
  }

  /**
   * Gérer le clic sur un lien de navigation (scroll vers ancre)
   */
  onNavClick(event: Event, item: { label: string; path: string; anchor: string }): void {
    event.preventDefault();

    // Si on est déjà sur la landing page, scroller vers l'ancre
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.scrollToSection(item.anchor);
      this.closeMobileMenu();
    } else {
      // Sinon, naviguer vers la landing page puis scroller
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollToSection(item.anchor);
          this.closeMobileMenu();
        }, 100);
      });
    }
  }

  /**
   * Scroller vers une section avec smooth scroll
   */
  private scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;

    const element = document.getElementById(sectionId);
    if (element) {
      this.smoothScrollService.scrollTo(`#${sectionId}`, {
        offset: -100, // Offset pour le header fixe
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      console.warn(`Section #${sectionId} not found`);
    }
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Écouter le scroll
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.handleScroll();
      });

    // Écouter la touche ESC pour fermer le menu mobile
    fromEvent<KeyboardEvent>(window, 'keydown')
      .subscribe((event) => {
        if (event.key === 'Escape' && this.isMobileMenuOpen()) {
          this.toggleMobileMenu();
        }
      });

    // Vérifier l'état initial
    this.handleScroll();
  }

  /**
   * Gère le changement d'état du header au scroll
   */
  private handleScroll(): void {
    const scrollY = window.scrollY;
    const shouldBeScrolled = scrollY > 50;

    if (shouldBeScrolled !== this.isScrolled()) {
      this.isScrolled.set(shouldBeScrolled);
    }
  }

  /**
   * Toggle du menu mobile
   */
  toggleMobileMenu(): void {
    const newState = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(newState);

    if (!this.isBrowser) return;

    // Animation du menu mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    if (newState) {
      // Ouvrir le menu
      gsap.to(mobileMenu, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          (mobileMenu as HTMLElement).style.pointerEvents = 'auto';
        }
      });

      // Animer les liens avec stagger
      gsap.from(menuLinks, {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });

      // Bloquer le scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Fermer le menu
      gsap.to(mobileMenu, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          (mobileMenu as HTMLElement).style.pointerEvents = 'none';
        }
      });

      // Réactiver le scroll
      document.body.style.overflow = '';
    }
  }

  /**
   * Ferme le menu mobile (appelé au clic sur un lien)
   */
  closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Animation du logo au hover
   */
  onLogoHover(isEntering: boolean): void {
    if (!this.isBrowser) return;

    const logo = document.querySelector('.header-logo');
    if (!logo) return;

    if (isEntering) {
      gsap.to(logo, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(logo, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
    
    // Réactiver le scroll si le menu était ouvert
    if (this.isBrowser && this.isMobileMenuOpen()) {
      document.body.style.overflow = '';
    }
  }
}
