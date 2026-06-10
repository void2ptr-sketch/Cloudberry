import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { ORG_SCOPE_ID, type Budget, type BudgetInput } from '../../core/domain';
import { AppStore } from '../../core/state';
import type { BudgetUsageStatus } from '../../core/state/budget-usage.type';
import { UiResourceStatusComponent } from '../../shared/ui-resource-status';
import { UiTranslatePipe, UiTranslateService } from '../../shared/ui-locale';
import { BudgetFormComponent } from './budget-form.component';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [BudgetFormComponent, DecimalPipe, UiResourceStatusComponent, UiTranslatePipe],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  private readonly store = inject(AppStore);
  private readonly translate = inject(UiTranslateService);

  readonly budgets = this.store.budgets;
  readonly budgetsState = this.store.budgetsState;
  readonly budgetUsageStatuses = this.store.budgetUsageStatuses;
  readonly activeBudgetAlerts = this.store.activeBudgetAlerts;
  readonly costCenters = this.store.costCenters;

  readonly showForm = signal(false);
  readonly editingBudget = signal<Budget | null>(null);

  ngOnInit(): void {
    void this.store.loadBudgets();
  }

  retryBudgetsLoad(): void {
    this.store.retryBudgetsLoad();
  }

  openCreateForm(): void {
    this.editingBudget.set(null);
    this.showForm.set(true);
  }

  openEditForm(budget: Budget): void {
    this.editingBudget.set(budget);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingBudget.set(null);
  }

  onFormSaved(input: BudgetInput): void {
    const editing = this.editingBudget();
    if (editing) {
      this.store.updateBudget(editing.id, input);
    } else {
      this.store.addBudget(input);
    }
    this.closeForm();
  }

  removeBudget(budget: Budget): void {
    const confirmed = confirm(
      this.translate.t('budgets.confirmDelete', { name: budget.name }),
    );
    if (!confirmed) {
      return;
    }
    this.store.removeBudget(budget.id);
    if (this.editingBudget()?.id === budget.id) {
      this.closeForm();
    }
  }

  usageFor(budgetId: string): BudgetUsageStatus | undefined {
    return this.budgetUsageStatuses().find((status) => status.budgetId === budgetId);
  }

  alertMessage(alert: {
    budgetName: string;
    threshold: 80 | 100;
    usagePercent: number;
    spentAmount: number;
    limitAmount: number;
    currency: string;
  }): string {
    return this.translate.t('budgets.alert', {
      name: alert.budgetName,
      threshold: String(alert.threshold),
      percent: alert.usagePercent.toFixed(1),
      spent: alert.spentAmount.toFixed(2),
      limit: alert.limitAmount.toFixed(2),
      currency: alert.currency,
    });
  }

  limitLabel(amount: number, currency: string): string {
    return this.translate.t('budgets.limit', {
      amount: amount.toFixed(2),
      currency,
    });
  }

  scopeLabel(scopeId: string): string {
    if (scopeId === ORG_SCOPE_ID) {
      return this.translate.t('budget.scope.org');
    }
    const center = this.costCenters().find((item) => item.id === scopeId);
    return center?.name ?? scopeId;
  }

  formatPeriod(start: string, end: string): string {
    return `${start} — ${end}`;
  }

  progressClass(usagePercent: number): string {
    if (usagePercent >= 100) {
      return 'budgets-progress__bar--critical';
    }
    if (usagePercent >= 80) {
      return 'budgets-progress__bar--warning';
    }
    return 'budgets-progress__bar--ok';
  }

  alertClass(threshold: 80 | 100): string {
    return threshold === 100 ? 'budgets-alert--critical' : 'budgets-alert--warning';
  }
}
