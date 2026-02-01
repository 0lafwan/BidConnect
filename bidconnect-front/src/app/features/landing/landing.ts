import { Component, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationService } from '../../core/services/animation.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private animationService = inject(AnimationService);
  private animations: gsap.core.Tween[] = [];

  services = [
    {
      number: '01',
      title: 'Publication d\'Appels d\'Offres',
      description: 'Créez et publiez vos appels d\'offres en quelques clics',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
    },
    {
      number: '02',
      title: 'Gestion des Soumissions',
      description: 'Recevez et analysez les candidatures des fournisseurs',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    },
    {
      number: '03',
      title: 'Analyse IA Avancée',
      description: 'Intelligence artificielle pour l\'évaluation automatique',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    },
    {
      number: '04',
      title: 'Notifications Temps Réel',
      description: 'Restez informé à chaque étape du processus',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'
    }
  ];

  projects = [
    {
      title: 'Modernisation Infrastructure',
      category: 'Infrastructure Publique',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
      stats: '€2.5M'
    },
    {
      title: 'Transformation Digitale',
      category: 'Services Numériques',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
      stats: '€1.8M'
    },
    {
      title: 'Développement Durable',
      category: 'Énergie Verte',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
      stats: '€3.2M'
    }
  ];

  footerText = "LET'S CREATE EXTRAORDINARY";

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngOnInit(): void {
    // Initialization logic
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      this.initHeroAnimations();
      this.initServicesAnimations();
      this.initProjectsAnimations();
      this.initFooterAnimations();
      this.initMouseFollower();
    }, 100);
  }

  /**
   * HERO SECTION - Parallax + Ken Burns
   */
  private initHeroAnimations(): void {
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    if (!heroImage || !heroContent) return;

    // Ken Burns Effect - Zoom lent continu
    gsap.to(heroImage, {
      scale: 1.15,
      duration: 20,
      ease: 'none',
      repeat: -1,
      yoyo: true
    });

    // Parallax Effect - Texte descend plus vite que l'image
    // IMPORTANT: On exclut les éléments avec animation d'entrée
    gsap.to(heroContent, {
      y: 300,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Fade in initial - Utilisation de fromTo pour plus de contrôle
    if (heroTitle) {
      gsap.fromTo(heroTitle, 
        {
          y: 100,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.out',
          overwrite: 'auto', // Empêche les conflits d'animation
          clearProps: 'transform' // Nettoie les transforms après l'animation
        }
      );
    }

    if (heroSubtitle) {
      gsap.fromTo(heroSubtitle,
        {
          y: 80,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.6,
          ease: 'power3.out',
          overwrite: 'auto'
        }
      );
    }

    if (heroCta) {
      gsap.fromTo(heroCta,
        {
          y: 60,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.9,
          ease: 'power3.out',
          overwrite: 'auto'
        }
      );
    }
  }

  /**
   * SERVICES SECTION - Grille Interactive avec révélation liquide
   */
  private initServicesAnimations(): void {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
      const image = card.querySelector('.service-image');
      const content = card.querySelector('.service-content');

      // Scroll reveal
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Hover effect - Révélation liquide de l'image
      card.addEventListener('mouseenter', () => {
        gsap.to(image, {
          opacity: 1,
          scale: 1.05,
          duration: 0.6,
          ease: 'power2.out'
        });

        gsap.to(content, {
          y: -10,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(image, {
          opacity: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        });

        gsap.to(content, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  }

  /**
   * PROJECTS SECTION - Scroll reveal + Ombre dynamique
   */
  private initProjectsAnimations(): void {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card, index) => {
      // Scroll reveal
      gsap.from(card, {
        y: 150,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // Ombre dynamique qui suit la souris
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        gsap.to(card, {
          rotateY: deltaX * 5,
          rotateX: -deltaY * 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });

        // Ombre dynamique
        const shadowX = deltaX * 20;
        const shadowY = deltaY * 20;
        (card as HTMLElement).style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(255, 51, 51, 0.3)`;
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
        (card as HTMLElement).style.boxShadow = '0px 0px 0px rgba(255, 51, 51, 0)';
      });
    });
  }

  /**
   * FOOTER - Typographie Cinétique (Effet Magnétique)
   */
  private initFooterAnimations(): void {
    const footerText = document.querySelector('.footer-magnetic-text');
    if (!footerText) return;

    const letters = footerText.querySelectorAll('.magnetic-letter');

    letters.forEach((letter) => {
      letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
          y: -20,
          scale: 1.3,
          color: '#FF3333',
          duration: 0.3,
          ease: 'back.out(2)'
        });

        // Effet de répulsion sur les lettres voisines
        const index = Array.from(letters).indexOf(letter);
        if (letters[index - 1]) {
          gsap.to(letters[index - 1], {
            x: -10,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        if (letters[index + 1]) {
          gsap.to(letters[index + 1], {
            x: 10,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
          y: 0,
          scale: 1,
          color: '#FFFFFF',
          duration: 0.4,
          ease: 'power2.out'
        });

        // Reset des lettres voisines
        const index = Array.from(letters).indexOf(letter);
        if (letters[index - 1]) {
          gsap.to(letters[index - 1], {
            x: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
        if (letters[index + 1]) {
          gsap.to(letters[index + 1], {
            x: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  /**
   * Mouse Follower - Curseur personnalisé
   */
  private initMouseFollower(): void {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // Agrandir le curseur sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 2,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  ngOnDestroy(): void {
    // Nettoyer les animations
    this.animations.forEach(anim => anim.kill());
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
