import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { LoginCredentials, LoginResponse, User, UserRole, DecodedToken } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Configuration
  private readonly API_URL = 'http://localhost:8072/api/auth';
  private readonly TOKEN_KEY = 'bidconnect_token';
  private readonly USER_KEY = 'bidconnect_user';
  private readonly MOCK_MODE = true; // Mettre à false quand le backend est prêt

  // State management avec Signals
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  private isLoadingSignal = signal<boolean>(false);

  // Public computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);

  constructor() {
    // Vérifier si le token est expiré au démarrage
    this.checkTokenExpiration();
  }

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    this.isLoadingSignal.set(true);

    // MODE MOCK pour tester l'UI
    if (this.MOCK_MODE) {
      return this.mockLogin(credentials);
    }

    // MODE PRODUCTION
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleLoginSuccess(response)),
      catchError(error => this.handleError(error)),
      tap(() => this.isLoadingSignal.set(false))
    );
  }

  /**
   * Mock login pour tester l'UI sans backend
   */
  private mockLogin(credentials: LoginCredentials): Observable<LoginResponse> {
    // Simuler un délai réseau
    return of({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        role: this.getMockRole(credentials.email)
      }
    }).pipe(
      delay(800), // Simuler latence réseau
      tap(response => this.handleLoginSuccess(response)),
      tap(() => this.isLoadingSignal.set(false))
    );
  }

  /**
   * Détermine le rôle basé sur l'email (pour le mock)
   */
  private getMockRole(email: string): UserRole {
    if (email.includes('admin')) return 'ADMIN';
    if (email.includes('owner')) return 'OWNER';
    return 'SUPPLIER';
  }

  /**
   * Gestion du succès de connexion
   */
  private handleLoginSuccess(response: LoginResponse): void {
    // Stocker le token et l'utilisateur
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    // Mettre à jour le signal
    this.currentUserSignal.set(response.user);

    // Rediriger selon le rôle
    this.redirectByRole(response.user.role);
  }

  /**
   * Redirection basée sur le rôle
   */
  private redirectByRole(role: UserRole): void {
    const routes: Record<UserRole, string> = {
      ADMIN: '/admin',
      OWNER: '/owner',
      SUPPLIER: '/supplier'
    };

    this.router.navigate([routes[role]]);
  }

  /**
   * Déconnexion
   */
  logout(): void {
    // Nettoyer le storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Réinitialiser le state
    this.currentUserSignal.set(null);

    // Rediriger vers login
    this.router.navigate(['/login']);
  }

  /**
   * Récupérer le token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Récupérer l'utilisateur depuis le storage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Vérifier si le token est expiré
   */
  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = this.decodeToken(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        // Token expiré
        this.logout();
      }
    } catch {
      // Token invalide
      this.logout();
    }
  }

  /**
   * Décoder le JWT (simple, sans librairie)
   */
  private decodeToken(token: string): DecodedToken {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  /**
   * Vérifier si l'utilisateur a l'un des rôles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.currentUserSignal()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.isLoadingSignal.set(false);

    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 401:
          errorMessage = 'Email ou mot de passe incorrect';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Service non disponible';
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
