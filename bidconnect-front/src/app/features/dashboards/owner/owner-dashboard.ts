import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TenderService } from '../../../core/services/tender.service';
import { TenderResponse, TenderStatus, TenderCreatePayload, EvaluationCriterionType } from '../../../core/models/tender.model';
import gsap from 'gsap';

type ViewState = 'LIST' | 'CREATE';

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
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private isBrowser: boolean;

  // Signals
  currentUser = this.authService.currentUser;
  viewState = signal<ViewState>('LIST');
  isLoading = signal(false);
  tenders = signal<TenderResponse[]>([]);
  errorMessage = signal<string | null>(null);

  // Formulaire
  tenderForm!: FormGroup;

  // Enum pour le template
  TenderStatus = TenderStatus;

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
      budget: ['', [Validators.required, Validators.min(0)]]
    });
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
    this.tenderForm.reset();
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
    this.errorMessage.set(null);
  }

  /**
   * Soumettre le formulaire
   */
  onSubmit(): void {
    if (this.tenderForm.invalid) {
      this.markFormGroupTouched(this.tenderForm);
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
          { type: EvaluationCriterionType.PRICE, weight: 40 },
          { type: EvaluationCriterionType.TECHNICAL, weight: 35 },
          { type: EvaluationCriterionType.DEADLINE, weight: 25 }
        ]
      }
    };

    this.tenderService.createTender(payload).subscribe({
      next: (tender) => {
        this.isLoading.set(false);
        this.switchToList();
        this.loadTenders();
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Publier un appel d'offres
   */
  publishTender(id: number, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('Voulez-vous publier cet appel d\'offres ?')) {
      return;
    }

    this.tenderService.publishTender(id).subscribe({
      next: () => {
        this.loadTenders();
      },
      error: (error) => {
        alert(`Erreur: ${error.message}`);
      }
    });
  }

  /**
   * Clôturer un appel d'offres
   */
  closeTender(id: number, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('Voulez-vous clôturer cet appel d\'offres ?')) {
      return;
    }

    this.tenderService.closeTender(id).subscribe({
      next: () => {
        this.loadTenders();
      },
      error: (error) => {
        alert(`Erreur: ${error.message}`);
      }
    });
  }

  /**
   * Supprimer un appel d'offres
   */
  deleteTender(id: number, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('Voulez-vous vraiment supprimer cet appel d\'offres ?')) {
      return;
    }

    this.tenderService.deleteTender(id).subscribe({
      next: () => {
        this.loadTenders();
      },
      error: (error) => {
        alert(`Erreur: ${error.message}`);
      }
    });
  }

  /**
   * Voir les détails d'un tender
   */
  viewTenderDetails(id: number): void {
    // TODO: Naviguer vers la page de détails
    console.log('View tender details:', id);
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
    return this.tenders().filter(t => t.status === TenderStatus.PUBLISHED).length;
  }

  /**
   * Obtenir le nombre de tenders en brouillon
   */
  getDraftCount(): number {
    return this.tenders().filter(t => t.status === TenderStatus.DRAFT).length;
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.authService.logout();
  }
}
