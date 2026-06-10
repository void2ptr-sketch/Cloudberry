import { TestBed } from '@angular/core/testing';

import { BillingApiService } from '../api/billing-api.service';
import { BudgetsApiService } from '../api/budgets-api.service';
import { ConnectionsApiService } from '../api/connections-api.service';
import { APP_ENVIRONMENT } from '../config/environment.token';
import { BudgetsStorageService } from '../storage/budgets-storage.service';
import { ConnectionsStorageService } from '../storage/connections-storage.service';
import { UiLocaleService, UiTranslateService } from '../../shared/ui-locale';
import { AppStore } from './app-store.service';
import { createInitialAppState } from './app-state.initial';

describe('AppStore', () => {
  let connectionsStorage: ConnectionsStorageService;
  let budgetsStorage: BudgetsStorageService;

  beforeEach(() => {
    connectionsStorage = new ConnectionsStorageService();
    budgetsStorage = new BudgetsStorageService();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        UiLocaleService,
        UiTranslateService,
        AppStore,
        { provide: ConnectionsStorageService, useValue: connectionsStorage },
        { provide: BudgetsStorageService, useValue: budgetsStorage },
        {
          provide: APP_ENVIRONMENT,
          useValue: { production: false, name: 'dev', apiUrl: '', enableDebug: false },
        },
        {
          provide: BillingApiService,
          useValue: {
            getSnapshot: () =>
              Promise.resolve({
                connections: [],
                costCenters: [],
                costRecords: [],
                budgets: [],
              }),
          },
        },
        {
          provide: ConnectionsApiService,
          useValue: {
            list: () => Promise.resolve([]),
            create: () => Promise.reject(new Error('offline')),
            update: () => Promise.reject(new Error('offline')),
            delete: () => Promise.reject(new Error('offline')),
          },
        },
        {
          provide: BudgetsApiService,
          useValue: {
            list: () => Promise.resolve([]),
            create: () => Promise.reject(new Error('offline')),
            update: () => Promise.reject(new Error('offline')),
            delete: () => Promise.reject(new Error('offline')),
          },
        },
      ],
    });
  });

  it('starts with empty collections when debug is off', () => {
    const store = TestBed.inject(AppStore);
    expect(store.connections()).toEqual([]);
    expect(store.costSummary().totalAmount).toBe(0);
  });

  it('filters cost records by reporting period and connection', () => {
    const store = TestBed.inject(AppStore);
    store.patchState({
      ...createInitialAppState(),
      status: 'ready',
      reportingPeriod: { start: '2026-06-01', end: '2026-06-30' },
      selectedConnectionId: 'conn-1',
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
          service: 'S3',
          amount: 50,
          currency: 'USD',
          usageDate: '2026-06-10',
        },
        {
          id: '3',
          connectionId: 'conn-1',
          service: 'RDS',
          amount: 25,
          currency: 'USD',
          usageDate: '2026-05-31',
        },
      ],
    });

    expect(store.filteredCostRecords().map((r) => r.id)).toEqual(['1']);
    expect(store.costSummary().totalAmount).toBe(100);
  });

  it('loadBillingData writes API snapshot into state', async () => {
    const store = TestBed.inject(AppStore);
    await store.loadBillingData();
    expect(store.status()).toBe('ready');
    expect(store.connections()).toEqual([]);
  });

  it('addConnection persists to storage', () => {
    const store = TestBed.inject(AppStore);
    store.addConnection({
      name: 'GCP Dev',
      provider: 'gcp',
      externalAccountId: 'project-123',
    });
    expect(store.connections().length).toBe(1);
    expect(connectionsStorage.load().length).toBe(1);
  });

  it('addBudget persists to storage and computes alerts', () => {
    const store = TestBed.inject(AppStore);
    store.patchState({
      ...createInitialAppState(),
      status: 'ready',
      reportingPeriod: { start: '2026-06-01', end: '2026-06-30' },
      costRecords: [
        {
          id: '1',
          connectionId: 'conn-1',
          service: 'EC2',
          amount: 850,
          currency: 'USD',
          usageDate: '2026-06-10',
        },
      ],
    });

    store.addBudget({
      name: 'June',
      limitAmount: 1000,
      currency: 'USD',
      periodStart: '2026-06-01',
      periodEnd: '2026-06-30',
      scopeId: 'org-default',
    });

    expect(store.budgets().length).toBe(1);
    expect(budgetsStorage.load().length).toBe(1);
    expect(store.budgetUsageStatuses()[0]?.usagePercent).toBe(85);
    expect(store.activeBudgetAlerts().length).toBe(1);
    expect(store.activeBudgetAlerts()[0]?.threshold).toBe(80);
  });

  it('removeConnection clears selection when removed', () => {
    const store = TestBed.inject(AppStore);
    const created = store.addConnection({
      name: 'AWS',
      provider: 'aws',
      externalAccountId: '999',
    });
    store.selectConnection(created.id);
    store.removeConnection(created.id);
    expect(store.connections().length).toBe(0);
    expect(store.selectedConnectionId()).toBeNull();
  });

  it('loadBillingData skips HTTP when debug mock is enabled', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        UiLocaleService,
        UiTranslateService,
        AppStore,
        { provide: ConnectionsStorageService, useValue: connectionsStorage },
        { provide: BudgetsStorageService, useValue: budgetsStorage },
        {
          provide: APP_ENVIRONMENT,
          useValue: { production: false, name: 'dev', apiUrl: '', enableDebug: true },
        },
        {
          provide: BillingApiService,
          useValue: {
            getSnapshot: () => Promise.reject(new Error('should not be called')),
          },
        },
        {
          provide: ConnectionsApiService,
          useValue: {
            list: () => Promise.resolve([]),
            create: () => Promise.resolve(),
            update: () => Promise.resolve(),
            delete: () => Promise.resolve(),
          },
        },
        {
          provide: BudgetsApiService,
          useValue: {
            list: () => Promise.resolve([]),
            create: () => Promise.resolve(),
            update: () => Promise.resolve(),
            delete: () => Promise.resolve(),
          },
        },
      ],
    });
    const store = TestBed.inject(AppStore);
    const connectionsBefore = store.connections().length;
    await store.loadBillingData();
    expect(store.connections().length).toBe(connectionsBefore);
  });
});
