import { Injectable, computed, inject, signal } from '@angular/core';

import { BillingApiService } from '../api/billing-api.service';
import { BudgetsApiService } from '../api/budgets-api.service';
import { ConnectionsApiService } from '../api/connections-api.service';
import { APP_ENVIRONMENT } from '../config/environment.token';
import type {
  Budget,
  BudgetInput,
  CloudConnection,
  CloudConnectionInput,
  CostRecord,
} from '../domain';
import { createBudgetId, createConnectionId } from '../domain';
import { BudgetsStorageService } from '../storage/budgets-storage.service';
import { ConnectionsStorageService } from '../storage/connections-storage.service';
import { resolveErrorMessage } from '../http';
import { UiTranslateService } from '../../shared/ui-locale';
import { createInitialAppState } from './app-state.initial';
import { createMockAppState } from './app-state.mock';
import type { AppState, AppStatus, CostSummary, ReportingPeriod } from './app-state.model';
import { calculateAllBudgetUsage } from './budget-usage';
import { isDateWithinPeriod } from './reporting-period';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly billingApi = inject(BillingApiService);
  private readonly budgetsApi = inject(BudgetsApiService);
  private readonly connectionsApi = inject(ConnectionsApiService);
  private readonly budgetsStorage = inject(BudgetsStorageService);
  private readonly connectionsStorage = inject(ConnectionsStorageService);
  private readonly translate = inject(UiTranslateService);
  private readonly state = signal<AppState>(this.buildInitialState());

  readonly status = computed(() => this.state().status);
  readonly error = computed(() => this.state().error);
  readonly reportingPeriod = computed(() => this.state().reportingPeriod);
  readonly selectedConnectionId = computed(() => this.state().selectedConnectionId);
  readonly connections = computed(() => this.state().connections);
  readonly costCenters = computed(() => this.state().costCenters);
  readonly budgets = computed(() => this.state().budgets);

  readonly costRecords = computed(() => this.state().costRecords);

  readonly filteredCostRecords = computed(() => {
    const period = this.reportingPeriod();
    const connectionId = this.selectedConnectionId();
    return this.costRecords().filter((record) => {
      if (!isDateWithinPeriod(record.usageDate, period)) {
        return false;
      }
      if (connectionId !== null && record.connectionId !== connectionId) {
        return false;
      }
      return true;
    });
  });

  readonly costSummary = computed((): CostSummary => {
    const records = this.filteredCostRecords();
    const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
    const currency = records[0]?.currency ?? 'USD';
    return {
      totalAmount,
      currency,
      recordCount: records.length,
    };
  });

  readonly connectionCount = computed(() => this.connections().length);

  readonly budgetCount = computed(() => this.budgets().length);

  readonly budgetUsageStatuses = computed(() =>
    calculateAllBudgetUsage(this.budgets(), this.costRecords()),
  );

  readonly activeBudgetAlerts = computed(() =>
    this.budgetUsageStatuses().flatMap((status) => {
      const budget = this.budgets().find((item) => item.id === status.budgetId);
      if (!budget) {
        return [];
      }
      return status.triggeredThresholds.map((threshold) => ({
        budgetId: status.budgetId,
        budgetName: budget.name,
        threshold,
        usagePercent: status.usagePercent,
        spentAmount: status.spentAmount,
        limitAmount: status.limitAmount,
        currency: status.currency,
      }));
    }),
  );

  setStatus(status: AppStatus, error: string | null = null): void {
    this.state.update((current) => ({ ...current, status, error }));
  }

  setReportingPeriod(period: ReportingPeriod): void {
    this.state.update((current) => ({ ...current, reportingPeriod: period }));
  }

  selectConnection(connectionId: string | null): void {
    this.state.update((current) => ({ ...current, selectedConnectionId: connectionId }));
  }

  setConnections(connections: CloudConnection[]): void {
    this.state.update((current) => ({ ...current, connections }));
    this.persistConnections();
  }

  setCostRecords(costRecords: CostRecord[]): void {
    this.state.update((current) => ({ ...current, costRecords }));
  }

  setBudgets(budgets: Budget[]): void {
    this.state.update((current) => ({ ...current, budgets }));
    this.persistBudgets();
  }

  patchState(patch: Partial<AppState>): void {
    this.state.update((current) => ({ ...current, ...patch }));
    if (patch.connections !== undefined) {
      this.persistConnections();
    }
    if (patch.budgets !== undefined) {
      this.persistBudgets();
    }
  }

  addConnection(input: CloudConnectionInput): CloudConnection {
    const connection: CloudConnection = {
      id: createConnectionId(),
      ...input,
    };
    this.state.update((current) => ({
      ...current,
      connections: [...current.connections, connection],
    }));
    this.persistConnections();
    if (!this.env.enableDebug) {
      void this.connectionsApi.create(input).catch(() => undefined);
    }
    return connection;
  }

  updateConnection(id: string, input: CloudConnectionInput): void {
    this.state.update((current) => ({
      ...current,
      connections: current.connections.map((item) =>
        item.id === id ? { ...item, ...input } : item,
      ),
    }));
    this.persistConnections();
    if (!this.env.enableDebug) {
      void this.connectionsApi.update(id, input).catch(() => undefined);
    }
  }

  addBudget(input: BudgetInput): Budget {
    const budget: Budget = {
      id: createBudgetId(),
      ...input,
    };
    this.state.update((current) => ({
      ...current,
      budgets: [...current.budgets, budget],
    }));
    this.persistBudgets();
    if (!this.env.enableDebug) {
      void this.budgetsApi.create(input).catch(() => undefined);
    }
    return budget;
  }

  updateBudget(id: string, input: BudgetInput): void {
    this.state.update((current) => ({
      ...current,
      budgets: current.budgets.map((item) => (item.id === id ? { ...item, ...input } : item)),
    }));
    this.persistBudgets();
    if (!this.env.enableDebug) {
      void this.budgetsApi.update(id, input).catch(() => undefined);
    }
  }

  removeBudget(id: string): void {
    this.state.update((current) => ({
      ...current,
      budgets: current.budgets.filter((item) => item.id !== id),
    }));
    this.persistBudgets();
    if (!this.env.enableDebug) {
      void this.budgetsApi.delete(id).catch(() => undefined);
    }
  }

  removeConnection(id: string): void {
    this.state.update((current) => ({
      ...current,
      connections: current.connections.filter((item) => item.id !== id),
      selectedConnectionId:
        current.selectedConnectionId === id ? null : current.selectedConnectionId,
      costRecords: current.costRecords.filter((record) => record.connectionId !== id),
    }));
    this.persistConnections();
    if (!this.env.enableDebug) {
      void this.connectionsApi.delete(id).catch(() => undefined);
    }
  }

  /** Loads budgets from API (PROD) or keeps local/mock data (DEV). */
  async loadBudgets(): Promise<void> {
    if (this.env.enableDebug) {
      return;
    }

    try {
      const budgets = await this.budgetsApi.list();
      this.setBudgets(budgets);
    } catch {
      const stored = this.budgetsStorage.load();
      if (stored.length > 0) {
        this.state.update((current) => ({ ...current, budgets: stored }));
      }
    }
  }

  /** Loads connections from API (PROD) or keeps local/mock data (DEV). */
  async loadConnections(): Promise<void> {
    if (this.env.enableDebug) {
      return;
    }

    try {
      const connections = await this.connectionsApi.list();
      this.setConnections(connections);
    } catch {
      const stored = this.connectionsStorage.load();
      if (stored.length > 0) {
        this.state.update((current) => ({ ...current, connections: stored }));
      }
    }
  }

  /** Loads billing data from API. Skipped when mock data is enabled (DEV/TEST). */
  async loadBillingData(): Promise<void> {
    if (this.env.enableDebug) {
      return;
    }

    this.setStatus('loading');

    try {
      const snapshot = await this.billingApi.getSnapshot(this.reportingPeriod());
      this.patchState({
        connections: snapshot.connections,
        costCenters: snapshot.costCenters,
        costRecords: snapshot.costRecords,
        budgets: snapshot.budgets,
        status: 'ready',
        error: null,
      });
      this.persistConnections();
    } catch (error) {
      this.setStatus('error', resolveErrorMessage(error, this.translate, 'common.errorLoad'));
    }
  }

  private buildInitialState(): AppState {
    const base = this.env.enableDebug ? createMockAppState() : createInitialAppState();
    const storedConnections = this.connectionsStorage.load();
    const storedBudgets = this.budgetsStorage.load();

    let state = base;

    if (storedConnections.length > 0) {
      state = {
        ...state,
        connections: storedConnections,
        selectedConnectionId: storedConnections.some((c) => c.id === state.selectedConnectionId)
          ? state.selectedConnectionId
          : null,
      };
    }

    if (storedBudgets.length > 0) {
      state = { ...state, budgets: storedBudgets };
    }

    return state;
  }

  private persistConnections(): void {
    this.connectionsStorage.save(this.connections());
  }

  private persistBudgets(): void {
    this.budgetsStorage.save(this.budgets());
  }
}
