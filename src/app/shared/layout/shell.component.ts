import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { OrganizationContext } from '../../core/state/organization-context.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] text-on-surface font-body-md text-body-md antialiased overflow-x-hidden">
      <!-- Sidebar -->
      <nav class="h-screen w-64 fixed left-0 top-0 border-r border-slate-200 bg-slate-50 flex flex-col py-6 px-4 z-20 transition-transform lg:translate-x-0"
           [class.-translate-x-full]="!mobileNavOpen()"
           [class.translate-x-0]="mobileNavOpen()">
        
        <div class="flex items-center justify-between mb-8 px-2">
          <div class="flex items-center gap-3">
            <img src="/SmartDesk.png" alt="SmartDesk Logo" class="w-8 h-8 object-contain" />
            <div>
              <div class="text-xl font-bold text-slate-900 font-h2 text-h2 leading-none">SmartDesk</div>
              <div class="text-slate-500 font-label-sm text-label-sm mt-1">Consola de Administración</div>
            </div>
          </div>
          <button class="lg:hidden p-1 text-slate-500 hover:text-slate-900" (click)="mobileNavOpen.set(false)">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <button
          class="mb-6 w-full bg-[#F53D0A] text-white rounded-lg py-2.5 px-4 font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors duration-200 shadow-sm"
          type="button"
          routerLink="/tickets"
          [queryParams]="{ new: true }"
        >
          <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
          Nuevo Ticket
        </button>

        <div class="flex-1 flex flex-col gap-1 overflow-y-auto">
          <!-- TODO: Dashboard -->
          
          <a class="flex items-center gap-3 px-3 py-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium" 
             routerLink="/tickets" routerLinkActive="text-[#F53D0A] bg-orange-50 font-semibold" [routerLinkActiveOptions]="{exact: false}">
            <span class="material-symbols-outlined" style="font-size: 20px;">confirmation_number</span>
            Tickets
          </a>

          <a class="flex items-center gap-3 px-3 py-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium" 
             routerLink="/departments" routerLinkActive="text-[#F53D0A] bg-orange-50 font-semibold" [routerLinkActiveOptions]="{exact: false}">
            <span class="material-symbols-outlined" style="font-size: 20px;">corporate_fare</span>
            Departamentos
          </a>

          <a class="flex items-center gap-3 px-3 py-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium" 
             routerLink="/users" routerLinkActive="text-[#F53D0A] bg-orange-50 font-semibold" [routerLinkActiveOptions]="{exact: false}">
            <span class="material-symbols-outlined" style="font-size: 20px;">group</span>
            Miembros
          </a>
          
          <a class="flex items-center gap-3 px-3 py-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium" 
             routerLink="/orgs" routerLinkActive="text-[#F53D0A] bg-orange-50 font-semibold" [routerLinkActiveOptions]="{exact: false}">
            <span class="material-symbols-outlined" style="font-size: 20px;">domain</span>
            Organizaciones
          </a>
        </div>
      </nav>

      <!-- Mobile Backdrop -->
      <div *ngIf="mobileNavOpen()" 
           class="fixed inset-0 bg-slate-900/50 z-10 lg:hidden" 
           (click)="mobileNavOpen.set(false)"></div>

      <!-- Header -->
      <header class="fixed top-0 right-0 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center h-16 px-4 sm:px-8 w-full lg:w-[calc(100%-16rem)] z-10 transition-all duration-200">
        <div class="flex items-center gap-4">
          <button class="lg:hidden p-1 text-slate-500 hover:text-slate-900" (click)="mobileNavOpen.set(true)">
            <span class="material-symbols-outlined">menu</span>
          </button>
          
          <div class="relative w-64 hidden sm:block">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style="font-size: 18px;">search</span>
            <input class="w-full pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Buscar..." type="text" />
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <div class="flex items-center gap-2">
            <span class="hidden sm:inline text-slate-500 text-sm">Org:</span>
            <select class="bg-white border border-slate-200 rounded-md px-2 py-1 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary max-w-[120px] sm:max-w-xs"
                    [ngModel]="orgCtx.activeOrganizationId()"
                    (ngModelChange)="orgCtx.setActiveOrganizationId($event)">
              <option [ngValue]="null" *ngIf="!orgCtx.organizations().length">Cargando...</option>
              <option *ngFor="let o of orgCtx.organizations()" [ngValue]="o.id">{{ o.name }}</option>
            </select>
          </div>
          
          <div class="w-px h-4 bg-slate-200 mx-1 sm:mx-2 hidden sm:block"></div>
          
          <a routerLink="/profile" class="text-slate-500 hover:text-slate-900 transition-colors flex items-center" title="Perfil">
            <span class="material-symbols-outlined" style="font-size: 20px;">account_circle</span>
          </a>
          
          <button class="text-slate-500 hover:text-slate-900 transition-colors flex items-center" type="button" (click)="logout()" title="Cerrar sesión">
            <span class="material-symbols-outlined" style="font-size: 20px;">logout</span>
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="lg:ml-64 min-h-screen pt-24 px-4 pb-4 sm:pt-28 lg:pt-32 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto w-full">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class ShellComponent {
  readonly orgCtx = inject(OrganizationContext);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mobileNavOpen = signal(false);

  constructor() {
    this.orgCtx.loadOrganizations();
    
    // Close mobile nav on route change
    effect(() => {
      // Just accessing something to trigger effect, actual route listening would be better
      // but for simplicity in signal context:
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
