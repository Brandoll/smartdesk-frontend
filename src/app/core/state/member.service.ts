import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';
import { joinUrl } from '../api/url';
import { Member, InviteMemberRequest, UpdateMemberRequest } from './member.models';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listMembers(orgId: string): Observable<Member[]> {
    const url = joinUrl(this.baseUrl, `/api/organizations/${orgId}/members`);
    return this.http.get<Member[]>(url);
  }

  getMember(orgId: string, userId: string): Observable<Member> {
    const url = joinUrl(this.baseUrl, `/api/organizations/${orgId}/members/${userId}`);
    return this.http.get<Member>(url);
  }

  listMembersByDepartment(orgId: string, deptId: string): Observable<Member[]> {
    const url = joinUrl(this.baseUrl, `/api/organizations/${orgId}/members/by-department/${deptId}`);
    return this.http.get<Member[]>(url);
  }

  inviteMember(orgId: string, body: InviteMemberRequest): Observable<Member> {
    const url = joinUrl(this.baseUrl, `/api/organizations/${orgId}/members`);
    return this.http.post<Member>(url, body);
  }

  updateMember(orgId: string, userId: string, body: UpdateMemberRequest): Observable<Member> {
    const url = joinUrl(this.baseUrl, `/api/organizations/${orgId}/members/${userId}`);
    return this.http.put<Member>(url, body);
  }

  removeMember(orgId: string, userId: string): Observable<void> {
    const url = joinUrl(this.baseUrl, `/api/organizations/${orgId}/members/${userId}`);
    return this.http.delete<void>(url);
  }
}
