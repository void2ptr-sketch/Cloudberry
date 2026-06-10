import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UiLocaleService, UiTranslateService } from '../../shared/ui-locale';
import { APP_ENVIRONMENT } from '../config/environment.token';
import { isApiHttpError } from './api-http-error.type';
import { AuthTokenService } from './auth-token.service';
import { errorInterceptor } from './error.interceptor';

const API_URL = 'http://localhost:3000/api';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authToken: AuthTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiLocaleService,
        UiTranslateService,
        AuthTokenService,
        provideHttpClient(withInterceptors([errorInterceptor])),
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

  it('maps API errors to ApiHttpError with localized message', (done) => {
    http.get(`${API_URL}/billing/snapshot`).subscribe({
      error: (error: unknown) => {
        expect(isApiHttpError(error)).toBeTrue();
        if (isApiHttpError(error)) {
          expect(error.status).toBe(503);
          expect(error.message).toBe('Ошибка сервера');
        }
        done();
      },
    });

    const req = httpMock.expectOne(`${API_URL}/billing/snapshot`);
    req.flush(null, { status: 503, statusText: 'Service Unavailable' });
  });

  it('prefers server message from JSON body', (done) => {
    http.get(`${API_URL}/connections`).subscribe({
      error: (error: unknown) => {
        expect(isApiHttpError(error)).toBeTrue();
        if (isApiHttpError(error)) {
          expect(error.message).toBe('Invalid credentials');
        }
        done();
      },
    });

    const req = httpMock.expectOne(`${API_URL}/connections`);
    req.flush({ message: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });
  });

  it('clears auth token on 401', (done) => {
    authToken.setToken('expired-token');

    http.get(`${API_URL}/billing/snapshot`).subscribe({
      error: () => {
        expect(authToken.getToken()).toBeNull();
        done();
      },
    });

    const req = httpMock.expectOne(`${API_URL}/billing/snapshot`);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('passes through errors for non-API URLs', (done) => {
    http.get('https://example.com/data').subscribe({
      error: (error: unknown) => {
        expect(isApiHttpError(error)).toBeFalse();
        done();
      },
    });

    const req = httpMock.expectOne('https://example.com/data');
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });
});
