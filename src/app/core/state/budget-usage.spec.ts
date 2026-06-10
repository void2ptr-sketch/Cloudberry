import type { Budget, CostRecord } from '../domain';
import { calculateBudgetUsage } from './budget-usage';

describe('calculateBudgetUsage', () => {
  const budget: Budget = {
    id: 'budget-1',
    name: 'Monthly',
    limitAmount: 1000,
    currency: 'USD',
    periodStart: '2026-06-01',
    periodEnd: '2026-06-30',
    scopeId: 'org-default',
  };

  const records: CostRecord[] = [
    {
      id: '1',
      connectionId: 'conn-1',
      service: 'EC2',
      amount: 500,
      currency: 'USD',
      usageDate: '2026-06-10',
    },
    {
      id: '2',
      connectionId: 'conn-1',
      service: 'S3',
      amount: 300,
      currency: 'USD',
      usageDate: '2026-06-15',
      costCenterId: 'cc-platform',
    },
    {
      id: '3',
      connectionId: 'conn-1',
      service: 'RDS',
      amount: 100,
      currency: 'USD',
      usageDate: '2026-05-31',
    },
  ];

  it('sums spend within budget period for org scope', () => {
    const status = calculateBudgetUsage(budget, records);
    expect(status.spentAmount).toBe(800);
    expect(status.usagePercent).toBe(80);
    expect(status.triggeredThresholds).toEqual([80]);
  });

  it('filters by cost center scope', () => {
    const scopedBudget: Budget = { ...budget, scopeId: 'cc-platform' };
    const status = calculateBudgetUsage(scopedBudget, records);
    expect(status.spentAmount).toBe(300);
    expect(status.triggeredThresholds).toEqual([]);
  });

  it('triggers 80 and 100 thresholds when over limit', () => {
    const overBudget: Budget = { ...budget, limitAmount: 700 };
    const status = calculateBudgetUsage(overBudget, records);
    expect(status.usagePercent).toBeGreaterThanOrEqual(100);
    expect(status.triggeredThresholds).toEqual([80, 100]);
  });
});
