import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { APP_ENVIRONMENT } from '../config/environment.token';
import type { BudgetInput } from '../domain';
import { API_ENDPOINTS } from './api-endpoints';
import type {
  BudgetResponse,
  BudgetsListResponse,
  DeleteBudgetResponse,
} from './budgets-api.model';
import { readHttpResource } from './http-resource';

@Injectable({ providedIn: 'root' })
export class BudgetsApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENVIRONMENT);

  list(): Promise<BudgetsListResponse> {
    return readHttpResource(
      this.http.get<BudgetsListResponse>(`${this.env.apiUrl}${API_ENDPOINTS.budgets}`),
    );
  }

  create(input: BudgetInput): Promise<BudgetResponse> {
    return readHttpResource(
      this.http.post<BudgetResponse>(`${this.env.apiUrl}${API_ENDPOINTS.budgets}`, input),
    );
  }

  update(id: string, input: BudgetInput): Promise<BudgetResponse> {
    return readHttpResource(
      this.http.put<BudgetResponse>(`${this.env.apiUrl}${API_ENDPOINTS.budget(id)}`, input),
    );
  }

  delete(id: string): Promise<DeleteBudgetResponse> {
    return readHttpResource(
      this.http.delete<DeleteBudgetResponse>(`${this.env.apiUrl}${API_ENDPOINTS.budget(id)}`),
    );
  }
}
