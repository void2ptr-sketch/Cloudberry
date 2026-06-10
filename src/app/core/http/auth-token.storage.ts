import { Injectable } from '@angular/core';

const STORAGE_KEY = 'cloudberry.auth-token';

@Injectable({ providedIn: 'root' })
export class AuthTokenStorageService {
  load(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const token = localStorage.getItem(STORAGE_KEY);
    return token && token.length > 0 ? token : null;
  }

  save(token: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, token);
  }

  clear(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }
}
