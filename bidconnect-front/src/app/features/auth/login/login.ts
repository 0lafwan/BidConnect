import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import gsap from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('loginCard') loginCard!: ElementRef;
  @ViewChild('noiseOverlay') noiseOverlay!: ElementRef;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = this.authService.isLoading;

  // État pour afficher/masquer le mot de passe
  showPassword = signal(false);

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  /**
   * Initialiser le formulaire
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Initialiser les animations GSAP
   */
  private initAnimations(): void {
    // Vérifier que les éléments existent
    if (!this.loginCard?.nativeElement) {
      console.warn('LoginCard element not found');
      return;
    }

    // Animation d'entrée de la carte - CORRECTION: utiliser fromTo pour garantir l'état final
    gsap.fromTo(
      this.loginCard.nativeElement,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      }
    );

    // Animation du bruit (grain)
    if (this.noiseOverlay?.nativeElement) {
      gsap.to(this.noiseOverlay.nativeElement, {
        opacity: 0.03,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });
    }

    // Animation des inputs au focus
    const inputs = this.loginCard.nativeElement.querySelectorAll('input');
    inputs.forEach((input: HTMLInputElement) => {
      input.addEventListener('focus', () => {
        gsap.to(input, {
          scale: 1.01,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      input.addEventListener('blur', () => {
        gsap.to(input, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    });
  }

  /**
   * Soumettre le formulaire
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      error: (error) => {
        this.errorMessage.set(error.message);
        this.shakeCard();
      }
    });
  }

  /**
   * Animation de secousse en cas d'erreur
   */
  private shakeCard(): void {
    gsap.to(this.loginCard.nativeElement, {
      x: -10,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(this.loginCard.nativeElement, { x: 0 });
      }
    });
  }

  /**
   * Marquer tous les champs comme touchés
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Vérifier si un champ a une erreur
   */
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtenir le message d'erreur d'un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['email']) return 'Email invalide';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;

    return 'Erreur de validation';
  }

  /**
   * Basculer la visibilité du mot de passe
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  /**
   * Remplir le formulaire avec des données de test (mode MOCK)
   */
  fillMockData(role: 'admin' | 'owner' | 'supplier'): void {
    this.loginForm.patchValue({
      email: `${role}@bidconnect.com`,
      password: 'password123'
    });
  }
}
