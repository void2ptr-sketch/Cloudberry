import type { Budget, CloudConnection, CostCenter, CostRecord } from '../domain';

export type ReportingPeriod = {
  start: string;
  end: string;
};

export type AppStatus = 'idle' | 'loading' | 'ready' | 'error';

export type AppState = {
  status: AppStatus;
  error: string | null;
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
