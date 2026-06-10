import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { APP_DATE_LOCALE_PROVIDER } from './core/i18n/app-date-locale';
import { AppPaginatorIntl } from './core/i18n/app-paginator-intl';
import { authInterceptor, errorInterceptor } from './core/http';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MatPaginatorIntl, useClass: AppPaginatorIntl },
    APP_DATE_LOCALE_PROVIDER,
    provideNativeDateAdapter(),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
