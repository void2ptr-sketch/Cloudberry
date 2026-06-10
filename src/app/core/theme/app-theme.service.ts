import { Injectable, signal } from '@angular/core';

import type { AppTheme } from './app-theme.type';

const THEME_BODY_CLASSES = ['theme-prod', 'theme-dev', 'theme-test'] as const;

@Injectable({ providedIn: 'root' })
export class AppThemeService {
  private readonly themeState = signal<AppTheme>('prod');

  readonly theme = this.themeState.asReadonly();

  apply(theme: AppTheme): void {
    this.themeState.set(theme);

    if (typeof document === 'undefined') {
      return;
    }

    document.body.classList.remove(...THEME_BODY_CLASSES);
    document.body.classList.add(`theme-${theme}`);
  }
}

export function isAppTheme(value: unknown): value is AppTheme {
  return value === 'prod' || value === 'dev' || value === 'test';
}
