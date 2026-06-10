import type { Budget, CloudConnection, CostCenter, CostRecord } from '../domain';
import { parseIsoDate } from '../../shared/date/iso-date';

import type { ReportingPeriod } from './app-state.model';
import type { BudgetUsageStatus } from './budget-usage.type';
import { isDateWithinPeriod } from './reporting-period';

const TOP_SERVICES_LIMIT = 5;

export type DashboardConnectionSpend = {
  connectionId: string;
  connectionName: string;
  amount: number;
};

export type DashboardServiceSpend = {
  service: string;
  amount: number;
};

export type DashboardOverview = {
  totalAmount: number;
  currency: string;
  recordCount: number;
  connectionCount: number;
  budgetCount: number;
  costCenterCount: number;
  activeAlertCount: number;
  averageDailySpend: number;
  periodDays: number;
  budgetsSpentTotal: number;
  budgetsLimitTotal: number;
  budgetsUsagePercent: number;
  spendByConnection: DashboardConnectionSpend[];
  topServices: DashboardServiceSpend[];
};

type BuildDashboardOverviewInput = {
  period: ReportingPeriod;
  connections: CloudConnection[];
  costCenters: CostCenter[];
  costRecords: CostRecord[];
  budgets: Budget[];
  budgetUsageStatuses: BudgetUsageStatus[];
  activeAlertCount: number;
};

export function buildDashboardOverview(input: BuildDashboardOverviewInput): DashboardOverview {
  const periodRecords = input.costRecords.filter((record) =>
    isDateWithinPeriod(record.usageDate, input.period),
  );

  const currency = periodRecords[0]?.currency ?? input.budgets[0]?.currency ?? 'USD';
  const totalAmount = periodRecords.reduce((sum, record) => sum + record.amount, 0);
  const periodDays = countPeriodDays(input.period);
  const averageDailySpend = periodDays > 0 ? totalAmount / periodDays : 0;

  const spendByConnectionId = new Map<string, number>();
  for (const record of periodRecords) {
    spendByConnectionId.set(
      record.connectionId,
      (spendByConnectionId.get(record.connectionId) ?? 0) + record.amount,
    );
  }

  const knownConnectionIds = new Set(input.connections.map((connection) => connection.id));
  const spendByConnection = input.connections
    .map((connection) => ({
      connectionId: connection.id,
      connectionName: connection.name,
      amount: spendByConnectionId.get(connection.id) ?? 0,
    }))
    .sort((left, right) => right.amount - left.amount);

  for (const [connectionId, amount] of spendByConnectionId) {
    if (!knownConnectionIds.has(connectionId)) {
      spendByConnection.push({
        connectionId,
        connectionName: connectionId,
        amount,
      });
    }
  }

  const serviceTotals = new Map<string, number>();
  for (const record of periodRecords) {
    serviceTotals.set(record.service, (serviceTotals.get(record.service) ?? 0) + record.amount);
  }

  const topServices = [...serviceTotals.entries()]
    .map(([service, amount]) => ({ service, amount }))
    .sort((left, right) => right.amount - left.amount)
    .slice(0, TOP_SERVICES_LIMIT);

  const budgetsSpentTotal = input.budgetUsageStatuses.reduce(
    (sum, status) => sum + status.spentAmount,
    0,
  );
  const budgetsLimitTotal = input.budgetUsageStatuses.reduce(
    (sum, status) => sum + status.limitAmount,
    0,
  );
  const budgetsUsagePercent =
    budgetsLimitTotal > 0
      ? Math.round((budgetsSpentTotal / budgetsLimitTotal) * 1000) / 10
      : 0;

  return {
    totalAmount,
    currency,
    recordCount: periodRecords.length,
    connectionCount: input.connections.length,
    budgetCount: input.budgets.length,
    costCenterCount: input.costCenters.length,
    activeAlertCount: input.activeAlertCount,
    averageDailySpend,
    periodDays,
    budgetsSpentTotal,
    budgetsLimitTotal,
    budgetsUsagePercent,
    spendByConnection,
    topServices,
  };
}

function countPeriodDays(period: ReportingPeriod): number {
  const start = parseIsoDate(period.start);
  const end = parseIsoDate(period.end);
  if (end < start) {
    return 1;
  }

  const millisPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / millisPerDay) + 1;
}
