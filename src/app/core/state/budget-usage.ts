import type { Budget, BudgetAlertThreshold, CostRecord } from '../domain';
import { ORG_SCOPE_ID } from '../domain/budget-scope-options';
import type { BudgetUsageStatus } from './budget-usage.type';
import { isDateWithinPeriod } from './reporting-period';

const BUDGET_ALERT_THRESHOLDS: BudgetAlertThreshold[] = [80, 100];

export function calculateBudgetUsage(
  budget: Budget,
  costRecords: CostRecord[],
): BudgetUsageStatus {
  const spentAmount = sumBudgetSpend(budget, costRecords);
  const usagePercent =
    budget.limitAmount > 0 ? Math.round((spentAmount / budget.limitAmount) * 1000) / 10 : 0;

  return {
    budgetId: budget.id,
    spentAmount,
    limitAmount: budget.limitAmount,
    currency: budget.currency,
    usagePercent,
    triggeredThresholds: BUDGET_ALERT_THRESHOLDS.filter(
      (threshold) => usagePercent >= threshold,
    ),
  };
}

export function calculateAllBudgetUsage(
  budgets: Budget[],
  costRecords: CostRecord[],
): BudgetUsageStatus[] {
  return budgets.map((budget) => calculateBudgetUsage(budget, costRecords));
}

function sumBudgetSpend(budget: Budget, costRecords: CostRecord[]): number {
  return costRecords
    .filter((record) => matchesBudgetScope(budget, record))
    .filter((record) =>
      isDateWithinPeriod(record.usageDate, {
        start: budget.periodStart,
        end: budget.periodEnd,
      }),
    )
    .reduce((sum, record) => sum + record.amount, 0);
}

function matchesBudgetScope(budget: Budget, record: CostRecord): boolean {
  if (budget.scopeId === ORG_SCOPE_ID) {
    return true;
  }
  return record.costCenterId === budget.scopeId;
}
