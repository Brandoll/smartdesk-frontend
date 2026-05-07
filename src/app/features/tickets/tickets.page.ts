import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationContext } from '../../core/state/organization-context.service';
import { TicketService } from '../../core/state/ticket.service';
import { DepartmentService } from '../../core/state/department.service';
import { Ticket } from '../../core/state/ticket.models';
import { Department } from '../../core/state/department.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h1 class="font-h1 text-h1 text-slate-900 tracking-tight">Cola de Tickets</h1>
        <p class="text-slate-500 mt-1">Administra las solicitudes para <span class="font-semibold text-slate-700">{{ orgCtx.activeOrganization()?.name || 'tu organización' }}</span>.</p>
      </div>
      <button class="bg-[#F53D0A] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
              (click)="openCreateModal()"
              [disabled]="!orgCtx.activeOrganizationId()"
              [class.opacity-50]="!orgCtx.activeOrganizationId()">
        <span class="material-symbols-outlined text-[18px]">add</span>
        Nuevo Ticket
      </button>
    </div>

    <!-- Alert if no org selected -->
    <div *ngIf="!orgCtx.activeOrganizationId()" class="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 flex items-center gap-3 mb-6">
      <span class="material-symbols-outlined">warning</span>
      <p>Por favor, selecciona una organización activa en la barra superior para ver los tickets.</p>
    </div>

    <!-- Tickets List -->
    <div *ngIf="orgCtx.activeOrganizationId()" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
      
      <!-- Filters Header -->
      <div class="p-3 border-b border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto">
        <button class="px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
                [class.bg-white]="filterStatus() === 'ALL'" [class.shadow-sm]="filterStatus() === 'ALL'" [class.text-slate-900]="filterStatus() === 'ALL'"
                [class.text-slate-500]="filterStatus() !== 'ALL'" [class.hover:bg-slate-200]="filterStatus() !== 'ALL'"
                (click)="filterStatus.set('ALL')">Todos los Tickets</button>
        <button class="px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
                [class.bg-white]="filterStatus() === 'OPEN'" [class.shadow-sm]="filterStatus() === 'OPEN'" [class.text-slate-900]="filterStatus() === 'OPEN'"
                [class.text-slate-500]="filterStatus() !== 'OPEN'" [class.hover:bg-slate-200]="filterStatus() !== 'OPEN'"
                (click)="filterStatus.set('OPEN')">Abiertos</button>
        <button class="px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
                [class.bg-white]="filterStatus() === 'IN_PROGRESS'" [class.shadow-sm]="filterStatus() === 'IN_PROGRESS'" [class.text-slate-900]="filterStatus() === 'IN_PROGRESS'"
                [class.text-slate-500]="filterStatus() !== 'IN_PROGRESS'" [class.hover:bg-slate-200]="filterStatus() !== 'IN_PROGRESS'"
                (click)="filterStatus.set('IN_PROGRESS')">En Progreso</button>
        <button class="px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
                [class.bg-white]="filterStatus() === 'RESOLVED'" [class.shadow-sm]="filterStatus() === 'RESOLVED'" [class.text-slate-900]="filterStatus() === 'RESOLVED'"
                [class.text-slate-500]="filterStatus() !== 'RESOLVED'" [class.hover:bg-slate-200]="filterStatus() !== 'RESOLVED'"
                (click)="filterStatus.set('RESOLVED')">Resueltos</button>
      </div>

      <!-- Loading / Empty States -->
      <div *ngIf="loading()" class="p-12 flex flex-col items-center justify-center flex-1 text-slate-500">
        <span class="material-symbols-outlined text-4xl animate-spin mb-3">progress_activity</span>
        <p>Cargando tickets...</p>
      </div>
      
      <div *ngIf="!loading() && filteredTickets().length === 0" class="p-12 flex flex-col items-center justify-center flex-1 text-slate-500">
        <span class="material-symbols-outlined text-5xl mb-4 text-slate-300">inbox</span>
        <p class="text-lg font-medium text-slate-700">No se encontraron tickets</p>
        <p class="text-sm mt-1">No hay tickets que coincidan con el filtro actual.</p>
        <button class="mt-4 text-[#F53D0A] font-medium hover:underline" *ngIf="filterStatus() === 'ALL'" (click)="openCreateModal()">Crea el primero</button>
        <button class="mt-4 text-[#F53D0A] font-medium hover:underline" *ngIf="filterStatus() !== 'ALL'" (click)="filterStatus.set('ALL')">Limpiar filtros</button>
      </div>

      <!-- Ticket Rows -->
      <div class="overflow-y-auto flex-1 bg-slate-50/30" *ngIf="!loading() && filteredTickets().length > 0">
        <div class="divide-y divide-slate-100">
          <div *ngFor="let t of filteredTickets()" 
               class="p-4 hover:bg-white transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center gap-4 border-l-4"
               [class.border-transparent]="t.priority !== 'CRITICAL' && t.priority !== 'HIGH'"
               [class.border-red-500]="t.priority === 'CRITICAL'"
               [class.border-orange-400]="t.priority === 'HIGH'"
               (click)="viewTicket(t)">
            
            <!-- Icon / Status -->
            <div class="hidden sm:flex shrink-0 w-10 h-10 rounded-full items-center justify-center border"
                 [class.bg-green-50]="t.status === 'RESOLVED'" [class.text-green-600]="t.status === 'RESOLVED'" [class.border-green-200]="t.status === 'RESOLVED'"
                 [class.bg-blue-50]="t.status === 'IN_PROGRESS'" [class.text-blue-600]="t.status === 'IN_PROGRESS'" [class.border-blue-200]="t.status === 'IN_PROGRESS'"
                 [class.bg-slate-100]="t.status === 'OPEN' || t.status === 'CLOSED'" [class.text-slate-600]="t.status === 'OPEN' || t.status === 'CLOSED'" [class.border-slate-200]="t.status === 'OPEN' || t.status === 'CLOSED'">
              <span class="material-symbols-outlined text-[20px]" *ngIf="t.status === 'OPEN'">mail</span>
              <span class="material-symbols-outlined text-[20px]" *ngIf="t.status === 'IN_PROGRESS'">pending</span>
              <span class="material-symbols-outlined text-[20px]" *ngIf="t.status === 'RESOLVED'">check</span>
              <span class="material-symbols-outlined text-[20px]" *ngIf="t.status === 'CLOSED'">archive</span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-xs text-slate-400">#{{ t.id.substring(0,8) }}</span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                      [class.bg-red-100]="t.priority === 'CRITICAL'" [class.text-red-800]="t.priority === 'CRITICAL'"
                      [class.bg-orange-100]="t.priority === 'HIGH'" [class.text-orange-800]="t.priority === 'HIGH'"
                      [class.bg-yellow-100]="t.priority === 'MEDIUM'" [class.text-yellow-800]="t.priority === 'MEDIUM'"
                      [class.bg-slate-100]="!t.priority || t.priority === 'LOW'" [class.text-slate-800]="!t.priority || t.priority === 'LOW'">
                  {{ t.priority || 'LOW' }}
                </span>
                <span class="text-xs text-slate-500 font-medium" *ngIf="t.departmentName">{{ t.departmentName }}</span>
              </div>
              <h3 class="text-slate-900 font-semibold truncate group-hover:text-primary transition-colors text-base">{{ t.title }}</h3>
              <p class="text-slate-500 text-sm truncate mt-0.5">De: {{ t.requesterName || 'Desconocido' }} • Actualizado {{ t.updatedAt | date:'short' }}</p>
            </div>
            
            <!-- Mobile badge -->
            <div class="sm:hidden absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700">
              {{ t.status }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Ticket Modal -->
    <div *ngIf="showModal()" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-semibold text-slate-900 text-lg">
            {{ modalMode() === 'create' ? 'Crear Nuevo Ticket' : 'Ticket #' + (selectedTicket()?.id?.substring(0,8) || '') }}
          </h3>
          <button class="text-slate-400 hover:text-slate-700" (click)="closeModal()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="submitModal()" class="flex flex-col overflow-hidden">
          <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            <div *ngIf="error()" class="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">{{ error() }}</div>
            
            <!-- READONLY VIEW FOR EXISTING TICKET -->
            <ng-container *ngIf="modalMode() === 'view' && selectedTicket() as ticket">
              <div>
                <h4 class="text-xl font-bold text-slate-900">{{ ticket.title }}</h4>
                <div class="text-sm text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>De: <span class="font-medium text-slate-700">{{ ticket.requesterName }}</span></span>
                  <span>Creado: {{ ticket.createdAt | date:'medium' }}</span>
                </div>
              </div>
              
              <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2 min-h-[100px] whitespace-pre-wrap text-sm text-slate-700">
                {{ ticket.description || 'No se proporcionó descripción.' }}
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 border border-slate-200 rounded-lg">
                <div>
                  <label class="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Estado</label>
                  <select name="status" [(ngModel)]="updateData.status"
                          class="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-primary">
                    <option value="OPEN">Abierto</option>
                    <option value="IN_PROGRESS">En Progreso</option>
                    <option value="RESOLVED">Resuelto</option>
                    <option value="CLOSED">Cerrado</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Prioridad</label>
                  <select name="priority" [(ngModel)]="updateData.priority"
                          class="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-primary">
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Departamento</label>
                  <select name="departmentId" [(ngModel)]="updateData.departmentId"
                          class="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-primary">
                    <option [ngValue]="null">-- Sin asignar --</option>
                    <option *ngFor="let d of departments()" [value]="d.id">{{ d.name }}</option>
                  </select>
                </div>
              </div>
            </ng-container>

            <!-- CREATE NEW TICKET FORM -->
            <ng-container *ngIf="modalMode() === 'create'">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Asunto / Título</label>
                <input type="text" name="title" [(ngModel)]="createData.title" required
                       class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                       placeholder="Breve resumen del problema">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Departamento (Opcional)</label>
                <select name="departmentId" [(ngModel)]="createData.departmentId"
                        class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm">
                  <option [ngValue]="null">-- Selecciona un departamento --</option>
                  <option *ngFor="let d of departments()" [value]="d.id">{{ d.name }}</option>
                </select>
              </div>

              <div class="flex-1 flex flex-col">
                <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea name="description" [(ngModel)]="createData.description" required
                          rows="6"
                          class="w-full flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm resize-none"
                          placeholder="Proporciona todos los detalles aquí..."></textarea>
              </div>
            </ng-container>
          </div>
          
          <!-- Actions footer -->
          <div class="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
            <button type="button" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md border border-slate-300" 
                    (click)="closeModal()">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-[#F53D0A] hover:bg-orange-600 rounded-md shadow-sm disabled:opacity-50"
                    [disabled]="submitting() || (modalMode() === 'create' && (!createData.title || !createData.description))">
              {{ submitting() ? 'Guardando...' : (modalMode() === 'create' ? 'Crear Ticket' : 'Guardar Cambios') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TicketsPage {
  readonly orgCtx = inject(OrganizationContext);
  private readonly ticketsApi = inject(TicketService);
  private readonly deptsApi = inject(DepartmentService);
  private readonly route = inject(ActivatedRoute);

  readonly tickets = signal<Ticket[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(false);
  readonly filterStatus = signal<string>('ALL');

  // Modal state
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'view'>('create');
  readonly selectedTicket = signal<Ticket | null>(null);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  createData = { title: '', description: '', departmentId: null as string | null };
  updateData = { status: 'OPEN', priority: 'LOW', departmentId: null as string | null };

  constructor() {
    effect(() => {
      const orgId = this.orgCtx.activeOrganizationId();
      if (orgId) {
        this.loadData(orgId);
      } else {
        this.tickets.set([]);
        this.departments.set([]);
      }
    });

    // Handle '?new=true' query param to auto-open modal
    this.route.queryParams.subscribe(params => {
      if (params['new'] === 'true' && this.orgCtx.activeOrganizationId()) {
        setTimeout(() => this.openCreateModal(), 500);
      }
    });
  }

  get filteredTickets() {
    return computed(() => {
      const all = this.tickets();
      const status = this.filterStatus();
      if (status === 'ALL') return all;
      return all.filter(t => t.status === status);
    });
  }

  loadData(orgId: string) {
    this.loading.set(true);
    
    // Load departments for assignment dropdowns
    this.deptsApi.listDepartments(orgId).subscribe(depts => {
      this.departments.set(depts ?? []);
      
      // Load tickets
      this.ticketsApi.listTickets(orgId).subscribe({
        next: (t) => this.tickets.set(t ?? []),
        error: () => this.tickets.set([]),
        complete: () => this.loading.set(false)
      });
    });
  }

  openCreateModal() {
    this.modalMode.set('create');
    this.selectedTicket.set(null);
    this.createData = { title: '', description: '', departmentId: null };
    this.error.set(null);
    this.showModal.set(true);
  }

  viewTicket(ticket: Ticket) {
    this.modalMode.set('view');
    this.selectedTicket.set(ticket);
    this.updateData = { 
      status: ticket.status || 'OPEN', 
      priority: ticket.priority || 'LOW', 
      departmentId: ticket.departmentId || null 
    };
    this.error.set(null);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  submitModal() {
    const orgId = this.orgCtx.activeOrganizationId();
    if (!orgId) return;

    this.submitting.set(true);
    this.error.set(null);

    if (this.modalMode() === 'create') {
      this.ticketsApi.createTicket(orgId, this.createData).subscribe({
        next: (newTicket) => {
          this.tickets.update(list => [newTicket, ...list]);
          this.closeModal();
        },
        error: (e) => this.error.set(e instanceof Error ? e.message : 'Error creating ticket'),
        complete: () => this.submitting.set(false)
      });
    } else {
      const ticket = this.selectedTicket();
      if (!ticket) return;

      this.ticketsApi.updateTicket(ticket.id, this.updateData).subscribe({
        next: (updatedTicket) => {
          this.tickets.update(list => list.map(t => t.id === updatedTicket.id ? updatedTicket : t));
          this.closeModal();
        },
        error: (e) => this.error.set(e instanceof Error ? e.message : 'Error updating ticket'),
        complete: () => this.submitting.set(false)
      });
    }
  }
}
