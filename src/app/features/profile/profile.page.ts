import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/state/user.service';
import { User } from '../../core/state/user.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8">
      <h1 class="font-h1 text-h1 text-slate-900 tracking-tight">Mi Perfil</h1>
      <p class="text-slate-500 mt-1">Administra tu información personal y preferencias.</p>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
      <div *ngIf="loading()" class="p-8 text-center text-slate-500">Cargando perfil...</div>
      
      <div *ngIf="error() && !user()" class="p-8 text-center">
        <div class="text-red-500 mb-2"><span class="material-symbols-outlined text-4xl">error</span></div>
        <p class="text-slate-700 font-medium">{{ error() }}</p>
        <button class="mt-4 text-[#F53D0A] font-medium hover:underline" (click)="loadProfile()">Intentar de nuevo</button>
      </div>

      <div *ngIf="user()" class="p-0">
        <!-- Header area -->
        <div class="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-5">
          <div class="w-20 h-20 rounded-full bg-[#F53D0A] text-white flex items-center justify-center font-bold text-3xl shadow-sm">
            {{ initials(user()?.name) }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-900">{{ user()?.name }}</h2>
            <div class="text-slate-500 flex items-center gap-1.5 mt-1">
              <span class="material-symbols-outlined text-[16px]">mail</span>
              {{ user()?.email }}
            </div>
          </div>
        </div>

        <!-- Form area -->
        <form (ngSubmit)="updateProfile()" class="p-6">
          <div *ngIf="successMsg()" class="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
            <span class="material-symbols-outlined">check_circle</span>
            {{ successMsg() }}
          </div>
          <div *ngIf="error() && user()" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
            <span class="material-symbols-outlined">error</span>
            {{ error() }}
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input type="text" name="name" [(ngModel)]="formData.name" required
                     class="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input type="email" [value]="user()?.email" disabled
                     class="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed">
              <p class="mt-1 text-xs text-slate-500">El correo electrónico no se puede cambiar directamente. Contacta a soporte si es necesario.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Estado de la Cuenta</label>
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class.bg-green-100]="user()?.active" [class.text-green-800]="user()?.active"
                      [class.bg-slate-100]="!user()?.active" [class.text-slate-800]="!user()?.active">
                  {{ user()?.active ? 'Activa' : 'Inactiva' }}
                </span>
                <span class="text-sm text-slate-500">Miembro desde {{ user()?.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" class="px-5 py-2.5 text-sm font-medium text-white bg-[#F53D0A] hover:bg-orange-600 rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-2"
                    [disabled]="saving() || !formData.name || formData.name === user()?.name">
              <span class="material-symbols-outlined text-[18px]" *ngIf="!saving()">save</span>
              <span class="material-symbols-outlined text-[18px] animate-spin" *ngIf="saving()">progress_activity</span>
              {{ saving() ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfilePage {
  private readonly userApi = inject(UserService);

  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);

  formData = { name: '' };

  constructor() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.error.set(null);
    this.userApi.getMe().subscribe({
      next: (u) => {
        this.user.set(u);
        this.formData.name = u.name;
      },
      error: (e) => {
        this.error.set(e instanceof Error ? e.message : 'No se pudo cargar el perfil');
      },
      complete: () => this.loading.set(false)
    });
  }

  updateProfile() {
    if (!this.formData.name) return;
    
    this.saving.set(true);
    this.error.set(null);
    this.successMsg.set(null);

    this.userApi.updateMe({ name: this.formData.name }).subscribe({
      next: (u) => {
        this.user.set(u);
        this.successMsg.set('Perfil actualizado exitosamente');
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (e) => {
        this.error.set(e instanceof Error ? e.message : 'Error al actualizar el perfil');
      },
      complete: () => this.saving.set(false)
    });
  }

  initials(name?: string): string {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'U';
    return (parts[0][0] || 'U').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
  }
}
