import { buildDashboardOverview } from './dashboard-overview';

describe('buildDashboardOverview', () => {
  it('aggregates spend for the reporting period across all connections', () => {
    const overview = buildDashboardOverview({
      period: { start: '2026-06-01', end: '2026-06-30' },
      connections: [
        { id: 'conn-1', name: 'AWS', provider: 'aws', externalAccountId: '1' },
        { id: 'conn-2', name: 'Azure', provider: 'azure', externalAccountId: '2' },
      ],
      costCenters: [{ id: 'cc-1', name: 'Platform' }],
      costRecords: [
        {
          id: '1',
          connectionId: 'conn-1',
          service: 'EC2',
          amount: 100,
          currency: 'USD',
          usageDate: '2026-06-10',
        },
        {
          id: '2',
          connectionId: 'conn-2',
          service: 'AKS',
          amount: 50,
          currency: 'USD',
          usageDate: '2026-06-15',
        },
        {
          id: '3',
          connectionId: 'conn-1',
          service: 'S3',
          amount: 25,
          currency: 'USD',
          usageDate: '2026-05-31',
        },
      ],
      budgets: [
        {
          id: 'budget-1',
          name: 'Org',
          limitAmount: 200,
          currency: 'USD',
          periodStart: '2026-06-01',
          periodEnd: '2026-06-30',
          scopeId: 'org-default',
        },
      ],
      budgetUsageStatuses: [
        {
          budgetId: 'budget-1',
          spentAmount: 150,
          limitAmount: 200,
          currency: 'USD',
          usagePercent: 75,
          triggeredThresholds: [],
        },
      ],
      activeAlertCount: 0,
    });

    expect(overview.totalAmount).toBe(150);
    expect(overview.recordCount).toBe(2);
    expect(overview.averageDailySpend).toBeCloseTo(150 / 30, 5);
    expect(overview.spendByConnection).toEqual([
      { connectionId: 'conn-1', connectionName: 'AWS', amount: 100 },
      { connectionId: 'conn-2', connectionName: 'Azure', amount: 50 },
    ]);
    expect(overview.topServices).toEqual([
      { service: 'EC2', amount: 100 },
      { service: 'AKS', amount: 50 },
    ]);
    expect(overview.budgetsUsagePercent).toBe(75);
  });
});
