import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_ENVIRONMENT } from '../config/environment.token';
import type { BudgetInput } from '../domain';
import { BudgetsApiService } from './budgets-api.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BudgetsApiService', () => {
  let service: BudgetsApiService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://test/api';
  const input: BudgetInput = {
    name: 'Q2',
    limitAmount: 5000,
    currency: 'USD',
    periodStart: '2026-04-01',
    periodEnd: '2026-06-30',
    scopeId: 'org-default',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        BudgetsApiService,
        {
            provide: APP_ENVIRONMENT,
            useValue: { production: false, name: 'test', apiUrl, enableDebug: false },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(BudgetsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists budgets', async () => {
    const promise = service.list();
    const req = httpMock.expectOne(`${apiUrl}/budgets`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
    await expectAsync(promise).toBeResolvedTo([]);
  });

  it('creates a budget', async () => {
    const promise = service.create(input);
    const req = httpMock.expectOne(`${apiUrl}/budgets`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({ id: 'budget-1', ...input });
    await expectAsync(promise).toBeResolvedTo({ id: 'budget-1', ...input });
  });

  it('updates a budget', async () => {
    const promise = service.update('budget-1', input);
    const req = httpMock.expectOne(`${apiUrl}/budgets/budget-1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 'budget-1', ...input });
    await expectAsync(promise).toBeResolvedTo({ id: 'budget-1', ...input });
  });

  it('deletes a budget', async () => {
    const promise = service.delete('budget-1');
    const req = httpMock.expectOne(`${apiUrl}/budgets/budget-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await expectAsync(promise).toBeResolved();
  });
});
