import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../api/api.tokens';
import { joinUrl } from '../api/url';
import { AuthTokenResponse, LoginRequest, RegisterRequest } from './auth.models';
import { TokenStorage } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly tokenStorage = inject(TokenStorage);

  login(payload: LoginRequest): Observable<void> {
    const url = joinUrl(this.baseUrl, '/api/auth/login');
    return this.http.post<AuthTokenResponse>(url, payload).pipe(
      map((res) => {
        this.tokenStorage.set(res.token);
      })
    );
  }

  register(payload: RegisterRequest): Observable<void> {
    const url = joinUrl(this.baseUrl, '/api/auth/register');
    return this.http.post<AuthTokenResponse>(url, payload).pipe(
      map((res) => {
        this.tokenStorage.set(res.token);
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.token();
  }
}

