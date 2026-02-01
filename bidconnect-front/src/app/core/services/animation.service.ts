import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /**
   * Animation d'apparition brutale (slide up + fade)
   */
  brutalFadeIn(element: string | Element, options?: gsap.TweenVars) {
    if (!this.isBrowser) return;

    return gsap.from(element, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      ...options
    });
  }

  /**
   * Animation de slide avec effet brutal
   */
  brutalSlide(element: string | Element, direction: 'left' | 'right' | 'up' | 'down' = 'up', options?: gsap.TweenVars) {
    if (!this.isBrowser) return;

    const directions = {
      left: { x: -100, y: 0 },
      right: { x: 100, y: 0 },
      up: { x: 0, y: 50 },
      down: { x: 0, y: -50 }
    };

    return gsap.from(element, {
      ...directions[direction],
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      ...options
    });
  }

  /**
   * Animation de hover brutal (shadow + translate)
   */
  brutalHover(element: string | Element) {
    if (!this.isBrowser) return;

    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        x: 4,
        y: 4,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }

  /**
   * Animation de scroll reveal
   */
  scrollReveal(element: string | Element, options?: gsap.TweenVars) {
    if (!this.isBrowser) return;

    return gsap.from(element, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      ...options
    });
  }

  /**
   * Animation de texte brutal (split text)
   */
  brutalTextReveal(element: string | Element, options?: gsap.TweenVars) {
    if (!this.isBrowser) return;

    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const text = el.textContent || '';
    el.innerHTML = text.split('').map(char => 
      `<span style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    return gsap.from(el.children, {
      y: 50,
      opacity: 0,
      duration: 0.05,
      stagger: 0.02,
      ease: 'power2.out',
      ...options
    });
  }

  /**
   * Animation de parallax brutal
   */
  brutalParallax(element: string | Element, speed: number = 0.5) {
    if (!this.isBrowser) return;

    return gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /**
   * Animation de glitch brutal
   */
  brutalGlitch(element: string | Element) {
    if (!this.isBrowser) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    
    tl.to(element, {
      x: -2,
      duration: 0.05,
      ease: 'none'
    })
    .to(element, {
      x: 2,
      duration: 0.05,
      ease: 'none'
    })
    .to(element, {
      x: 0,
      duration: 0.05,
      ease: 'none'
    });

    return tl;
  }

  /**
   * Nettoyage des animations
   */
  killAll() {
    if (!this.isBrowser) return;
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
