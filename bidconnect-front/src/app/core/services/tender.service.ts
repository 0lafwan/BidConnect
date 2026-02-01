import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';
import {
  TenderResponse,
  TenderRequest,
  TenderCreatePayload,
  TenderStatus,
  EvaluationCriterionResponse,
  EvaluationCriterionType
} from '../models/tender.model';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  private http = inject(HttpClient);

  // Configuration
  private readonly GATEWAY_URL = ''; // Empty for proxy to handle
  private readonly BASE_PATH = '/bindconnect/tender-service/api/v1/tenders';
  private readonly MOCK_MODE = false; // Mettre à false pour utiliser le vrai backend

  /**
   * Créer un nouvel appel d'offres
   */
  createTender(payload: TenderCreatePayload): Observable<TenderResponse> {
    if (this.MOCK_MODE) {
      return this.mockCreateTender(payload);
    }

    const formData = new FormData();

    // Ajouter les données JSON
    formData.append('data', JSON.stringify(payload.data));

    // Ajouter les fichiers si présents
    if (payload.files && payload.files.length > 0) {
      payload.files.forEach(file => {
        formData.append('files', file, file.name);
      });
    }

    // DEBUG: Log payload
    console.log('Sending Create Tender Payload:', JSON.stringify(payload.data));
    if (payload.files) console.log('Files count:', payload.files.length);

    return this.http.post<TenderResponse>(
      `${this.GATEWAY_URL}${this.BASE_PATH}`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mettre à jour un appel d'offres
   */
  updateTender(id: number, data: TenderRequest): Observable<TenderResponse> {
    if (this.MOCK_MODE) {
      return this.mockUpdateTender(id, data);
    }

    return this.http.put<TenderResponse>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprimer un appel d'offres
   */
  deleteTender(id: number): Observable<string> {
    if (this.MOCK_MODE) {
      return this.mockDeleteTender(id);
    }

    return this.http.delete(`${this.GATEWAY_URL}${this.BASE_PATH}/${id}`, {
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer un appel d'offres par ID
   */
  getTenderById(id: number): Observable<TenderResponse> {
    if (this.MOCK_MODE) {
      return this.mockGetTenderById(id);
    }

    return this.http.get<TenderResponse>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer tous les appels d'offres
   */
  getAllTenders(): Observable<TenderResponse[]> {
    if (this.MOCK_MODE) {
      return this.mockGetAllTenders();
    }

    return this.http.get<TenderResponse[]>(
      `${this.GATEWAY_URL}${this.BASE_PATH}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer les appels d'offres par organisation
   */
  getTendersByOrganization(orgId: number): Observable<TenderResponse[]> {
    if (this.MOCK_MODE) {
      return this.mockGetTendersByOrganization(orgId);
    }

    return this.http.get<TenderResponse[]>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/organization/${orgId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer les appels d'offres par propriétaire
   */
  getTendersByOwner(ownerId: string): Observable<TenderResponse[]> {
    if (this.MOCK_MODE) {
      return this.mockGetTendersByOwner(ownerId);
    }

    // WORKAROUND: Client-side filtering because backend endpoint fails without user-service
    return this.getAllTenders().pipe(
      map(tenders => tenders ? tenders.filter(t => t.ownerUserId === ownerId) : [])
    );
  }

  /**
   * Publier un appel d'offres
   */
  publishTender(id: number): Observable<TenderResponse> {
    if (this.MOCK_MODE) {
      return this.mockPublishTender(id);
    }

    return this.http.patch<TenderResponse>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}/publish`,
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Clôturer un appel d'offres
   */
  closeTender(id: number): Observable<TenderResponse> {
    if (this.MOCK_MODE) {
      return this.mockCloseTender(id);
    }

    return this.http.patch<TenderResponse>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}/close`,
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer les critères d'évaluation d'un appel d'offres
   */
  getTenderCriteria(id: number): Observable<EvaluationCriterionResponse[]> {
    if (this.MOCK_MODE) {
      return this.mockGetTenderCriteria(id);
    }

    return this.http.get<EvaluationCriterionResponse[]>(
      `${this.GATEWAY_URL}${this.BASE_PATH}/${id}/criteria`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // MÉTHODES MOCK (Données simulées)
  // ============================================================

  private mockCreateTender(payload: TenderCreatePayload): Observable<TenderResponse> {
    const mockResponse: TenderResponse = {
      id: Math.floor(Math.random() * 1000) + 1,
      title: payload.data.title,
      description: payload.data.description,
      organizationId: payload.data.organizationId,
      ownerUserId: payload.data.ownerUserId,
      status: TenderStatus.DRAFT,
      publicationDate: null,
      deadline: payload.data.deadline,
      criteria: payload.data.criteria.map((c, index) => ({
        id: index + 1,
        type: c.type,
        weight: c.weight
      })),
      documents: payload.files ? payload.files.map((file, index) => ({
        id: index + 1,
        documentId: `doc-${Date.now()}-${index}`,
        fileName: file.name,
        contentType: file.type,
        downloadUrl: `/api/documents/download/doc-${Date.now()}-${index}`
      })) : []
    };

    return of(mockResponse).pipe(delay(800));
  }

  private mockUpdateTender(id: number, data: TenderRequest): Observable<TenderResponse> {
    const mockResponse: TenderResponse = {
      id,
      title: data.title,
      description: data.description,
      organizationId: data.organizationId,
      ownerUserId: data.ownerUserId,
      status: TenderStatus.DRAFT,
      publicationDate: null,
      deadline: data.deadline,
      criteria: data.criteria.map((c, index) => ({
        id: index + 1,
        type: c.type,
        weight: c.weight
      })),
      documents: []
    };

    return of(mockResponse).pipe(delay(800));
  }

  private mockDeleteTender(id: number): Observable<string> {
    return of(`Tender ${id} deleted successfully`).pipe(delay(800));
  }

  private mockGetTenderById(id: number): Observable<TenderResponse> {
    const mockTender: TenderResponse = {
      id,
      title: 'Construction du Nouveau Pont',
      description: 'Projet de construction d\'un pont moderne reliant les deux rives de la ville. Le projet inclut la conception, la construction et la maintenance pendant 2 ans.',
      organizationId: 1,
      ownerUserId: '1',
      status: TenderStatus.PUBLISHED,
      publicationDate: '2026-01-15',
      deadline: '2026-03-31',
      criteria: [
        { id: 1, type: EvaluationCriterionType.PRICE, weight: 40 },
        { id: 2, type: EvaluationCriterionType.TECHNICAL_QUALITY, weight: 35 },
        { id: 3, type: EvaluationCriterionType.DELIVERY_TIME, weight: 25 }
      ],
      documents: [
        {
          id: 1,
          documentId: 'doc-123',
          fileName: 'cahier-des-charges.pdf',
          contentType: 'application/pdf',
          downloadUrl: '/api/documents/download/doc-123'
        }
      ]
    };

    return of(mockTender).pipe(delay(800));
  }

  private mockGetAllTenders(): Observable<TenderResponse[]> {
    const mockTenders: TenderResponse[] = [
      {
        id: 1,
        title: 'Construction du Nouveau Pont',
        description: 'Projet de construction d\'un pont moderne',
        organizationId: 1,
        ownerUserId: '1',
        status: TenderStatus.PUBLISHED,
        publicationDate: '2026-01-15',
        deadline: '2026-03-31',
        criteria: [
          { id: 1, type: EvaluationCriterionType.PRICE, weight: 40 },
          { id: 2, type: EvaluationCriterionType.TECHNICAL_QUALITY, weight: 35 },
          { id: 3, type: EvaluationCriterionType.DELIVERY_TIME, weight: 25 }
        ],
        documents: []
      },
      {
        id: 2,
        title: 'Rénovation de l\'Hôpital Central',
        description: 'Rénovation complète des infrastructures hospitalières',
        organizationId: 1,
        ownerUserId: '1',
        status: TenderStatus.PUBLISHED,
        publicationDate: '2026-01-20',
        deadline: '2026-04-15',
        criteria: [
          { id: 4, type: EvaluationCriterionType.PRICE, weight: 30 },
          { id: 5, type: EvaluationCriterionType.TECHNICAL_QUALITY, weight: 40 },
          { id: 6, type: EvaluationCriterionType.TECHNICAL_QUALITY, weight: 30 }
        ],
        documents: []
      },
      {
        id: 3,
        title: 'Développement Logiciel ERP',
        description: 'Développement d\'un système ERP sur mesure',
        organizationId: 2,
        ownerUserId: '2',
        status: TenderStatus.DRAFT,
        publicationDate: null,
        deadline: '2026-05-01',
        criteria: [
          { id: 7, type: EvaluationCriterionType.TECHNICAL_QUALITY, weight: 50 },
          { id: 8, type: EvaluationCriterionType.PRICE, weight: 30 },
          { id: 9, type: EvaluationCriterionType.DELIVERY_TIME, weight: 20 }
        ],
        documents: []
      }
    ];

    return of(mockTenders).pipe(delay(800));
  }

  private mockGetTendersByOrganization(orgId: number): Observable<TenderResponse[]> {
    return this.mockGetAllTenders().pipe(
      delay(800),
      catchError(() => of([]))
    );
  }

  private mockGetTendersByOwner(ownerId: string): Observable<TenderResponse[]> {
    return this.mockGetAllTenders().pipe(
      delay(800),
      catchError(() => of([]))
    );
  }

  private mockPublishTender(id: number): Observable<TenderResponse> {
    return this.mockGetTenderById(id).pipe(
      delay(800),
      catchError(() => throwError(() => new Error('Tender not found')))
    );
  }

  private mockCloseTender(id: number): Observable<TenderResponse> {
    return this.mockGetTenderById(id).pipe(
      delay(800),
      catchError(() => throwError(() => new Error('Tender not found')))
    );
  }

  private mockGetTenderCriteria(id: number): Observable<EvaluationCriterionResponse[]> {
    const mockCriteria: EvaluationCriterionResponse[] = [
      { id: 1, type: EvaluationCriterionType.PRICE, weight: 40 },
      { id: 2, type: EvaluationCriterionType.TECHNICAL_QUALITY, weight: 35 },
      { id: 3, type: EvaluationCriterionType.DELIVERY_TIME, weight: 25 }
    ];

    return of(mockCriteria).pipe(delay(800));
  }

  // ============================================================
  // GESTION DES ERREURS
  // ============================================================

  private handleError(error: any): Observable<never> {
    console.error('TenderService Error:', error);

    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Données invalides';
          break;
        case 404:
          errorMessage = 'Appel d\'offres non trouvé';
          break;
        case 500:
          // Backend uses 'errorMessage' field in ErrorResponseDto
          const backendMsg = error.error?.errorMessage || error.error?.message;
          errorMessage = backendMsg ? `Erreur serveur: ${backendMsg}` : 'Erreur serveur (détails manquants)';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
