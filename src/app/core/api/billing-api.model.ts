import type { Budget, CloudConnection, CostCenter, CostRecord } from '../domain';

/** Aggregated billing data for a reporting period. */
export type BillingSnapshot = {
  connections: CloudConnection[];
  costCenters: CostCenter[];
  costRecords: CostRecord[];
  budgets: Budget[];
};

/** Response body: `GET /billing/snapshot?from=&to=` */
export type BillingSnapshotResponse = BillingSnapshot;
