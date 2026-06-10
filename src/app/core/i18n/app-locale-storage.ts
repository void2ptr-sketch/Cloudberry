import { DEFAULT_APP_LOCALE } from './app-locale-options';
import type { AppLocale } from './app-locale.type';

const STORAGE_KEY = 'cloudberry.user-profile';
const APP_LOCALES = new Set<AppLocale>(['ru', 'en', 'zh']);

export function readStoredLocale(): AppLocale {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_APP_LOCALE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_APP_LOCALE;
    }

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as Record<string, unknown>)['locale'] === 'string' &&
      APP_LOCALES.has((parsed as Record<string, unknown>)['locale'] as AppLocale)
    ) {
      return (parsed as Record<string, unknown>)['locale'] as AppLocale;
    }
  } catch {
    // fall through
  }

  return DEFAULT_APP_LOCALE;
}
