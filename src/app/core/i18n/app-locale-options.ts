import type { AppLocale } from './app-locale.type';

export type AppLocaleOption = {
  id: AppLocale;
  label: string;
  shortLabel: string;
};

export const APP_LOCALE_OPTIONS: AppLocaleOption[] = [
  { id: 'ru', label: 'Русский', shortLabel: 'RU' },
  { id: 'en', label: 'English', shortLabel: 'EN' },
  { id: 'zh', label: '中文', shortLabel: '中文' },
];

export const DEFAULT_APP_LOCALE: AppLocale = 'ru';
