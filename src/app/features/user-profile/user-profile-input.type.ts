import type { UiLocale } from '../../shared/ui-locale';

export type UserProfileInput = {
  displayName: string;
  email: string;
  locale: UiLocale;
  defaultCurrency: string;
};
