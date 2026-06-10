import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_ENVIRONMENT } from '../config/environment.token';
import { authInterceptor } from './auth.interceptor';
import { AuthTokenService } from './auth-token.service';

const API_URL = 'http://localhost:3000/api';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authToken: AuthTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthTokenService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {
          provide: APP_ENVIRONMENT,
          useValue: {
            production: false,
            name: 'test',
            apiUrl: API_URL,
            enableDebug: false,
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authToken = TestBed.inject(AuthTokenService);
    authToken.clearToken();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('adds Bearer token for API requests', () => {
    authToken.setToken('test-token');

    http.get(`${API_URL}/billing/snapshot`).subscribe();
    const req = httpMock.expectOne(`${API_URL}/billing/snapshot`);

    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('skips Authorization when token is missing', () => {
    http.get(`${API_URL}/billing/snapshot`).subscribe();
    const req = httpMock.expectOne(`${API_URL}/billing/snapshot`);

    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('skips Authorization for non-API URLs', () => {
    authToken.setToken('test-token');

    http.get('https://example.com/data').subscribe();
    const req = httpMock.expectOne('https://example.com/data');

    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
