import { Injectable, inject, signal } from '@angular/core';

import { AuthTokenStorageService } from './auth-token.storage';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly storage = inject(AuthTokenStorageService);
  private readonly tokenState = signal<string | null>(this.storage.load());

  readonly token = this.tokenState.asReadonly();

  getToken(): string | null {
    return this.tokenState();
  }

  setToken(token: string): void {
    this.tokenState.set(token);
    this.storage.save(token);
  }

  clearToken(): void {
    this.tokenState.set(null);
    this.storage.clear();
  }
}
