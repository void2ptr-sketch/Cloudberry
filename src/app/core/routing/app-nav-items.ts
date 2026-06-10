import type { UiMessageKey } from '../../shared/ui-locale';
import { AppRoutePath } from './app-route-paths';

export type AppNavItem = {
  path: AppRoutePath;
  labelKey: UiMessageKey;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { path: AppRoutePath.dashboard, labelKey: 'nav.dashboard' },
  { path: AppRoutePath.connections, labelKey: 'nav.connections' },
  { path: AppRoutePath.budgets, labelKey: 'nav.budgets' },
  { path: AppRoutePath.reports, labelKey: 'nav.reports' },
  { path: AppRoutePath.costs, labelKey: 'nav.costs' },
];
