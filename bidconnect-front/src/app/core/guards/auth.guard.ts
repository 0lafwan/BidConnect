import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Guard pour protéger les routes authentifiées
 */
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est authentifié
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Vérifier les rôles requis si spécifiés dans la route
  const requiredRoles = route.data['roles'] as UserRole[] | undefined;
  
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authService.hasAnyRole(requiredRoles)) {
      // Rediriger vers la page appropriée selon le rôle
      const userRole = authService.userRole();
      if (userRole) {
        router.navigate([`/${userRole.toLowerCase()}`]);
      } else {
        router.navigate(['/login']);
      }
      return false;
    }
  }

  return true;
};

/**
 * Guard pour rediriger les utilisateurs déjà connectés
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si déjà connecté, rediriger vers le dashboard approprié
  if (authService.isAuthenticated()) {
    const role = authService.userRole();
    if (role) {
      router.navigate([`/${role.toLowerCase()}`]);
    }
    return false;
  }

  return true;
};
