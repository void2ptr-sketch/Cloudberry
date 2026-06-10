/** Application route path segments (no leading slash). */
export const AppRoutePath = {
  dashboard: 'dashboard',
  connections: 'connections',
  budgets: 'budgets',
  reports: 'reports',
  costs: 'costs',
  profile: 'profile',
} as const;

export type AppRoutePath = (typeof AppRoutePath)[keyof typeof AppRoutePath];
