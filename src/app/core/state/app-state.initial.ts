import type { AppState } from './app-state.model';
import { createIdleResources } from './resource-state';
import { getCurrentMonthPeriod } from './reporting-period';

export function createInitialAppState(): AppState {
  return {
    resources: createIdleResources(),
    reportingPeriod: getCurrentMonthPeriod(),
    selectedConnectionId: null,
    connections: [],
    costCenters: [],
    costRecords: [],
    budgets: [],
  };
}
