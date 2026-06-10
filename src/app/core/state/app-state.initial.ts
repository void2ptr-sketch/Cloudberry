import type { AppState } from './app-state.model';
import { getCurrentMonthPeriod } from './reporting-period';

export function createInitialAppState(): AppState {
  return {
    status: 'idle',
    error: null,
    reportingPeriod: getCurrentMonthPeriod(),
    selectedConnectionId: null,
    connections: [],
    costCenters: [],
    costRecords: [],
    budgets: [],
  };
}
