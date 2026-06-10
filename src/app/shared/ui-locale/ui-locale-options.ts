import type { UiLocale } from './ui-locale.type';

export type UiLocaleOption = {
  id: UiLocale;
  label: string;
  shortLabel: string;
};

export const UI_LOCALE_OPTIONS: UiLocaleOption[] = [
  { id: 'ru', label: 'Русский', shortLabel: 'RU' },
  { id: 'en', label: 'English', shortLabel: 'EN' },
  { id: 'zh', label: '中文', shortLabel: '中文' },
];

export const DEFAULT_UI_LOCALE: UiLocale = 'ru';
