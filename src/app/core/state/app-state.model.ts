import type { Budget, CloudConnection, CostCenter, CostRecord } from '../domain';

import type { AppResources } from './resource-state.type';

export type ReportingPeriod = {
  start: string;
  end: string;
};

export type AppState = {
  resources: AppResources;
  reportingPeriod: ReportingPeriod;
  selectedConnectionId: string | null;
  connections: CloudConnection[];
  costCenters: CostCenter[];
  costRecords: CostRecord[];
  budgets: Budget[];
};

export type CostSummary = {
  totalAmount: number;
  currency: string;
  recordCount: number;
};
