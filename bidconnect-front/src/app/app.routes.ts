import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/dashboards/admin/admin-dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'owner',
    loadComponent: () => import('./features/dashboards/owner/owner-dashboard').then(m => m.OwnerDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['OWNER'] }
  },
  {
    path: 'supplier',
    loadComponent: () => import('./features/dashboards/supplier/supplier-dashboard').then(m => m.SupplierDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['SUPPLIER'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];