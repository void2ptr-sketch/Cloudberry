import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { APP_ENVIRONMENT } from '../config/environment.token';
import type { CloudConnectionInput } from '../domain';
import { API_ENDPOINTS } from './api-endpoints';
import type {
  ConnectionResponse,
  ConnectionsListResponse,
  DeleteConnectionResponse,
} from './connections-api.model';
import { readHttpResource } from './http-resource';

@Injectable({ providedIn: 'root' })
export class ConnectionsApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENVIRONMENT);

  list(): Promise<ConnectionsListResponse> {
    return readHttpResource(
      this.http.get<ConnectionsListResponse>(`${this.env.apiUrl}${API_ENDPOINTS.connections}`),
    );
  }

  create(input: CloudConnectionInput): Promise<ConnectionResponse> {
    return readHttpResource(
      this.http.post<ConnectionResponse>(`${this.env.apiUrl}${API_ENDPOINTS.connections}`, input),
    );
  }

  update(id: string, input: CloudConnectionInput): Promise<ConnectionResponse> {
    return readHttpResource(
      this.http.put<ConnectionResponse>(
        `${this.env.apiUrl}${API_ENDPOINTS.connection(id)}`,
        input,
      ),
    );
  }

  delete(id: string): Promise<DeleteConnectionResponse> {
    return readHttpResource(
      this.http.delete<DeleteConnectionResponse>(
        `${this.env.apiUrl}${API_ENDPOINTS.connection(id)}`,
      ),
    );
  }
}
