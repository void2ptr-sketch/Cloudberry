import type { AppLocale } from './app-locale.type';

const DOCUMENT_LANG: Record<AppLocale, string> = {
  ru: 'ru',
  en: 'en',
  zh: 'zh-CN',
};

export function applyDocumentLang(locale: AppLocale): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.lang = DOCUMENT_LANG[locale];
}
