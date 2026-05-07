import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';
import { joinUrl } from '../api/url';
import { Department, CreateDepartmentRequest } from './department.models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listDepartments(organizationId: string): Observable<Department[]> {
    const url = joinUrl(this.baseUrl, '/api/departments');
    const params = new HttpParams().set('organizationId', organizationId);
    return this.http.get<Department[]>(url, { params });
  }

  createDepartment(body: CreateDepartmentRequest): Observable<Department> {
    const url = joinUrl(this.baseUrl, '/api/departments');
    return this.http.post<Department>(url, body);
  }
}
