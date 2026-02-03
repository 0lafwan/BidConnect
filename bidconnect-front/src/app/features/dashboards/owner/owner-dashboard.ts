import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TenderService } from '../../../core/services/tender.service';
import { SubmissionService } from '../../../core/services/submission.service';
import { TenderResponse, TenderStatus, TenderCreatePayload, EvaluationCriterionType } from '../../../core/models/tender.model';
import { SubmissionResponse, SubmissionStatus } from '../../../core/models/submission.model';
import gsap from 'gsap';

type ViewState = 'LIST' | 'CREATE' | 'DETAILS';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css'
})
export class OwnerDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  @ViewChild('formContainer') formContainer!: ElementRef;

  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private tenderService = inject(TenderService);
  private submissionService = inject(SubmissionService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private isBrowser: boolean;

  // Signals
  currentUser = this.authService.currentUser;
  viewState = signal<ViewState>('LIST');
  isLoading = signal(false);
  tenders = signal<TenderResponse[]>([]);
  errorMessage = signal<string | null>(null);
  selectedTender = signal<TenderResponse | null>(null);
  submissions = signal<SubmissionResponse[]>([]);
  selectedSubmission = signal<SubmissionResponse | null>(null);
  showSubmissionModal = signal(false);
  selectedFiles = signal<File[]>([]);

  // Notifications & Modals
  showConfirmModal = signal(false);
  confirmData = signal<{ title: string; message: string; action: () => void } | null>(null);
  toast = signal<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Formulaire
  tenderForm!: FormGroup;

  // Enum pour le template
  TenderStatus = TenderStatus;
  SubmissionStatus = SubmissionStatus;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    console.log('OwnerDashboard: ngOnInit called');
    console.log('Current user:', this.currentUser());
    this.initForm();
    this.loadTenders();
  }

  ngAfterViewInit(): void {
    // Les animations seront déclenchées après le chargement des données
  }

  ngOnDestroy(): void {
    // Cleanup si nécessaire
  }

  /**
   * Initialiser le formulaire
   */
  private initForm(): void {
    this.tenderForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      deadline: ['', Validators.required],
      priceWeight: [40, [Validators.required, Validators.min(1), Validators.max(100)]],
      technicalWeight: [35, [Validators.required, Validators.min(1), Validators.max(100)]],
      deliveryWeight: [25, [Validators.required, Validators.min(1), Validators.max(100)]]
    }, { validators: this.totalWeightValidator });
  }

  private totalWeightValidator(group: FormGroup): { [key: string]: any } | null {
    const p = group.get('priceWeight')?.value || 0;
    const t = group.get('technicalWeight')?.value || 0;
    const d = group.get('deliveryWeight')?.value || 0;
    return (p + t + d === 100) ? null : { totalWeight: true };
  }

  get totalWeight(): number {
    const p = this.tenderForm?.get('priceWeight')?.value || 0;
    const t = this.tenderForm?.get('technicalWeight')?.value || 0;
    const d = this.tenderForm?.get('deliveryWeight')?.value || 0;
    return p + t + d;
  }

  /**
   * Charger les appels d'offres
   */
  loadTenders(): void {
    console.log('OwnerDashboard: loadTenders called');
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const ownerId = this.currentUser()?.id || '1';
    console.log('Loading tenders for owner:', ownerId);

    this.tenderService.getTendersByOwner(ownerId).subscribe({
      next: (data) => {
        console.log('Tenders loaded:', data);
        this.tenders.set(data);
        this.isLoading.set(false);

        // Animer les lignes après le chargement
        if (this.isBrowser && data.length > 0) {
          this.animateTableRows();
        }
      },
      error: (error) => {
        console.error('Error loading tenders:', error);
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Animer les lignes du tableau
   */
  private animateTableRows(): void {
    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      if (!this.tableContainer?.nativeElement) return;

      const rows = this.tableContainer.nativeElement.querySelectorAll('.tender-row');

      if (rows.length > 0) {
        gsap.from(rows, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }
    }, 50);
  }

  /**
   * Animer le formulaire
   */
  private animateForm(): void {
    setTimeout(() => {
      if (!this.formContainer?.nativeElement) return;

      gsap.fromTo(
        this.formContainer.nativeElement,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }, 50);
  }

  /**
   * Basculer vers la vue création
   */
  switchToCreate(): void {
    this.viewState.set('CREATE');
    this.tenderForm.reset({
      priceWeight: 40,
      technicalWeight: 35,
      deliveryWeight: 25
    });
    this.selectedFiles.set([]);
    this.errorMessage.set(null);

    if (this.isBrowser) {
      this.animateForm();
    }
  }

  /**
   * Basculer vers la vue liste
   */
  switchToList(): void {
    this.viewState.set('LIST');
    this.selectedTender.set(null);
    this.submissions.set([]);
    this.errorMessage.set(null);
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles.set(files);
  }

  /**
   * Soumettre le formulaire
   */
  onSubmit(): void {
    if (this.tenderForm.invalid) {
      this.markFormGroupTouched(this.tenderForm);
      if (this.tenderForm.errors?.['totalWeight']) {
        this.errorMessage.set('La somme des poids doit être égale à 100%');
      }
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.tenderForm.value;
    const currentUserData = this.currentUser();

    const payload: TenderCreatePayload = {
      data: {
        title: formValue.title,
        description: formValue.description,
        organizationId: 1, // À récupérer depuis l'utilisateur connecté
        ownerUserId: currentUserData?.id || '1',
        deadline: formValue.deadline,
        criteria: [
          { type: EvaluationCriterionType.PRICE, weight: formValue.priceWeight },
          { type: EvaluationCriterionType.TECHNICAL_QUALITY, weight: formValue.technicalWeight },
          { type: EvaluationCriterionType.DELIVERY_TIME, weight: formValue.deliveryWeight }
        ]
      },
      files: this.selectedFiles()
    };

    console.log('Submitting tender with weights:', payload.data.criteria);
    console.log('Files to upload:', this.selectedFiles().length);

    this.tenderService.createTender(payload).subscribe({
      next: (tender) => {
        this.isLoading.set(false);
        this.showNotification('Appel d\'offres créé avec succès !', 'success');
        this.switchToList();
        this.loadTenders();
      },
      error: (error) => {
        this.showNotification(`Erreur: ${error.message}`, 'error');
        this.isLoading.set(false);
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

  /**
   * Publier un appel d'offres
   */
  publishTender(id: number, event: Event): void {
    event.stopPropagation();
    this.triggerConfirm(
      'PUBLIER L\'APPEL D\'OFFRES',
      'Êtes-vous sûr de vouloir rendre cet appel d\'offres visible aux fournisseurs ?',
      () => {
        this.tenderService.publishTender(id).subscribe({
          next: () => {
            this.showNotification('Appel d\'offres publié !', 'success');
            this.loadTenders();
          },
          error: (error) => this.showNotification(error.message, 'error')
        });
      }
    );
  }

  /**
   * Clôturer un appel d'offres
   */
  closeTender(id: number, event: Event): void {
    event.stopPropagation();
    this.triggerConfirm(
      'CLÔTURER L\'APPEL D\'OFFRES',
      'Voulez-vous vraiment clore cet appel d\'offres et arrêter les soumissions ?',
      () => {
        this.tenderService.closeTender(id).subscribe({
          next: () => {
            this.showNotification('Appel d\'offres clôturé.', 'success');
            this.loadTenders();
          },
          error: (error) => this.showNotification(error.message, 'error')
        });
      }
    );
  }

  /**
   * Supprimer un appel d'offres
   */
  deleteTender(id: number, event: Event): void {
    event.stopPropagation();
    this.triggerConfirm(
      'SUPPRIMER L\'APPEL D\'OFFRES',
      'Cette action est irréversible. Voulez-vous vraiment supprimer ce projet ?',
      () => {
        this.tenderService.deleteTender(id).subscribe({
          next: () => {
            this.showNotification('Appel d\'offres supprimé.', 'success');
            this.loadTenders();
          },
          error: (error) => this.showNotification(error.message, 'error')
        });
      }
    );
  }

  /**
   * Voir les détails d'un tender
   */
  viewTenderDetails(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // 1. Set selected tender from local state or fetch it
    const tender = this.tenders().find((t: TenderResponse) => t.id === id);
    if (tender) {
      this.selectedTender.set(tender);
    }

    // 2. Fetch submissions for this tender
    this.submissionService.getSubmissionsByTender(id.toString()).subscribe({
      next: (data: SubmissionResponse[]) => {
        this.submissions.set(data);
        this.viewState.set('DETAILS');
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set(`Erreur chargement soumissions: ${error.message}`);
        this.viewState.set('DETAILS'); // Still show tender info
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Voir les détails d'une soumission
   */
  viewSubmissionDetails(id: string): void {
    this.isLoading.set(true);
    this.submissionService.getSubmissionById(id).subscribe({
      next: (sub) => {
        this.selectedSubmission.set(sub);
        this.showSubmissionModal.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.showNotification(`Erreur: ${error.message}`, 'error');
        this.isLoading.set(false);
      }
    });
  }

  closeSubmissionModal(): void {
    this.showSubmissionModal.set(false);
    this.selectedSubmission.set(null);
  }

  /**
   * Mettre à jour le statut d'une soumission (Accepter/Rejeter)
   */
  updateSubmissionStatus(id: string, status: SubmissionStatus): void {
    const actionLabel = status === SubmissionStatus.ACCEPTED ? 'ACCEPTER' : 'REJETER';
    const message = status === SubmissionStatus.ACCEPTED
      ? 'Êtes-vous sûr de vouloir accepter cette offre ? Cette action peut notifier le fournisseur.'
      : 'Voulez-vous vraiment rejeter cette offre ?';

    this.triggerConfirm(
      `${actionLabel} LA SOUMISSION`,
      message,
      () => {
        this.isLoading.set(true);
        this.submissionService.updateStatus(id, { status }).subscribe({
          next: () => {
            this.showNotification(`Soumission ${actionLabel.toLowerCase()}e avec succès`, 'success');
            if (this.selectedTender()) {
              this.viewTenderDetails(this.selectedTender()!.id);
            }
            this.closeSubmissionModal();
          },
          error: (error) => {
            this.showNotification(`Erreur: ${error.message}`, 'error');
            this.isLoading.set(false);
          }
        });
      }
    );
  }

  /**
   * Obtenir la classe CSS du statut
   */
  getStatusClass(status: TenderStatus): string {
    switch (status) {
      case TenderStatus.DRAFT:
        return 'status-draft';
      case TenderStatus.PUBLISHED:
        return 'status-published';
      case TenderStatus.CLOSED:
        return 'status-closed';
      case TenderStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  /**
   * Obtenir le label du statut
   */
  getStatusLabel(status: TenderStatus): string {
    switch (status) {
      case TenderStatus.DRAFT:
        return 'BROUILLON';
      case TenderStatus.PUBLISHED:
        return 'PUBLIÉ';
      case TenderStatus.CLOSED:
        return 'CLÔTURÉ';
      case TenderStatus.CANCELLED:
        return 'ANNULÉ';
      default:
        return status;
    }
  }

  /**
   * Vérifier si un champ a une erreur
   */
  hasError(fieldName: string): boolean {
    const field = this.tenderForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtenir le message d'erreur d'un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.tenderForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    if (field.errors['min']) return `Valeur minimale: ${field.errors['min'].min}`;

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
   * Obtenir le nombre de tenders publiés
   */
  getPublishedCount(): number {
    return this.tenders().filter((t: TenderResponse) => t.status === TenderStatus.PUBLISHED).length;
  }

  /**
   * Obtenir le nombre de tenders en brouillon
   */
  getDraftCount(): number {
    return this.tenders().filter((t: TenderResponse) => t.status === TenderStatus.DRAFT).length;
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.authService.logout();
  }
}
