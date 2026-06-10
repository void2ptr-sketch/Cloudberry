import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { UiTranslateService } from '../../shared/ui-locale';
import { APP_ENVIRONMENT } from '../config/environment.token';
import { AuthTokenService } from './auth-token.service';
import { mapHttpError } from './map-http-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(APP_ENVIRONMENT);
  const translate = inject(UiTranslateService);
  const authToken = inject(AuthTokenService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || !isApiRequest(req.url, env.apiUrl)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        authToken.clearToken();
      }

      return throwError(() => mapHttpError(error, translate));
    }),
  );
};

function isApiRequest(url: string, apiUrl: string): boolean {
  return url.startsWith(apiUrl);
}
