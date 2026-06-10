import {
  CURRENCY_CODE_PATTERN,
} from '../../shared/sanitize/sanitize-patterns';
import {
  sanitizeCurrencyCode,
  sanitizeEmail,
  sanitizeText,
} from '../../shared/sanitize/sanitize-text';
import type { UiLocale } from '../../shared/ui-locale';
import type { UserProfile } from './user-profile.type';
import type { UserProfileInput } from './user-profile-input.type';

const UI_LOCALES = new Set<UiLocale>(['ru', 'en', 'zh']);

export function sanitizeUserProfileInput(input: UserProfileInput): UserProfileInput {
  const currency = sanitizeCurrencyCode(input.defaultCurrency);

  return {
    displayName: sanitizeText(input.displayName, { maxLength: 80 }),
    email: sanitizeEmail(input.email),
    locale: UI_LOCALES.has(input.locale) ? input.locale : 'ru',
    defaultCurrency: CURRENCY_CODE_PATTERN.test(currency) ? currency : 'USD',
  };
}

export function sanitizeUserProfile(profile: UserProfile): UserProfile {
  const sanitized = sanitizeUserProfileInput(profile);
  return {
    id: profile.id,
    ...sanitized,
  };
}
