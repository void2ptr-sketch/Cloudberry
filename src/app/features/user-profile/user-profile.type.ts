import type { UiLocale } from '../../shared/ui-locale';

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  locale: UiLocale;
  defaultCurrency: string;
};
