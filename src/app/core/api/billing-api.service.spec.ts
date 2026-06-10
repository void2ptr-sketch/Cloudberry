import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_ENVIRONMENT } from '../config/environment.token';
import { BillingApiService } from './billing-api.service';

describe('BillingApiService', () => {
  let service: BillingApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillingApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: APP_ENVIRONMENT,
          useValue: {
            production: false,
            name: 'dev',
            apiUrl: 'http://localhost:3000/api',
            enableDebug: false,
          },
        },
      ],
    });
    service = TestBed.inject(BillingApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests billing snapshot with period params', async () => {
    const promise = service.getSnapshot({ start: '2026-06-01', end: '2026-06-30' });
    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:3000/api/billing/snapshot' &&
        r.params.get('from') === '2026-06-01' &&
        r.params.get('to') === '2026-06-30',
    );
    req.flush({
      connections: [],
      costCenters: [],
      costRecords: [],
      budgets: [],
    });
    await expectAsync(promise).toBeResolved();
  });
});
