import type { BudgetAlertThreshold } from '../domain';

export type BudgetUsageStatus = {
  budgetId: string;
  spentAmount: number;
  limitAmount: number;
  currency: string;
  usagePercent: number;
  triggeredThresholds: BudgetAlertThreshold[];
};
