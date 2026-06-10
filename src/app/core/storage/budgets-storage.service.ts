import { Injectable } from '@angular/core';

import type { Budget } from '../domain';
import { sanitizeBudget } from '../sanitize';

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
      return parsed
        .map((item) => sanitizeBudget(item as Budget))
        .filter((item): item is Budget => item !== null);
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
