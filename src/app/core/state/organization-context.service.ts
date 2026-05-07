import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from './organization.service';
import { Organization } from './organization.models';

const ACTIVE_ORG_KEY = 'smartdesk.activeOrgId';

@Injectable({ providedIn: 'root' })
export class OrganizationContext {
  private readonly orgsApi = inject(OrganizationService);
  private readonly router = inject(Router);

  readonly organizations = signal<Organization[]>([]);
  readonly loading = signal(false);
  readonly activeOrganizationId = signal<string | null>(localStorage.getItem(ACTIVE_ORG_KEY));
  readonly activeOrganization = computed(() => {
    const id = this.activeOrganizationId();
    return this.organizations().find((o) => o.id === id) ?? null;
  });

  setActiveOrganizationId(id: string | null): void {
    this.activeOrganizationId.set(id);
    if (!id) localStorage.removeItem(ACTIVE_ORG_KEY);
    else localStorage.setItem(ACTIVE_ORG_KEY, id);
  }

  loadOrganizations(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.orgsApi.listMyOrganizations().subscribe({
      next: (orgs) => {
        this.organizations.set(orgs ?? []);
        if (!this.activeOrganizationId() && orgs?.length) {
          this.setActiveOrganizationId(orgs[0].id);
        }
        
        // Auto-redirect to orgs page if user has NO organizations
        if (!orgs || orgs.length === 0) {
          this.router.navigate(['/orgs']);
        }
      },
      error: () => {
        this.organizations.set([]);
      },
      complete: () => this.loading.set(false),
    });
  }
}

