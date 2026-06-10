import { AppRoutePath } from './app-route-paths';

export type AppNavItem = {
  path: AppRoutePath;
  readonly label: string;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  {
    path: AppRoutePath.dashboard,
    get label() {
      return $localize`:@@nav.dashboard:Обзор`;
    },
  },
  {
    path: AppRoutePath.connections,
    get label() {
      return $localize`:@@nav.connections:Подключения`;
    },
  },
  {
    path: AppRoutePath.budgets,
    get label() {
      return $localize`:@@nav.budgets:Бюджеты`;
    },
  },
  {
    path: AppRoutePath.reports,
    get label() {
      return $localize`:@@nav.reports:Отчёты`;
    },
  },
  {
    path: AppRoutePath.costs,
    get label() {
      return $localize`:@@nav.costs:Расходы`;
    },
  },
];
