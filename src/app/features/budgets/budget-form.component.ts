import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  ORG_SCOPE_ID,
  type Budget,
  type BudgetInput,
  type BudgetScopeOption,
} from '../../core/domain';
import { sanitizeBudgetInput } from '../../core/sanitize';
import { AppStore } from '../../core/state';
import { UiIsoDateFieldComponent } from '../../shared/iso-date-field';
import { noUnsafeMarkupValidator } from '../../shared/sanitize';

@Component({
    selector: 'app-budget-form',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        UiIsoDateFieldComponent,
    ],
    templateUrl: './budget-form.component.html',
    styleUrl: './budget-form.component.scss'
})
export class BudgetFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AppStore);

  readonly budget = input<Budget | null>(null);
  readonly saved = output<BudgetInput>();
  readonly cancelled = output<void>();

  readonly scopeOptions = computed((): BudgetScopeOption[] => {
    const costCenters = this.store.costCenters();
    return [
      { id: ORG_SCOPE_ID, label: $localize`:@@budget.scope.org:Вся организация` },
      ...costCenters.map((center) => ({ id: center.id, label: center.name })),
    ];
  });

  readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        noUnsafeMarkupValidator(),
      ],
    ],
    limitAmount: [0, [Validators.required, Validators.min(1)]],
    currency: ['USD', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
    periodStart: ['', Validators.required],
    periodEnd: ['', Validators.required],
    scopeId: [ORG_SCOPE_ID, Validators.required],
  });

  constructor() {
    effect(() => {
      const existing = this.budget();
      if (existing) {
        this.form.setValue({
          name: existing.name,
          limitAmount: existing.limitAmount,
          currency: existing.currency,
          periodStart: existing.periodStart,
          periodEnd: existing.periodEnd,
          scopeId: existing.scopeId,
        });
        return;
      }

      const period = this.store.reportingPeriod();
      this.form.reset({
        name: '',
        limitAmount: 1000,
        currency: 'USD',
        periodStart: period.start,
        periodEnd: period.end,
        scopeId: ORG_SCOPE_ID,
      });
    });
  }

  get isEditMode(): boolean {
    return this.budget() !== null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = sanitizeBudgetInput(this.form.getRawValue());
    if (value.name.length < 2) {
      this.form.controls.name.setErrors({ minlength: true });
      this.form.controls.name.markAsTouched();
      return;
    }
    if (value.periodStart > value.periodEnd) {
      this.form.controls.periodEnd.setErrors({ periodOrder: true });
      this.form.controls.periodEnd.markAsTouched();
      return;
    }

    this.saved.emit(value);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
