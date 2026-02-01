/**
 * Modèles TypeScript pour le Submission Service
 * Basés sur les DTOs Java du backend
 */

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  IN_EVALUATION = 'IN_EVALUATION',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface SubmissionRequest {
  tenderId: string;
  supplierId: string;
  price: number;
  technical: number;
  deadline: number;
  document?: File;
}

export interface SubmissionResponse {
  id: string;
  tenderId: string;
  supplierId: string;
  documentId: string;
  status: SubmissionStatus;
  price: number;
  technical: number;
  deadline: number;
  score: number;
  ragAnalysis: string | null;
}

export interface StatusUpdateRequest {
  status: SubmissionStatus;
}
