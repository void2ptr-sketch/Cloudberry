import { EnvironmentProviders, Provider, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { APP_DATE_LOCALE_PROVIDER } from '../core/i18n/app-date-locale';
import { AppPaginatorIntl } from '../core/i18n/app-paginator-intl';
import { prepareAppLocale } from '../core/i18n';
import { authInterceptor, errorInterceptor } from '../core/http';

export const REMOTE_PROVIDERS: Array<Provider | EnvironmentProviders> = [
  { provide: MatPaginatorIntl, useClass: AppPaginatorIntl },
  APP_DATE_LOCALE_PROVIDER,
  provideNativeDateAdapter(),
  provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
  provideAppInitializer(() => {
    prepareAppLocale();
  }),
];
