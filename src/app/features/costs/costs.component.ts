import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import type { CloudConnection, CostRecord } from '../../core/domain';
import { AppStore } from '../../core/state';
import type { ReportingPeriod } from '../../core/state/app-state.model';
import { UiIsoDateFieldComponent } from '../../shared/iso-date-field';
import { createPaginationState, UiPaginationComponent } from '../../shared/pagination';
import { UiResourceStatusComponent } from '../../shared/ui-resource-status';

@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    UiIsoDateFieldComponent,
    UiPaginationComponent,
    UiResourceStatusComponent,
  ],
  templateUrl: './costs.component.html',
  styleUrl: './costs.component.scss',
})
export class CostsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AppStore);
  private readonly pagination = createPaginationState({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 25],
  });

  readonly periodForm = this.fb.nonNullable.group({
    periodStart: ['', Validators.required],
    periodEnd: ['', Validators.required],
  });

  readonly reportingPeriod = this.store.reportingPeriod;
  readonly billingState = this.store.billingState;
  readonly connections = this.store.connections;
  readonly selectedConnectionId = this.store.selectedConnectionId;
  readonly costRecords = this.store.filteredCostRecords;
  readonly paginatedCostRecords = this.pagination.createSlice(this.costRecords);
  readonly pageIndex = this.pagination.pageIndex;
  readonly pageSize = this.pagination.pageSize;
  readonly pageSizeOptions = this.pagination.pageSizeOptions;
  readonly onPageChange = this.pagination.onPageChange;
  readonly costSummary = this.store.costSummary;
  readonly costCenters = this.store.costCenters;

  constructor() {
    this.pagination.bindItemCount(computed(() => this.costRecords().length));
  }

  ngOnInit(): void {
    this.syncPeriodForm(this.reportingPeriod());
    void this.store.loadBillingData();
  }

  applyPeriodFilter(): void {
    const { periodStart, periodEnd } = this.periodForm.getRawValue();
    const endControl = this.periodForm.controls.periodEnd;

    if (!periodStart || !periodEnd) {
      return;
    }

    if (periodEnd < periodStart) {
      endControl.setErrors({ periodOrder: true });
      endControl.markAsTouched();
      return;
    }

    endControl.setErrors(null);
    const current = this.reportingPeriod();
    if (current.start === periodStart && current.end === periodEnd) {
      return;
    }

    this.store.setReportingPeriod({ start: periodStart, end: periodEnd });
  }

  retryBillingLoad(): void {
    this.store.retryBillingLoad();
  }

  connectionFilterValue(): string {
    return this.selectedConnectionId() ?? '';
  }

  onConnectionFilter(change: MatSelectChange): void {
    const value = change.value as string;
    this.store.selectConnection(value || null);
  }

  connectionName(connectionId: string): string {
    return this.connections().find((item) => item.id === connectionId)?.name ?? connectionId;
  }

  costCenterName(record: CostRecord): string {
    if (!record.costCenterId) {
      return $localize`:@@costs.costCenterNone:—`;
    }
    return (
      this.costCenters().find((item) => item.id === record.costCenterId)?.name ??
      record.costCenterId
    );
  }

  trackRecord(_index: number, record: CostRecord): string {
    return record.id;
  }

  trackConnection(_index: number, connection: CloudConnection): string {
    return connection.id;
  }

  private syncPeriodForm(period: ReportingPeriod): void {
    this.periodForm.setValue(
      {
        periodStart: period.start,
        periodEnd: period.end,
      },
      { emitEvent: false },
    );
  }
}
