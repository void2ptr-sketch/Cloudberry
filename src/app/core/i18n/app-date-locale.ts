import { MAT_DATE_LOCALE } from '@angular/material/core';

import { readStoredLocale } from './app-locale-storage';
import type { AppLocale } from './app-locale.type';

const DATE_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  zh: 'zh-CN',
};

export const APP_DATE_LOCALE_PROVIDER = {
  provide: MAT_DATE_LOCALE,
  useFactory: () => DATE_LOCALE_BY_APP_LOCALE[readStoredLocale()],
};
