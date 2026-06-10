import type { AppLocale } from '../../core/i18n';
import type { AppTheme } from '../../core/theme';

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  locale: AppLocale;
  theme: AppTheme;
  defaultCurrency: string;
};
