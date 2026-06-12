import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { CLOUD_PROVIDER_LABELS } from '../../core/domain';
import { AppStore } from '../../core/state';
import type { ReportingPeriod } from '../../core/state/app-state.model';
import { UiIsoDateFieldComponent } from '../../shared/iso-date-field';
import { createPaginationState, UiPaginationComponent } from '../../shared/pagination';
import { UiResourceStatusComponent } from '../../shared/ui-resource-status';
import {
  buildProviderReport,
  buildServiceReport,
  buildTagsReport,
} from './reports-summary';

@Component({
    selector: 'app-reports',
    imports: [
        DecimalPipe,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatListModule,
        MatTabsModule,
        UiIsoDateFieldComponent,
        UiPaginationComponent,
        UiResourceStatusComponent,
    ],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AppStore);
  private readonly providersPagination = createPaginationState({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 25],
  });
  private readonly tagsPagination = createPaginationState({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 25],
  });
  private readonly servicesPagination = createPaginationState({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 25],
  });

  readonly periodForm = this.fb.nonNullable.group({
    periodStart: ['', Validators.required],
    periodEnd: ['', Validators.required],
  });

  readonly reportingPeriod = this.store.reportingPeriod;
  readonly billingState = this.store.billingState;
  readonly periodRecords = this.store.periodCostRecords;
  readonly connections = this.store.connections;
  readonly costCenters = this.store.costCenters;

  readonly currency = computed(() => this.periodRecords()[0]?.currency ?? 'USD');

  readonly providerRows = computed(() =>
    buildProviderReport(this.connections(), this.periodRecords(), CLOUD_PROVIDER_LABELS),
  );

  readonly serviceRows = computed(() => buildServiceReport(this.periodRecords()));

  readonly tagRows = computed(() =>
    buildTagsReport(this.costCenters(), this.periodRecords(), this.untaggedLabel()),
  );

  readonly paginatedProviderRows = this.providersPagination.createSlice(this.providerRows);
  readonly providerPageIndex = this.providersPagination.pageIndex;
  readonly providerPageSize = this.providersPagination.pageSize;
  readonly providerPageSizeOptions = this.providersPagination.pageSizeOptions;
  readonly onProviderPageChange = this.providersPagination.onPageChange;

  readonly paginatedTagRows = this.tagsPagination.createSlice(this.tagRows);
  readonly tagPageIndex = this.tagsPagination.pageIndex;
  readonly tagPageSize = this.tagsPagination.pageSize;
  readonly tagPageSizeOptions = this.tagsPagination.pageSizeOptions;
  readonly onTagPageChange = this.tagsPagination.onPageChange;

  readonly paginatedServiceRows = this.servicesPagination.createSlice(this.serviceRows);
  readonly servicePageIndex = this.servicesPagination.pageIndex;
  readonly servicePageSize = this.servicesPagination.pageSize;
  readonly servicePageSizeOptions = this.servicesPagination.pageSizeOptions;
  readonly onServicePageChange = this.servicesPagination.onPageChange;

  constructor() {
    this.providersPagination.bindItemCount(computed(() => this.providerRows().length));
    this.tagsPagination.bindItemCount(computed(() => this.tagRows().length));
    this.servicesPagination.bindItemCount(computed(() => this.serviceRows().length));
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

  untaggedLabel(): string {
    return $localize`:@@reports.untagged:Без тега`;
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
