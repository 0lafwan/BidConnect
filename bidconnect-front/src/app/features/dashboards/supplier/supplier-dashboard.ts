import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, PLATFORM_ID, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TenderService } from '../../../core/services/tender.service';
import { SubmissionService } from '../../../core/services/submission.service';
import { TenderResponse, TenderStatus } from '../../../core/models/tender.model';
import { SubmissionResponse, SubmissionStatus, SubmissionRequest } from '../../../core/models/submission.model';
import gsap from 'gsap';

type ViewState = 'OPPORTUNITIES' | 'MY_SUBMISSIONS' | 'DETAILS';

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

  // État de la vue
  viewState = signal<ViewState>('OPPORTUNITIES');
  mySubmissions = signal<SubmissionResponse[]>([]);
  selectedSubmission = signal<SubmissionResponse | null>(null);
  selectedSubmissionTender = signal<TenderResponse | null>(null);

  // Notifications & Modals
  showConfirmModal = signal(false);
  confirmData = signal<{ title: string; message: string; action: () => void } | null>(null);
  toast = signal<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Computed Stats
  totalSubmissions = computed(() => this.mySubmissions().length);
  acceptedSubmissions = computed(() =>
    this.mySubmissions().filter(s => s.status === SubmissionStatus.ACCEPTED).length
  );

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
    this.loadSubmissions();
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
        // Normaliser et accepter PUBLISHED ou OPEN
        const publishedTenders = data.filter(t => {
          const s = t.status?.toUpperCase();
          return s === 'PUBLISHED' || s === 'OPEN';
        });

        this.tenders.set(publishedTenders);
        this.isLoading.set(false);

        // Animer les cartes après un délai plus sûr
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
    // Délai augmenté pour s'assurer que le DOM est prêt
    setTimeout(() => {
      if (!this.cardsContainer?.nativeElement) return;

      const cards = this.cardsContainer.nativeElement.querySelectorAll('.opportunity-card');
      if (cards.length > 0) {
        // Stopper les animations précédentes pour éviter les conflits
        gsap.killTweensOf(cards);

        gsap.fromTo(cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'all'
          }
        );
      }
    }, 150);
  }

  /**
   * Charger les soumissions du fournisseur
   */
  loadSubmissions(): void {
    const user = this.currentUser();
    if (!user || !user.id) return;

    this.submissionService.getSubmissionsBySupplier(user.id).subscribe({
      next: (submissions) => {
        this.mySubmissions.set(submissions);
      },
      error: (error) => {
        console.error('Erreur chargement soumissions:', error);
      }
    });
  }

  /**
   * Changer de vue (Opportunités vs Mes Soumissions)
   */
  switchView(state: ViewState): void {
    this.viewState.set(state);
    if (state === 'MY_SUBMISSIONS') {
      this.loadSubmissions();
    } else if (state === 'OPPORTUNITIES') {
      this.loadOpportunities();
    }
  }

  /**
   * Voir les détails d'une soumission
   */
  viewSubmissionDetails(submission: SubmissionResponse): void {
    this.selectedSubmission.set(submission);
    this.isLoading.set(true);
    this.viewState.set('DETAILS');

    // Charger les détails de l'appel d'offres associé
    this.tenderService.getTenderById(Number(submission.tenderId)).subscribe({
      next: (tender) => {
        this.selectedSubmissionTender.set(tender);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Tender not found or error:', error);
        this.selectedSubmissionTender.set(null); // Clear tender info
        if (error.status === 404) {
          this.showNotification(`Note: Les détails de l'appel d'offres ne sont plus disponibles.`, 'error');
        } else {
          this.showNotification(`Erreur chargement détails: ${error.message}`, 'error');
        }
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Confirmer le retrait d'une soumission
   */
  confirmWithdraw(submission: SubmissionResponse): void {
    this.triggerConfirm(
      'RETIRER LA SOUMISSION',
      'Voulez-vous vraiment retirer votre candidature pour cet appel d\'offres ? Cette action est irréversible.',
      () => this.withdrawSubmission(submission.id)
    );
  }

  /**
   * Retirer une soumission
   */
  private withdrawSubmission(id: string): void {
    this.submissionService.deleteSubmission(id).subscribe({
      next: () => {
        this.showNotification('Votre soumission a été retirée avec succès.', 'success');
        this.loadSubmissions();
        if (this.viewState() === 'DETAILS') {
          this.switchView('MY_SUBMISSIONS');
        }
      },
      error: (error) => {
        this.showNotification(`Erreur lors du retrait: ${error.message}`, 'error');
      }
    });
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
    this.selectedFile = null;
    this.fileError = null;
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
    this.selectedFile = null;
    this.fileError = null;
    this.errorMessage.set(null);

    if (this.isBrowser) {
      // Réactiver le scroll
      document.body.style.overflow = '';
    }
  }

  // Fichier sélectionné
  selectedFile: File | null = null;
  fileError: string | null = null;

  /**
   * Gérer la sélection de fichier
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileError = null;
    }
  }

  /**
   * Soumettre la candidature
   */
  onSubmit(): void {
    if (this.submissionForm.invalid || !this.selectedFile) {
      this.markFormGroupTouched(this.submissionForm);
      if (!this.selectedFile) {
        this.fileError = 'Le document de soumission est requis';
      }
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
      deadline: formValue.deadline,
      document: this.selectedFile
    };

    this.submissionService.createSubmission(request).subscribe({
      next: (submission) => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.showNotification('Votre soumission a été envoyée avec succès !', 'success');
        this.loadSubmissions(); // Refresh the list and stats
      },
      error: (error) => {
        this.showNotification(`Erreur: ${error.message}`, 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  /**
   * Afficher une notification toast
   */
  private showNotification(message: string, type: 'success' | 'error'): void {
    this.toast.set({ show: true, message, type });
    setTimeout(() => {
      this.toast.update(t => ({ ...t, show: false }));
    }, 4000);
  }

  /**
   * Déclencher une confirmation personnalisée
   */
  private triggerConfirm(title: string, message: string, action: () => void): void {
    this.confirmData.set({ title, message, action });
    this.showConfirmModal.set(true);
  }

  cancelConfirm(): void {
    this.showConfirmModal.set(false);
    this.confirmData.set(null);
  }

  executeConfirm(): void {
    const data = this.confirmData();
    if (data) {
      data.action();
    }
    this.cancelConfirm();
  }

  confirmSubmit(): void {
    if (this.submissionForm.invalid || !this.selectedFile) {
      this.markFormGroupTouched(this.submissionForm);
      if (!this.selectedFile) {
        this.fileError = 'Le document de soumission est requis';
      }
      return;
    }

    this.triggerConfirm(
      'CONFIRMER LA SOUMISSION',
      'Voulez-vous vraiment envoyer votre proposition technique et financière ?',
      () => this.onSubmit()
    );
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
