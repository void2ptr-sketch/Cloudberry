import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { environment } from '../../environments/environment.test';
import { AppComponent } from '../app.component';
import { routes } from '../app.routes';
import { APP_ENVIRONMENT } from '../core/config/environment.token';
import { APP_DATE_LOCALE_PROVIDER } from '../core/i18n/app-date-locale';
import { AppPaginatorIntl } from '../core/i18n/app-paginator-intl';
import { prepareAppLocale, type AppLocale } from '../core/i18n';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { createDefaultUserProfile } from '../features/user-profile/user-profile-defaults';

const STORAGE_KEY = 'cloudberry.user-profile';

export type SmokeFixture = {
  fixture: ComponentFixture<AppComponent>;
  router: Router;
};

export type SmokeFixtureOptions = {
  locale?: AppLocale;
};

export async function createSmokeFixture(options: SmokeFixtureOptions = {}): Promise<SmokeFixture> {
  localStorage.clear();

  if (options.locale && options.locale !== 'ru') {
    const profile = {
      ...createDefaultUserProfile(environment.name),
      locale: options.locale,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  prepareAppLocale();

  await TestBed.configureTestingModule({
    imports: [AppComponent],
    providers: [
      provideNoopAnimations(),
      provideRouter(routes),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: APP_ENVIRONMENT, useValue: environment },
      { provide: MatPaginatorIntl, useClass: AppPaginatorIntl },
      APP_DATE_LOCALE_PROVIDER,
      provideNativeDateAdapter(),
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppComponent);
  const router = TestBed.inject(Router);
  fixture.detectChanges();

  return { fixture, router };
}

export async function navigateSmoke(
  { fixture, router }: SmokeFixture,
  url: string,
): Promise<HTMLElement> {
  await router.navigateByUrl(url);
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

export function shellContent(root: HTMLElement): HTMLElement {
  const main = root.querySelector('main.shell__content');
  expect(main).withContext('shell main content').not.toBeNull();
  return main as HTMLElement;
}
