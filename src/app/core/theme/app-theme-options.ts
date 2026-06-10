import type { AppTheme } from './app-theme.type';

export type AppThemeOption = {
  id: AppTheme;
  readonly label: string;
};

export const DEFAULT_APP_THEME: AppTheme = 'prod';

export const APP_THEME_OPTIONS: AppThemeOption[] = [
  {
    id: 'prod',
    get label() {
      return $localize`:@@profile.theme.prod:PROD — серая`;
    },
  },
  {
    id: 'dev',
    get label() {
      return $localize`:@@profile.theme.dev:DEV — оранжевая`;
    },
  },
  {
    id: 'test',
    get label() {
      return $localize`:@@profile.theme.test:TEST — зелёная`;
    },
  },
];
