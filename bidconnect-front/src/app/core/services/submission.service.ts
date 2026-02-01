import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import {
  SubmissionResponse,
  SubmissionRequest,
  SubmissionStatus,
  StatusUpdateRequest
} from '../models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private http = inject(HttpClient);

  // Configuration
  private readonly GATEWAY_URL = 'http://localhost:8072';
  private readonly BASE_PATH = '/bindconnect/soumission-service/api/submissions';
  private readonly MOCK_MODE = true; // Mettre à false pour utiliser le vrai backend

  /**
   * Créer une nouvelle soumission
   */
  createSubmission(request: SubmissionRequest): Observable<SubmissionResponse> {
    if (this.MOCK_MODE) {
      return this.mockCreateSubmission(request);
    }

    /* CODE RÉEL (à décommenter quand le backend est prêt)
    const formData = new FormData();
    formData.append('tenderId', request.tenderId);
    formData.append('supplierId', request.supplierId);
    formData.append('price', request.price.toString());
    formData.append('technical', request.technical.toString());
    formData.append('deadline', request.deadline.toString());
    
    if (request.document) {
      formData.append('document', request.document, request.document.name);
    }

    return this.http.post<SubmissionResponse>(
      `${this.GATEWAY_URL}${this.BASE_PATH}`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
    */

    return this.mockCreateSubmission(request);
  }

  /**
   * Supprimer une soumission
   */
  deleteSubmission(id: string): Observable<void> {
    if (this.MOCK_MODE) {
      return this.mockDeleteSubmission(id);
    }

    /* CODE RÉEL
    return this.http.delete<void>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
    */

    return this.mockDeleteSubmission(id);
  }

  /**
   * Mettre à jour le statut d'une soumission
   */
  updateStatus(id: string, statusUpdate: StatusUpdateRequest): Observable<void> {
    if (this.MOCK_MODE) {
      return this.mockUpdateStatus(id, statusUpdate);
    }

    /* CODE RÉEL
    return this.http.patch<void>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}/status`,
      statusUpdate
    ).pipe(
      catchError(this.handleError)
    );
    */

    return this.mockUpdateStatus(id, statusUpdate);
  }

  /**
   * Récupérer une soumission par ID
   */
  getSubmissionById(id: string): Observable<SubmissionResponse> {
    if (this.MOCK_MODE) {
      return this.mockGetSubmissionById(id);
    }

    /* CODE RÉEL
    return this.http.get<SubmissionResponse>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
    */

    return this.mockGetSubmissionById(id);
  }

  /**
   * Récupérer toutes les soumissions
   */
  getAllSubmissions(): Observable<SubmissionResponse[]> {
    if (this.MOCK_MODE) {
      return this.mockGetAllSubmissions();
    }

    /* CODE RÉEL
    return this.http.get<SubmissionResponse[]>(
      `${this.GATEWAY_URL}${this.BASE_PATH}`
    ).pipe(
      catchError(this.handleError)
    );
    */

    return this.mockGetAllSubmissions();
  }

  /**
   * Récupérer les soumissions par appel d'offres
   */
  getSubmissionsByTender(tenderId: string): Observable<SubmissionResponse[]> {
    if (this.MOCK_MODE) {
      return this.mockGetSubmissionsByTender(tenderId);
    }

    /* CODE RÉEL
    return this.http.get<SubmissionResponse[]>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/tender/${tenderId}`
    ).pipe(
      catchError(this.handleError)
    );
    */

    return this.mockGetSubmissionsByTender(tenderId);
  }

  /**
   * Récupérer les soumissions par fournisseur
   */
  getSubmissionsBySupplier(supplierId: string): Observable<SubmissionResponse[]> {
    if (this.MOCK_MODE) {
      return this.mockGetSubmissionsBySupplier(supplierId);
    }

    /* CODE RÉEL
    return this.http.get<SubmissionResponse[]>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/supplier/${supplierId}`
    ).pipe(
      catchError(this.handleError)
    );
    */

    return this.mockGetSubmissionsBySupplier(supplierId);
  }

  // ============================================================
  // MÉTHODES MOCK (Données simulées)
  // ============================================================

  private mockCreateSubmission(request: SubmissionRequest): Observable<SubmissionResponse> {
    const mockResponse: SubmissionResponse = {
      id: `sub-${Date.now()}`,
      tenderId: request.tenderId,
      supplierId: request.supplierId,
      documentId: `doc-${Date.now()}`,
      status: SubmissionStatus.SUBMITTED,
      price: request.price,
      technical: request.technical,
      deadline: request.deadline,
      score: 0, // Score calculé plus tard
      ragAnalysis: null
    };

    return of(mockResponse).pipe(delay(800));
  }

  private mockDeleteSubmission(id: string): Observable<void> {
    console.log(`Mock: Deleting submission ${id}`);
    return of(void 0).pipe(delay(800));
  }

  private mockUpdateStatus(id: string, statusUpdate: StatusUpdateRequest): Observable<void> {
    console.log(`Mock: Updating submission ${id} status to ${statusUpdate.status}`);
    return of(void 0).pipe(delay(800));
  }

  private mockGetSubmissionById(id: string): Observable<SubmissionResponse> {
    const mockSubmission: SubmissionResponse = {
      id,
      tenderId: '1',
      supplierId: 'supplier-123',
      documentId: 'doc-456',
      status: SubmissionStatus.IN_EVALUATION,
      price: 85.5,
      technical: 92.0,
      deadline: 88.0,
      score: 88.35,
      ragAnalysis: 'Analyse IA: Cette soumission présente un excellent équilibre entre qualité technique et prix compétitif. Le délai proposé est réaliste.'
    };

    return of(mockSubmission).pipe(delay(800));
  }

  private mockGetAllSubmissions(): Observable<SubmissionResponse[]> {
    const mockSubmissions: SubmissionResponse[] = [
      {
        id: 'sub-001',
        tenderId: '1',
        supplierId: 'supplier-123',
        documentId: 'doc-001',
        status: SubmissionStatus.ACCEPTED,
        price: 85.5,
        technical: 92.0,
        deadline: 88.0,
        score: 88.35,
        ragAnalysis: 'Excellente proposition technique avec un prix compétitif.'
      },
      {
        id: 'sub-002',
        tenderId: '1',
        supplierId: 'supplier-456',
        documentId: 'doc-002',
        status: SubmissionStatus.IN_EVALUATION,
        price: 78.0,
        technical: 85.0,
        deadline: 90.0,
        score: 83.90,
        ragAnalysis: 'Bon rapport qualité-prix, délai très court.'
      },
      {
        id: 'sub-003',
        tenderId: '1',
        supplierId: 'supplier-789',
        documentId: 'doc-003',
        status: SubmissionStatus.REJECTED,
        price: 65.0,
        technical: 70.0,
        deadline: 75.0,
        score: 69.25,
        ragAnalysis: 'Proposition insuffisante sur les aspects techniques.'
      },
      {
        id: 'sub-004',
        tenderId: '2',
        supplierId: 'supplier-123',
        documentId: 'doc-004',
        status: SubmissionStatus.SUBMITTED,
        price: 90.0,
        technical: 95.0,
        deadline: 85.0,
        score: 90.50,
        ragAnalysis: null
      },
      {
        id: 'sub-005',
        tenderId: '2',
        supplierId: 'supplier-999',
        documentId: 'doc-005',
        status: SubmissionStatus.IN_EVALUATION,
        price: 88.0,
        technical: 88.0,
        deadline: 92.0,
        score: 88.80,
        ragAnalysis: 'Proposition équilibrée avec un excellent délai.'
      }
    ];

    return of(mockSubmissions).pipe(delay(800));
  }

  private mockGetSubmissionsByTender(tenderId: string): Observable<SubmissionResponse[]> {
    return this.mockGetAllSubmissions().pipe(
      delay(800),
      catchError(() => of([]))
    );
  }

  private mockGetSubmissionsBySupplier(supplierId: string): Observable<SubmissionResponse[]> {
    return this.mockGetAllSubmissions().pipe(
      delay(800),
      catchError(() => of([]))
    );
  }

  // ============================================================
  // GESTION DES ERREURS
  // ============================================================

  private handleError(error: any): Observable<never> {
    console.error('SubmissionService Error:', error);
    
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Données invalides';
          break;
        case 404:
          errorMessage = 'Soumission non trouvée';
          break;
        case 409:
          errorMessage = 'Soumission déjà existante pour cet appel d\'offres';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
