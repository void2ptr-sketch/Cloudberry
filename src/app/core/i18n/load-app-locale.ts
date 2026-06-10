import { loadTranslations } from '@angular/localize';

import { buildTranslationMap } from './build-translation-map';
import { applyDocumentLang } from './document-lang';
import { readStoredLocale } from './app-locale-storage';
import type { AppLocale } from './app-locale.type';
import { MESSAGES_EN } from './messages/messages.en';
import { MESSAGES_RU } from './messages/messages.ru';
import { MESSAGES_ZH } from './messages/messages.zh';

const LOCALE_TRANSLATIONS: Record<Exclude<AppLocale, 'ru'>, Record<string, string>> = {
  en: buildTranslationMap(MESSAGES_EN),
  zh: buildTranslationMap(MESSAGES_ZH),
};

const RU_TEST_RESET = buildTranslationMap(MESSAGES_RU);

export function prepareAppLocale(): AppLocale {
  const locale = readStoredLocale();

  if (locale === 'ru') {
    if ('jasmine' in globalThis) {
      loadTranslations(RU_TEST_RESET);
    }
  } else {
    loadTranslations(LOCALE_TRANSLATIONS[locale]);
  }

  applyDocumentLang(locale);
  return locale;
}
