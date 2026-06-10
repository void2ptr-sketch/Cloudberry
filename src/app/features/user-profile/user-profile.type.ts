import type { AppLocale } from '../../core/i18n';

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  locale: AppLocale;
  defaultCurrency: string;
};
