import { DEFAULT_APP_LOCALE } from '../../core/i18n';
import type { AppTheme } from '../../core/theme';
import { DEFAULT_APP_THEME } from '../../core/theme';
import type { UserProfile } from './user-profile.type';

export function createDefaultUserProfile(theme: AppTheme = DEFAULT_APP_THEME): UserProfile {
  return {
    id: crypto.randomUUID(),
    displayName: 'Пользователь',
    email: '',
    locale: DEFAULT_APP_LOCALE,
    theme,
    defaultCurrency: 'USD',
  };
}
