import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';
import { joinUrl } from '../api/url';
import { Organization, CreateOrganizationRequest } from './organization.models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listMyOrganizations(): Observable<Organization[]> {
    const url = joinUrl(this.baseUrl, '/api/organizations');
    return this.http.get<Organization[]>(url);
  }

  createOrganization(body: CreateOrganizationRequest): Observable<Organization> {
    const url = joinUrl(this.baseUrl, '/api/organizations');
    return this.http.post<Organization>(url, body);
  }
}
