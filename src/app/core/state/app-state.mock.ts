import type { AppState } from './app-state.model';
import { createInitialAppState } from './app-state.initial';

/** Seed data for DEV/TEST when `environment.enableDebug` is true. */
export function createMockAppState(): AppState {
  const base = createInitialAppState();

  return {
    ...base,
    status: 'ready',
    selectedConnectionId: 'conn-aws-1',
    connections: [
      {
        id: 'conn-aws-1',
        name: 'AWS Production',
        provider: 'aws',
        externalAccountId: '123456789012',
      },
      {
        id: 'conn-azure-1',
        name: 'Azure Shared',
        provider: 'azure',
        externalAccountId: 'sub-aaaa-bbbb',
      },
    ],
    costCenters: [
      { id: 'cc-platform', name: 'Platform' },
      { id: 'cc-product', name: 'Product' },
    ],
    costRecords: [
      {
        id: 'cost-1',
        connectionId: 'conn-aws-1',
        service: 'Amazon EC2',
        amount: 1240.5,
        currency: 'USD',
        usageDate: base.reportingPeriod.start,
        costCenterId: 'cc-platform',
      },
      {
        id: 'cost-2',
        connectionId: 'conn-aws-1',
        service: 'Amazon S3',
        amount: 318.2,
        currency: 'USD',
        usageDate: base.reportingPeriod.start,
        costCenterId: 'cc-product',
      },
      {
        id: 'cost-3',
        connectionId: 'conn-azure-1',
        service: 'Azure Kubernetes Service',
        amount: 890.0,
        currency: 'USD',
        usageDate: base.reportingPeriod.end,
        costCenterId: 'cc-platform',
      },
    ],
    budgets: [
      {
        id: 'budget-1',
        name: 'Organization monthly',
        limitAmount: 2800,
        currency: 'USD',
        periodStart: base.reportingPeriod.start,
        periodEnd: base.reportingPeriod.end,
        scopeId: 'org-default',
      },
      {
        id: 'budget-2',
        name: 'Platform team',
        limitAmount: 1500,
        currency: 'USD',
        periodStart: base.reportingPeriod.start,
        periodEnd: base.reportingPeriod.end,
        scopeId: 'cc-platform',
      },
    ],
  };
}
