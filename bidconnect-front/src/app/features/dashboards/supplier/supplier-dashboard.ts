import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-brutal-black text-white p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold mb-2" style="font-family: 'Space Grotesk', sans-serif;">
              SUPPLIER DASHBOARD
            </h1>
            <p class="text-white/60">Bienvenue, {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
          </div>
          <button
            (click)="logout()"
            class="px-6 py-3 border border-white hover:bg-white hover:text-brutal-black transition-all duration-300"
          >
            DÉCONNEXION
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white/5 border border-white/10 p-6">
            <h3 class="text-xl font-bold mb-2">Appels d'offres disponibles</h3>
            <p class="text-3xl font-bold text-brutal-accent">24</p>
          </div>
          <div class="bg-white/5 border border-white/10 p-6">
            <h3 class="text-xl font-bold mb-2">Mes Soumissions</h3>
            <p class="text-3xl font-bold text-brutal-neon">8</p>
          </div>
          <div class="bg-white/5 border border-white/10 p-6">
            <h3 class="text-xl font-bold mb-2">Soumissions acceptées</h3>
            <p class="text-3xl font-bold">3</p>
          </div>
        </div>

        <div class="mt-8 bg-white/5 border border-white/10 p-6">
          <h2 class="text-2xl font-bold mb-4">Informations du compte</h2>
          <div class="space-y-2 text-white/80">
            <p><strong>Email:</strong> {{ currentUser()?.email }}</p>
            <p><strong>Rôle:</strong> {{ currentUser()?.role }}</p>
            <p><strong>ID:</strong> {{ currentUser()?.id }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SupplierDashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
