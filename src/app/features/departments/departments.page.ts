import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrganizationContext } from '../../core/state/organization-context.service';
import { DepartmentService } from '../../core/state/department.service';
import { Department } from '../../core/state/department.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="font-h1 text-h1 text-slate-900 tracking-tight">Departamentos</h1>
        <p class="text-slate-500 mt-1">Administra las áreas operativas de <span class="font-semibold text-slate-700">{{ orgCtx.activeOrganization()?.name || 'tu organización' }}</span>.</p>
      </div>
      <button class="bg-[#F53D0A] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
              (click)="showCreateModal.set(true)"
              [disabled]="!orgCtx.activeOrganizationId()"
              [class.opacity-50]="!orgCtx.activeOrganizationId()">
        <span class="material-symbols-outlined text-[18px]">add</span>
        Nuevo Departamento
      </button>
    </div>

    <!-- Alert if no org selected -->
    <div *ngIf="!orgCtx.activeOrganizationId()" class="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 flex items-center gap-3 mb-6">
      <span class="material-symbols-outlined">warning</span>
      <p>Por favor, selecciona una organización activa en la barra superior para ver o crear departamentos.</p>
    </div>

    <!-- Departments List -->
    <div *ngIf="orgCtx.activeOrganizationId()" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div *ngIf="loading()" class="p-8 text-center text-slate-500">Cargando departamentos...</div>
      
      <div *ngIf="!loading() && departments().length === 0" class="p-12 text-center text-slate-500">
        <span class="material-symbols-outlined text-4xl mb-3 text-slate-300 block">corporate_fare</span>
        <p>No se encontraron departamentos en esta organización.</p>
        <button class="mt-4 text-[#F53D0A] font-medium hover:underline" (click)="showCreateModal.set(true)">Crea el primero</button>
      </div>

      <table *ngIf="!loading() && departments().length > 0" class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4">Creado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr *ngFor="let dept of departments()" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-medium text-slate-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-slate-400 text-lg">folder</span>
                {{ dept.name }}
              </div>
              <div class="text-xs text-slate-400 font-mono mt-0.5 ml-6">ID: {{ dept.id }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800" *ngIf="dept.active !== false">Activo</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800" *ngIf="dept.active === false">Inactivo</span>
            </td>
            <td class="px-6 py-4 text-slate-500 text-sm">{{ dept.createdAt | date:'mediumDate' }}</td>
            <td class="px-6 py-4 text-right">
              <!-- Edit/Delete actions could go here -->
              <button class="text-slate-400 hover:text-slate-700 transition-colors" title="Ajustes">
                <span class="material-symbols-outlined text-[18px]">settings</span>
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
          <h3 class="font-semibold text-slate-900 text-lg">Crear Departamento</h3>
          <button class="text-slate-400 hover:text-slate-700" (click)="closeModal()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="createDept()" class="p-6 flex flex-col gap-4">
          <div *ngIf="error()" class="p-3 bg-red-50 text-red-700 rounded-md text-sm">{{ error() }}</div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Departamento</label>
            <input type="text" name="name" [(ngModel)]="newDeptName" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                   placeholder="ej. Soporte TI">
          </div>
          
          <div class="mt-4 flex justify-end gap-3">
            <button type="button" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md border border-slate-300" 
                    (click)="closeModal()">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-[#F53D0A] hover:bg-orange-600 rounded-md shadow-sm disabled:opacity-50"
                    [disabled]="creating() || !newDeptName">
              {{ creating() ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class DepartmentsPage {
  readonly orgCtx = inject(OrganizationContext);
  private readonly deptsApi = inject(DepartmentService);

  readonly departments = signal<Department[]>([]);
  readonly loading = signal(false);
  
  readonly showCreateModal = signal(false);
  readonly creating = signal(false);
  readonly error = signal<string | null>(null);
  
  newDeptName = '';

  constructor() {
    effect(() => {
      const orgId = this.orgCtx.activeOrganizationId();
      if (orgId) {
        this.loadDepartments(orgId);
      } else {
        this.departments.set([]);
      }
    });
  }

  loadDepartments(orgId: string) {
    this.loading.set(true);
    this.deptsApi.listDepartments(orgId).subscribe({
      next: (depts) => this.departments.set(depts ?? []),
      error: () => this.departments.set([]),
      complete: () => this.loading.set(false)
    });
  }

  closeModal() {
    this.showCreateModal.set(false);
    this.newDeptName = '';
    this.error.set(null);
  }

  createDept() {
    const orgId = this.orgCtx.activeOrganizationId();
    if (!orgId || !this.newDeptName) return;
    
    this.creating.set(true);
    this.error.set(null);
    
    this.deptsApi.createDepartment({ name: this.newDeptName, organizationId: orgId }).subscribe({
      next: (dept) => {
        this.departments.update(list => [...list, dept]);
        this.closeModal();
      },
      error: (e) => {
        this.error.set(e instanceof Error ? e.message : 'Error creating department');
        this.creating.set(false);
      },
      complete: () => {
        this.creating.set(false);
      }
    });
  }
}
