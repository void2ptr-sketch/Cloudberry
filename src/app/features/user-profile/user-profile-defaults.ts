import { DEFAULT_UI_LOCALE } from '../../shared/ui-locale';
import type { UserProfile } from './user-profile.type';

export function createDefaultUserProfile(): UserProfile {
  return {
    id: crypto.randomUUID(),
    displayName: 'Пользователь',
    email: '',
    locale: DEFAULT_UI_LOCALE,
    defaultCurrency: 'USD',
  };
}
