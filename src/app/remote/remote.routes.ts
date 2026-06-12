import { Routes } from '@angular/router';

import { AppRoutePath } from '../core/routing/app-route-paths';
import { RemoteShellComponent } from './remote-shell.component';
import { REMOTE_PROVIDERS } from './remote.providers';

export const REMOTE_ROUTES: Routes = [
  {
    path: '',
    component: RemoteShellComponent,
    providers: REMOTE_PROVIDERS,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AppRoutePath.dashboard,
      },
      {
        path: AppRoutePath.dashboard,
        title: 'Обзор · Cloudberry',
        loadComponent: () =>
          import('../features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: AppRoutePath.connections,
        title: 'Connections · Cloudberry',
        loadComponent: () =>
          import('../features/connections/connections.component').then(
            (m) => m.ConnectionsComponent,
          ),
      },
      {
        path: AppRoutePath.budgets,
        title: 'Budgets · Cloudberry',
        loadComponent: () =>
          import('../features/budgets/budgets.component').then((m) => m.BudgetsComponent),
      },
      {
        path: AppRoutePath.reports,
        title: 'Reports · Cloudberry',
        loadComponent: () =>
          import('../features/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: AppRoutePath.costs,
        title: 'Расходы · Cloudberry',
        loadComponent: () =>
          import('../features/costs/costs.component').then((m) => m.CostsComponent),
      },
      {
        path: AppRoutePath.profile,
        title: 'Profile · Cloudberry',
        loadComponent: () =>
          import('../features/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent,
          ),
      },
      {
        path: '**',
        title: 'Not found · Cloudberry',
        loadComponent: () =>
          import('../features/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
];
