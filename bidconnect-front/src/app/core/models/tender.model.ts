/**
 * Modèles TypeScript pour le Tender Service
 * Basés sur les DTOs Java du backend
 */

export enum TenderStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum EvaluationCriterionType {
  PRICE = 'PRICE',
  TECHNICAL = 'TECHNICAL',
  DEADLINE = 'DEADLINE',
  EXPERIENCE = 'EXPERIENCE',
  QUALITY = 'QUALITY'
}

export interface EvaluationCriterionRequest {
  type: EvaluationCriterionType;
  weight: number;
}

export interface EvaluationCriterionResponse {
  id: number;
  type: EvaluationCriterionType;
  weight: number;
}

export interface TenderDocumentRefResponse {
  id: number;
  documentId: string;
  fileName: string;
  contentType: string;
  downloadUrl: string;
}

export interface TenderRequest {
  title: string;
  description: string;
  organizationId: number;
  ownerUserId: string;
  deadline: string; // Format: yyyy-MM-dd
  criteria: EvaluationCriterionRequest[];
}

export interface TenderResponse {
  id: number;
  title: string;
  description: string;
  organizationId: number;
  ownerUserId: string;
  status: TenderStatus;
  publicationDate: string | null;
  deadline: string;
  criteria: EvaluationCriterionResponse[];
  documents: TenderDocumentRefResponse[];
}

export interface TenderCreatePayload {
  data: TenderRequest;
  files?: File[];
}
