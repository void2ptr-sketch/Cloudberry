import { Injectable, signal } from '@angular/core';

import { DEFAULT_UI_LOCALE } from './ui-locale-options';
import type { UiLocale } from './ui-locale.type';

type ProfileLocaleSync = (locale: UiLocale) => void;

const DOCUMENT_LANG: Record<UiLocale, string> = {
  ru: 'ru',
  en: 'en',
  zh: 'zh-CN',
};

@Injectable({ providedIn: 'root' })
export class UiLocaleService {
  private readonly localeState = signal<UiLocale>(DEFAULT_UI_LOCALE);
  private profileSync: ProfileLocaleSync | null = null;

  readonly locale = this.localeState.asReadonly();

  registerProfileSync(handler: ProfileLocaleSync): void {
    this.profileSync = handler;
  }

  initLocale(locale: UiLocale): void {
    this.localeState.set(locale);
    this.applyToDocument(locale);
  }

  setLocale(locale: UiLocale): void {
    if (this.localeState() === locale) {
      return;
    }
    this.localeState.set(locale);
    this.applyToDocument(locale);
    this.profileSync?.(locale);
  }

  private applyToDocument(locale: UiLocale): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.lang = DOCUMENT_LANG[locale];
  }
}
