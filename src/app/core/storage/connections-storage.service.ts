import { Injectable } from '@angular/core';

import type { CloudConnection } from '../domain';
import { sanitizeCloudConnection } from '../sanitize';

const STORAGE_KEY = 'cloudberry.connections';

@Injectable({ providedIn: 'root' })
export class ConnectionsStorageService {
  load(): CloudConnection[] {
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
        .map((item) => sanitizeCloudConnection(item as CloudConnection))
        .filter((item): item is CloudConnection => item !== null);
    } catch {
      return [];
    }
  }

  save(connections: CloudConnection[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }

  clear(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }
}
