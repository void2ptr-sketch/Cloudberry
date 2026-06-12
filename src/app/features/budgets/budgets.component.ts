import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ThemePalette } from '@angular/material/core';

import { ORG_SCOPE_ID, type Budget, type BudgetInput } from '../../core/domain';
import { AppStore } from '../../core/state';
import type { BudgetUsageStatus } from '../../core/state/budget-usage.type';
import { createPaginationState, UiPaginationComponent } from '../../shared/pagination';
import { UiResourceStatusComponent } from '../../shared/ui-resource-status';
import { BudgetFormComponent } from './budget-form.component';

@Component({
    selector: 'app-budgets',
    imports: [
        BudgetFormComponent,
        DecimalPipe,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatListModule,
        MatProgressBarModule,
        UiPaginationComponent,
        UiResourceStatusComponent,
    ],
    templateUrl: './budgets.component.html',
    styleUrl: './budgets.component.scss'
})
export class BudgetsComponent implements OnInit {
  private readonly store = inject(AppStore);
  private readonly pagination = createPaginationState({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 25],
  });

  readonly budgets = this.store.budgets;
  readonly paginatedBudgets = this.pagination.createSlice(this.budgets);
  readonly pageIndex = this.pagination.pageIndex;
  readonly pageSize = this.pagination.pageSize;
  readonly pageSizeOptions = this.pagination.pageSizeOptions;
  readonly onPageChange = this.pagination.onPageChange;
  readonly budgetsState = this.store.budgetsState;
  readonly budgetUsageStatuses = this.store.budgetUsageStatuses;
  readonly activeBudgetAlerts = this.store.activeBudgetAlerts;
  readonly costCenters = this.store.costCenters;

  readonly showForm = signal(false);
  readonly editingBudget = signal<Budget | null>(null);

  constructor() {
    this.pagination.bindItemCount(computed(() => this.budgets().length));
  }

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
    const name = budget.name;
    const confirmed = confirm($localize`:@@budgets.confirmDelete:Удалить бюджет «${name}»?`);
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
    const name = alert.budgetName;
    const threshold = String(alert.threshold);
    const percent = alert.usagePercent.toFixed(1);
    const spent = alert.spentAmount.toFixed(2);
    const limit = alert.limitAmount.toFixed(2);
    const currency = alert.currency;
    return $localize`:@@budgets.alert:${name} — достигнут порог ${threshold}% (${percent}%: ${spent} / ${limit} ${currency})`;
  }

  limitLabel(amount: number, currency: string): string {
    const formattedAmount = amount.toFixed(2);
    return $localize`:@@budgets.limit:Лимит: ${formattedAmount} ${currency}`;
  }

  scopeLabel(scopeId: string): string {
    if (scopeId === ORG_SCOPE_ID) {
      return $localize`:@@budget.scope.org:Вся организация`;
    }
    const center = this.costCenters().find((item) => item.id === scopeId);
    return center?.name ?? scopeId;
  }

  formatPeriod(start: string, end: string): string {
    return `${start} — ${end}`;
  }

  progressColor(usagePercent: number): ThemePalette {
    if (usagePercent >= 100) {
      return 'warn';
    }
    if (usagePercent >= 80) {
      return 'accent';
    }
    return 'primary';
  }

  alertClass(threshold: 80 | 100): string {
    return threshold === 100 ? 'budgets-alert--critical' : 'budgets-alert--warning';
  }
}
