export type BudgetAlertThreshold = 80 | 100;

export type Budget = {
  id: string;
  name: string;
  limitAmount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  scopeId: string;
};

export type BudgetAlert = {
  id: string;
  budgetId: string;
  threshold: BudgetAlertThreshold;
  triggeredAt: string;
};
