import { DEFAULT_APP_LOCALE } from '../../core/i18n';
import type { UserProfile } from './user-profile.type';

export function createDefaultUserProfile(): UserProfile {
  return {
    id: crypto.randomUUID(),
    displayName: 'Пользователь',
    email: '',
    locale: DEFAULT_APP_LOCALE,
    defaultCurrency: 'USD',
  };
}
