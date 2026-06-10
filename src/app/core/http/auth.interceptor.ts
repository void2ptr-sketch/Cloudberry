import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { APP_ENVIRONMENT } from '../config/environment.token';
import { AuthTokenService } from './auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(APP_ENVIRONMENT);
  const authToken = inject(AuthTokenService);
  const token = authToken.getToken();

  if (!token || !isApiRequest(req.url, env.apiUrl)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};

function isApiRequest(url: string, apiUrl: string): boolean {
  return url.startsWith(apiUrl);
}
