import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TenderService } from '../../../core/services/tender.service';
import { SubmissionService } from '../../../core/services/submission.service';
import { TenderResponse, TenderStatus } from '../../../core/models/tender.model';
import { SubmissionRequest } from '../../../core/models/submission.model';
import gsap from 'gsap';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplier-dashboard.html',
  styleUrls: ['./supplier-dashboard.css']
})
export class SupplierDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardsContainer') cardsContainer!: ElementRef;
  @ViewChild('modal') modal!: ElementRef;

  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private tenderService = inject(TenderService);
  private submissionService = inject(SubmissionService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private isBrowser: boolean;

  // Signals
  currentUser = this.authService.currentUser;
  isLoading = signal(false);
  tenders = signal<TenderResponse[]>([]);
  errorMessage = signal<string | null>(null);
  showModal = signal(false);
  selectedTender = signal<TenderResponse | null>(null);
  isSubmitting = signal(false);

  // Formulaire de soumission
  submissionForm!: FormGroup;

  // Enum pour le template
  TenderStatus = TenderStatus;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadOpportunities();
  }

  ngAfterViewInit(): void {
    // Les animations seront déclenchées après le chargement des données
  }

  ngOnDestroy(): void {
    // Cleanup si nécessaire
  }

  /**
   * Initialiser le formulaire de soumission
   */
  private initForm(): void {
    this.submissionForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      technical: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      deadline: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  /**
   * Charger les opportunités (appels d'offres publiés)
   */
  loadOpportunities(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.tenderService.getAllTenders().subscribe({
      next: (data) => {
        // Filtrer uniquement les tenders publiés
        const publishedTenders = data.filter(t => t.status === TenderStatus.PUBLISHED);
        this.tenders.set(publishedTenders);
        this.isLoading.set(false);
        
        // Animer les cartes après le chargement
        if (this.isBrowser && publishedTenders.length > 0) {
          this.animateCards();
        }
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Animer les cartes
   */
  private animateCards(): void {
    setTimeout(() => {
      if (!this.cardsContainer?.nativeElement) return;

      const cards = this.cardsContainer.nativeElement.querySelectorAll('.opportunity-card');
      
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out'
        });
      }
    }, 50);
  }

  /**
   * Animer la modale
   */
  private animateModal(): void {
    setTimeout(() => {
      if (!this.modal?.nativeElement) return;

      gsap.fromTo(
        this.modal.nativeElement,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }, 50);
  }

  /**
   * Ouvrir la modale de soumission
   */
  openSubmissionModal(tender: TenderResponse): void {
    this.selectedTender.set(tender);
    this.submissionForm.reset();
    this.showModal.set(true);
    this.errorMessage.set(null);

    if (this.isBrowser) {
      // Bloquer le scroll
      document.body.style.overflow = 'hidden';
      this.animateModal();
    }
  }

  /**
   * Fermer la modale
   */
  closeModal(): void {
    this.showModal.set(false);
    this.selectedTender.set(null);
    this.errorMessage.set(null);

    if (this.isBrowser) {
      // Réactiver le scroll
      document.body.style.overflow = '';
    }
  }

  /**
   * Soumettre la candidature
   */
  onSubmit(): void {
    if (this.submissionForm.invalid) {
      this.markFormGroupTouched(this.submissionForm);
      return;
    }

    const tender = this.selectedTender();
    if (!tender) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.submissionForm.value;
    const currentUserData = this.currentUser();

    const request: SubmissionRequest = {
      tenderId: tender.id.toString(),
      supplierId: currentUserData?.id || 'supplier-1',
      price: formValue.price,
      technical: formValue.technical,
      deadline: formValue.deadline
    };

    this.submissionService.createSubmission(request).subscribe({
      next: (submission) => {
        this.isSubmitting.set(false);
        this.closeModal();
        // Afficher un message de succès
        alert('Votre soumission a été envoyée avec succès !');
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isSubmitting.set(false);
      }
    });
  }

  /**
   * Calculer les jours restants
   */
  getDaysRemaining(deadline: string): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Obtenir la classe CSS des jours restants
   */
  getDaysClass(days: number): string {
    if (days <= 7) return 'days-urgent';
    if (days <= 14) return 'days-warning';
    return 'days-normal';
  }

  /**
   * Vérifier si un champ a une erreur
   */
  hasError(fieldName: string): boolean {
    const field = this.submissionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtenir le message d'erreur d'un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.submissionForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['min']) return `Valeur minimale: ${field.errors['min'].min}`;
    if (field.errors['max']) return `Valeur maximale: ${field.errors['max'].max}`;
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;

    return 'Erreur de validation';
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
   * Déconnexion
   */
  logout(): void {
    this.authService.logout();
  }
}
