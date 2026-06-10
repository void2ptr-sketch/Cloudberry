import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CLOUD_PROVIDER_LABELS, type CloudProviderId } from '../../core/domain';
import { AppRoutePath } from '../../core/routing/app-route-paths';
import { AppStore } from '../../core/state';
import type { BudgetUsageStatus } from '../../core/state/budget-usage.type';
import { UiResourceStatusComponent } from '../../shared/ui-resource-status';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterLink, UiResourceStatusComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(AppStore);

  readonly reportingPeriod = this.store.reportingPeriod;
  readonly costSummary = this.store.costSummary;
  readonly connections = this.store.connections;
  readonly connectionCount = this.store.connectionCount;
  readonly budgetCount = this.store.budgetCount;
  readonly budgets = this.store.budgets;
  readonly budgetUsageStatuses = this.store.budgetUsageStatuses;
  readonly activeBudgetAlerts = this.store.activeBudgetAlerts;
  readonly billingState = this.store.billingState;
  readonly connectionsPath = ['/', AppRoutePath.connections];
  readonly budgetsPath = ['/', AppRoutePath.budgets];
  readonly providerLabels = CLOUD_PROVIDER_LABELS;

  ngOnInit(): void {
    void this.store.loadBillingData();
  }

  retryBillingLoad(): void {
    this.store.retryBillingLoad();
  }

  providerLabel(provider: CloudProviderId): string {
    return this.providerLabels[provider];
  }

  alertMessage(alert: {
    budgetName: string;
    threshold: 80 | 100;
    usagePercent: number;
  }): string {
    const name = alert.budgetName;
    const threshold = String(alert.threshold);
    const percent = alert.usagePercent.toFixed(1);
    return $localize`:@@dashboard.budgetsAlert:${name} — порог ${threshold}% (${percent}%)`;
  }

  usageFor(budgetId: string): BudgetUsageStatus | undefined {
    return this.budgetUsageStatuses().find((status) => status.budgetId === budgetId);
  }

  progressClass(usagePercent: number): string {
    if (usagePercent >= 100) {
      return 'dashboard-budgets__bar--critical';
    }
    if (usagePercent >= 80) {
      return 'dashboard-budgets__bar--warning';
    }
    return 'dashboard-budgets__bar--ok';
  }

  alertClass(threshold: 80 | 100): string {
    return threshold === 100
      ? 'dashboard-budgets__badge--critical'
      : 'dashboard-budgets__badge--warning';
  }
}
