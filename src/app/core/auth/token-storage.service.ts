import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'smartdesk.jwt';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  readonly token = signal<string | null>(null);

  constructor() {
    this.token.set(this.get());
  }

  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }
}

