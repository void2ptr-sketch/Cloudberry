import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { APP_ENVIRONMENT } from '../config/environment.token';
import type { ReportingPeriod } from '../state/app-state.model';
import { API_ENDPOINTS } from './api-endpoints';
import type { BillingSnapshotResponse } from './billing-api.model';
import { readHttpResource } from './http-resource';

@Injectable({ providedIn: 'root' })
export class BillingApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENVIRONMENT);

  getSnapshot(period: ReportingPeriod): Promise<BillingSnapshotResponse> {
    const params = new HttpParams().set('from', period.start).set('to', period.end);
    return readHttpResource(
      this.http.get<BillingSnapshotResponse>(`${this.env.apiUrl}${API_ENDPOINTS.billingSnapshot}`, {
        params,
      }),
    );
  }
}
