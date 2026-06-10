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
import { sanitizeBudgetInput, sanitizeCloudConnectionInput } from '../sanitize';
import { resolveErrorMessage } from '../http';
import { createInitialAppState } from './app-state.initial';
import { createMockAppState } from './app-state.mock';
import type { AppState, CostSummary, ReportingPeriod } from './app-state.model';
import { calculateAllBudgetUsage } from './budget-usage';
import { isDateWithinPeriod } from './reporting-period';
import {
  errorResourceState,
  loadingResourceState,
  readyResourceState,
} from './resource-state';
import type { AppResourceKey } from './resource-state.type';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly billingApi = inject(BillingApiService);
  private readonly budgetsApi = inject(BudgetsApiService);
  private readonly connectionsApi = inject(ConnectionsApiService);
  private readonly budgetsStorage = inject(BudgetsStorageService);
  private readonly connectionsStorage = inject(ConnectionsStorageService);
  private readonly state = signal<AppState>(this.buildInitialState());

  readonly billingState = computed(() => this.state().resources.billing);
  readonly connectionsState = computed(() => this.state().resources.connections);
  readonly budgetsState = computed(() => this.state().resources.budgets);

  readonly status = computed(() => this.billingState().status);
  readonly error = computed(() => this.billingState().error);

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
    const safeInput = sanitizeCloudConnectionInput(input);
    const connection: CloudConnection = {
      id: createConnectionId(),
      ...safeInput,
    };
    this.state.update((current) => ({
      ...current,
      connections: [...current.connections, connection],
    }));
    this.persistConnections();
    if (!this.env.enableDebug) {
      void this.connectionsApi.create(safeInput).catch(() => undefined);
    }
    return connection;
  }

  updateConnection(id: string, input: CloudConnectionInput): void {
    const safeInput = sanitizeCloudConnectionInput(input);
    this.state.update((current) => ({
      ...current,
      connections: current.connections.map((item) =>
        item.id === id ? { ...item, ...safeInput } : item,
      ),
    }));
    this.persistConnections();
    if (!this.env.enableDebug) {
      void this.connectionsApi.update(id, safeInput).catch(() => undefined);
    }
  }

  addBudget(input: BudgetInput): Budget {
    const safeInput = sanitizeBudgetInput(input);
    const budget: Budget = {
      id: createBudgetId(),
      ...safeInput,
    };
    this.state.update((current) => ({
      ...current,
      budgets: [...current.budgets, budget],
    }));
    this.persistBudgets();
    if (!this.env.enableDebug) {
      void this.budgetsApi.create(safeInput).catch(() => undefined);
    }
    return budget;
  }

  updateBudget(id: string, input: BudgetInput): void {
    const safeInput = sanitizeBudgetInput(input);
    this.state.update((current) => ({
      ...current,
      budgets: current.budgets.map((item) => (item.id === id ? { ...item, ...safeInput } : item)),
    }));
    this.persistBudgets();
    if (!this.env.enableDebug) {
      void this.budgetsApi.update(id, safeInput).catch(() => undefined);
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

  retryBillingLoad(): void {
    void this.loadBillingData();
  }

  retryConnectionsLoad(): void {
    void this.loadConnections();
  }

  retryBudgetsLoad(): void {
    void this.loadBudgets();
  }

  /** Loads budgets from API (PROD) or keeps local/mock data (DEV). */
  async loadBudgets(): Promise<void> {
    if (this.env.enableDebug) {
      return;
    }

    this.setResourceState('budgets', loadingResourceState());

    try {
      const budgets = await this.budgetsApi.list();
      this.setBudgets(budgets);
      this.setResourceState('budgets', readyResourceState());
    } catch (error) {
      const stored = this.budgetsStorage.load();
      if (stored.length > 0) {
        this.state.update((current) => ({ ...current, budgets: stored }));
        this.setResourceState('budgets', readyResourceState());
        return;
      }

      this.setResourceState(
        'budgets',
        errorResourceState(resolveErrorMessage(error)),
      );
    }
  }

  /** Loads connections from API (PROD) or keeps local/mock data (DEV). */
  async loadConnections(): Promise<void> {
    if (this.env.enableDebug) {
      return;
    }

    this.setResourceState('connections', loadingResourceState());

    try {
      const connections = await this.connectionsApi.list();
      this.setConnections(connections);
      this.setResourceState('connections', readyResourceState());
    } catch (error) {
      const stored = this.connectionsStorage.load();
      if (stored.length > 0) {
        this.state.update((current) => ({ ...current, connections: stored }));
        this.setResourceState('connections', readyResourceState());
        return;
      }

      this.setResourceState(
        'connections',
        errorResourceState(resolveErrorMessage(error)),
      );
    }
  }

  /** Loads billing data from API. Skipped when mock data is enabled (DEV/TEST). */
  async loadBillingData(): Promise<void> {
    if (this.env.enableDebug) {
      return;
    }

    this.setResourceState('billing', loadingResourceState());

    try {
      const snapshot = await this.billingApi.getSnapshot(this.reportingPeriod());
      this.patchState({
        connections: snapshot.connections,
        costCenters: snapshot.costCenters,
        costRecords: snapshot.costRecords,
        budgets: snapshot.budgets,
      });
      this.persistConnections();
      this.persistBudgets();
      this.setResourceState('billing', readyResourceState());
    } catch (error) {
      this.setResourceState(
        'billing',
        errorResourceState(resolveErrorMessage(error)),
      );
    }
  }

  private setResourceState(key: AppResourceKey, resourceState: AppState['resources'][AppResourceKey]): void {
    this.state.update((current) => ({
      ...current,
      resources: {
        ...current.resources,
        [key]: resourceState,
      },
    }));
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
