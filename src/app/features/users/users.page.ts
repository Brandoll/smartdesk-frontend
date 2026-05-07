import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrganizationContext } from '../../core/state/organization-context.service';
import { MemberService } from '../../core/state/member.service';
import { DepartmentService } from '../../core/state/department.service';
import { Member, MEMBER_ROLES } from '../../core/state/member.models';
import { Department } from '../../core/state/department.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h1 class="font-h1 text-h1 text-slate-900 tracking-tight">Miembros de la Organización</h1>
        <p class="text-slate-500 mt-1">Administra los accesos y roles para <span class="font-semibold text-slate-700">{{ orgCtx.activeOrganization()?.name || 'tu organización' }}</span>.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative w-full sm:w-auto">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style="font-size: 18px;">search</span>
          <input class="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                 placeholder="Buscar miembros..." 
                 [value]="searchQuery()"
                 (input)="onSearchInput($event)" />
        </div>
        <button class="bg-[#F53D0A] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                (click)="openInviteModal()"
                [disabled]="!orgCtx.activeOrganizationId()"
                [class.opacity-50]="!orgCtx.activeOrganizationId()">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
          Invitar
        </button>
      </div>
    </div>

    <!-- Alert if no org selected -->
    <div *ngIf="!orgCtx.activeOrganizationId()" class="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 flex items-center gap-3 mb-6">
      <span class="material-symbols-outlined">warning</span>
      <p>Por favor, selecciona una organización activa en la barra superior para administrar los miembros.</p>
    </div>

    <!-- Members List -->
    <div *ngIf="orgCtx.activeOrganizationId()" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div *ngIf="loading()" class="p-8 text-center text-slate-500">Cargando miembros...</div>
      
      <div *ngIf="!loading() && filteredMembers().length === 0" class="p-12 text-center text-slate-500">
        <span class="material-symbols-outlined text-4xl mb-3 text-slate-300 block">group_off</span>
        <p>No se encontraron miembros con tu búsqueda.</p>
      </div>

      <div *ngIf="!loading() && filteredMembers().length > 0" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th class="px-6 py-4">Usuario</th>
              <th class="px-6 py-4">Rol</th>
              <th class="px-6 py-4">Departamento</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let member of filteredMembers()" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-300">
                    {{ initials(member.userName) }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-900">{{ member.userName }}</div>
                    <div class="text-sm text-slate-500">{{ member.userEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class.bg-purple-100]="member.role === 'OWNER'" [class.text-purple-800]="member.role === 'OWNER'"
                      [class.bg-blue-100]="member.role === 'ADMIN'" [class.text-blue-800]="member.role === 'ADMIN'"
                      [class.bg-orange-100]="member.role === 'AGENT'" [class.text-orange-800]="member.role === 'AGENT'"
                      [class.bg-slate-100]="member.role === 'MEMBER'" [class.text-slate-800]="member.role === 'MEMBER'">
                  {{ member.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600 text-sm">
                {{ member.departmentName || '-' }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
                      [class.bg-green-50]="member.userActive" [class.text-green-700]="member.userActive" [class.border-green-200]="member.userActive"
                      [class.bg-slate-50]="!member.userActive" [class.text-slate-600]="!member.userActive" [class.border-slate-200]="!member.userActive">
                  <span class="w-1.5 h-1.5 rounded-full" [class.bg-green-500]="member.userActive" [class.bg-slate-400]="!member.userActive"></span>
                  {{ member.userActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-[#F53D0A] transition-colors p-1" 
                        title="Editar Miembro"
                        (click)="openEditModal(member)">
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button class="text-slate-400 hover:text-red-600 transition-colors p-1 ml-2" 
                        title="Remover Miembro"
                        *ngIf="member.role !== 'OWNER'"
                        (click)="removeMember(member)">
                  <span class="material-symbols-outlined text-[20px]">person_remove</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between">
        <span>Total de miembros: {{ filteredMembers().length }}</span>
      </div>
    </div>

    <!-- Invite/Edit Modal -->
    <div *ngIf="showModal()" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-semibold text-slate-900 text-lg">{{ modalMode() === 'invite' ? 'Invitar Miembro' : 'Editar Miembro' }}</h3>
          <button class="text-slate-400 hover:text-slate-700" (click)="closeModal()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="submitModal()" class="p-6 flex flex-col gap-4">
          <div *ngIf="error()" class="p-3 bg-red-50 text-red-700 rounded-md text-sm">{{ error() }}</div>
          
          <div *ngIf="modalMode() === 'invite'">
            <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input type="email" name="email" [(ngModel)]="formData.email" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                   placeholder="usuario@ejemplo.com">
            <p class="mt-1 text-xs text-slate-500">El usuario ya debe estar registrado en el sistema.</p>
          </div>

          <div *ngIf="modalMode() === 'edit'" class="mb-2">
            <label class="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600 font-medium">
              {{ editingMember()?.userName }} ({{ editingMember()?.userEmail }})
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select name="role" [(ngModel)]="formData.role" required
                    class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm">
              <option *ngFor="let r of roles" [value]="r">{{ r }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Departamento (Opcional)</label>
            <select name="departmentId" [(ngModel)]="formData.departmentId"
                    class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm">
              <option [ngValue]="null">-- Sin Departamento --</option>
              <option *ngFor="let d of departments()" [value]="d.id">{{ d.name }}</option>
            </select>
          </div>
          
          <div class="mt-4 flex justify-end gap-3">
            <button type="button" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md border border-slate-300" 
                    (click)="closeModal()">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-[#F53D0A] hover:bg-orange-600 rounded-md shadow-sm disabled:opacity-50"
                    [disabled]="submitting() || (modalMode() === 'invite' && !formData.email)">
              {{ submitting() ? 'Guardando...' : (modalMode() === 'invite' ? 'Invitar' : 'Guardar Cambios') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UsersPage {
  readonly orgCtx = inject(OrganizationContext);
  private readonly membersApi = inject(MemberService);
  private readonly deptsApi = inject(DepartmentService);

  readonly roles = MEMBER_ROLES.filter(r => r !== 'OWNER'); // No se puede invitar a owners

  readonly members = signal<Member[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(false);
  readonly searchQuery = signal('');

  // Modal State
  readonly showModal = signal(false);
  readonly modalMode = signal<'invite' | 'edit'>('invite');
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly editingMember = signal<Member | null>(null);
  
  formData = {
    email: '',
    role: 'MEMBER',
    departmentId: null as string | null
  };

  readonly filteredMembers = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.members();
    if (!q) return list;
    return list.filter(m => 
      m.userName.toLowerCase().includes(q) || 
      m.userEmail.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      (m.departmentName && m.departmentName.toLowerCase().includes(q))
    );
  });

  constructor() {
    effect(() => {
      const orgId = this.orgCtx.activeOrganizationId();
      if (orgId) {
        this.loadData(orgId);
      } else {
        this.members.set([]);
        this.departments.set([]);
      }
    });
  }

  loadData(orgId: string) {
    this.loading.set(true);
    
    // Cargar departamentos primero para el combobox
    this.deptsApi.listDepartments(orgId).subscribe(depts => {
      this.departments.set(depts ?? []);
      
      // Luego cargar miembros
      this.membersApi.listMembers(orgId).subscribe({
        next: (members) => this.members.set(members ?? []),
        error: () => this.members.set([]),
        complete: () => this.loading.set(false)
      });
    });
  }

  onSearchInput(ev: Event) {
    this.searchQuery.set((ev.target as HTMLInputElement).value);
  }

  initials(name: string): string {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'U';
    return (parts[0][0] || 'U').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
  }

  // --- Modal Logic ---

  openInviteModal() {
    this.modalMode.set('invite');
    this.editingMember.set(null);
    this.formData = { email: '', role: 'MEMBER', departmentId: null };
    this.error.set(null);
    this.showModal.set(true);
  }

  openEditModal(member: Member) {
    this.modalMode.set('edit');
    this.editingMember.set(member);
    this.formData = { 
      email: member.userEmail, 
      role: member.role === 'OWNER' ? 'ADMIN' : member.role, // Forzar a un rol editable
      departmentId: member.departmentId || null 
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

    if (this.modalMode() === 'invite') {
      this.membersApi.inviteMember(orgId, {
        email: this.formData.email,
        role: this.formData.role,
        departmentId: this.formData.departmentId
      }).subscribe({
        next: (newMember) => {
          this.members.update(list => [...list, newMember]);
          this.closeModal();
        },
        error: (e) => this.handleError(e, 'Error inviting member. Are they registered?'),
        complete: () => this.submitting.set(false)
      });
    } else {
      const member = this.editingMember();
      if (!member) return;

      this.membersApi.updateMember(orgId, member.userId, {
        role: this.formData.role,
        departmentId: this.formData.departmentId
      }).subscribe({
        next: (updated) => {
          this.members.update(list => list.map(m => m.userId === updated.userId ? updated : m));
          this.closeModal();
        },
        error: (e) => this.handleError(e, 'Error updating member'),
        complete: () => this.submitting.set(false)
      });
    }
  }

  removeMember(member: Member) {
    const orgId = this.orgCtx.activeOrganizationId();
    if (!orgId || !confirm(`Are you sure you want to remove ${member.userName} from the organization?`)) return;

    this.membersApi.removeMember(orgId, member.userId).subscribe({
      next: () => {
        this.members.update(list => list.filter(m => m.userId !== member.userId));
      },
      error: (e) => alert('Error removing member: ' + (e instanceof Error ? e.message : 'Unknown error'))
    });
  }

  private handleError(e: unknown, defaultMsg: string) {
    this.error.set(e instanceof Error ? e.message : defaultMsg);
    this.submitting.set(false);
  }
}
