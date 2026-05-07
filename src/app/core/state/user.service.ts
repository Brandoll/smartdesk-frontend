import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';
import { joinUrl } from '../api/url';
import { User, UpdateUserRequest } from './user.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getMe(): Observable<User> {
    const url = joinUrl(this.baseUrl, '/api/users/me');
    return this.http.get<User>(url);
  }

  updateMe(body: UpdateUserRequest): Observable<User> {
    const url = joinUrl(this.baseUrl, '/api/users/me');
    return this.http.put<User>(url, body);
  }
}
