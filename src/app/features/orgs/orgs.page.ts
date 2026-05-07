import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrganizationContext } from '../../core/state/organization-context.service';
import { OrganizationService } from '../../core/state/organization.service';
import { Organization } from '../../core/state/organization.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="font-h1 text-h1 text-slate-900 tracking-tight">Organizaciones</h1>
        <p class="text-slate-500 mt-1">Administra las organizaciones y espacios de trabajo de tu empresa.</p>
      </div>
      <button class="bg-[#F53D0A] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
              (click)="showCreateModal.set(true)">
        <span class="material-symbols-outlined text-[18px]">add</span>
        Nueva Organización
      </button>
    </div>

    <!-- Org List -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div *ngIf="orgCtx.loading()" class="p-8 text-center text-slate-500">Cargando organizaciones...</div>
      
      <div *ngIf="!orgCtx.loading() && orgCtx.organizations().length === 0" class="p-12 text-center text-slate-500">
        <span class="material-symbols-outlined text-4xl mb-3 text-slate-300 block">domain_disabled</span>
        <p>Aún no perteneces a ninguna organización.</p>
        <button class="mt-4 text-[#F53D0A] font-medium hover:underline" (click)="showCreateModal.set(true)">Crea una ahora</button>
      </div>

      <table *ngIf="!orgCtx.loading() && orgCtx.organizations().length > 0" class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Sector</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4">Creado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr *ngFor="let org of orgCtx.organizations()" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-medium text-slate-900">{{ org.name }}</div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">ID: {{ org.id }}</div>
            </td>
            <td class="px-6 py-4 text-slate-600">{{ org.sector || '-' }}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800" *ngIf="org.active !== false">Activa</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800" *ngIf="org.active === false">Inactiva</span>
            </td>
            <td class="px-6 py-4 text-slate-500 text-sm">{{ org.createdAt | date:'mediumDate' }}</td>
            <td class="px-6 py-4 text-right">
              <button class="text-sm font-medium"
                      [class.text-slate-400]="orgCtx.activeOrganizationId() === org.id"
                      [class.text-[#F53D0A]]="orgCtx.activeOrganizationId() !== org.id"
                      [class.hover:underline]="orgCtx.activeOrganizationId() !== org.id"
                      [disabled]="orgCtx.activeOrganizationId() === org.id"
                      (click)="orgCtx.setActiveOrganizationId(org.id)">
                {{ orgCtx.activeOrganizationId() === org.id ? 'Activa' : 'Fijar Activa' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <div *ngIf="showCreateModal()" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-semibold text-slate-900 text-lg">Crear Organización</h3>
          <button class="text-slate-400 hover:text-slate-700" (click)="closeModal()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="createOrg()" class="p-6 flex flex-col gap-4">
          <div *ngIf="error()" class="p-3 bg-red-50 text-red-700 rounded-md text-sm">{{ error() }}</div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre de la Organización</label>
            <input type="text" name="name" [(ngModel)]="newOrg.name" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                   placeholder="ej. Acme Corp">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Sector</label>
            <input type="text" name="sector" [(ngModel)]="newOrg.sector" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                   placeholder="ej. Tecnología">
          </div>
          
          <div class="mt-4 flex justify-end gap-3">
            <button type="button" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md border border-slate-300" 
                    (click)="closeModal()">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-[#F53D0A] hover:bg-orange-600 rounded-md shadow-sm disabled:opacity-50"
                    [disabled]="creating() || !newOrg.name || !newOrg.sector">
              {{ creating() ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OrgsPage {
  readonly orgCtx = inject(OrganizationContext);
  private readonly orgsApi = inject(OrganizationService);

  readonly showCreateModal = signal(false);
  readonly creating = signal(false);
  readonly error = signal<string | null>(null);
  
  newOrg = { name: '', sector: '' };

  closeModal() {
    this.showCreateModal.set(false);
    this.newOrg = { name: '', sector: '' };
    this.error.set(null);
  }

  createOrg() {
    if (!this.newOrg.name || !this.newOrg.sector) return;
    
    this.creating.set(true);
    this.error.set(null);
    
    this.orgsApi.createOrganization(this.newOrg).subscribe({
      next: (org) => {
        // Reload organizations after creating
        this.orgCtx.loadOrganizations();
        // Since load is async, we optimistically set active org here if it's the first one
        if (this.orgCtx.organizations().length === 0) {
          this.orgCtx.setActiveOrganizationId(org.id);
        }
        this.closeModal();
      },
      error: (e) => {
        this.error.set(e instanceof Error ? e.message : 'Error creating organization');
        this.creating.set(false);
      },
      complete: () => {
        this.creating.set(false);
      }
    });
  }
}
