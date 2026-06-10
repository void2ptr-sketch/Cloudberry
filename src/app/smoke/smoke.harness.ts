import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { environment } from '../../environments/environment.test';
import { AppComponent } from '../app.component';
import { routes } from '../app.routes';
import { APP_ENVIRONMENT } from '../core/config/environment.token';

export type SmokeFixture = {
  fixture: ComponentFixture<AppComponent>;
  router: Router;
};

export async function createSmokeFixture(): Promise<SmokeFixture> {
  localStorage.clear();

  await TestBed.configureTestingModule({
    imports: [AppComponent],
    providers: [
      provideRouter(routes),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: APP_ENVIRONMENT, useValue: environment },
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
