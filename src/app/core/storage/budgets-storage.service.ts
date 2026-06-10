import { Injectable } from '@angular/core';

import type { Budget } from '../domain';

const STORAGE_KEY = 'cloudberry.budgets';

@Injectable({ providedIn: 'root' })
export class BudgetsStorageService {
  load(): Budget[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed as Budget[];
    } catch {
      return [];
    }
  }

  save(budgets: Budget[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  }

  clear(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }
}
