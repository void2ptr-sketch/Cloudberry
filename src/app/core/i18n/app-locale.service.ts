import { inject, Injectable } from '@angular/core';

import { readStoredLocale } from './app-locale-storage';
import { APP_LOCALE_RELOAD } from './app-locale-reload.token';
import type { AppLocale } from './app-locale.type';

type ProfileLocaleSync = (locale: AppLocale) => void;

@Injectable({ providedIn: 'root' })
export class AppLocaleService {
  private readonly reloadPage = inject(APP_LOCALE_RELOAD);
  private profileSync: ProfileLocaleSync | null = null;

  currentLocale(): AppLocale {
    return readStoredLocale();
  }

  registerProfileSync(handler: ProfileLocaleSync): void {
    this.profileSync = handler;
  }

  switchLocale(locale: AppLocale): void {
    if (readStoredLocale() === locale) {
      return;
    }

    this.profileSync?.(locale);
    this.reloadPage();
  }
}
