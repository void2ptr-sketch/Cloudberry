/** Relative API paths (prepend `Environment.apiUrl`). */
export const API_ENDPOINTS = {
  billingSnapshot: '/billing/snapshot',
  connections: '/connections',
  connection: (id: string) => `/connections/${id}`,
  budgets: '/budgets',
  budget: (id: string) => `/budgets/${id}`,
} as const;
