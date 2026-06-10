import type { AppLocale } from '../../core/i18n';

export type UserProfileInput = {
  displayName: string;
  email: string;
  locale: AppLocale;
  defaultCurrency: string;
};
