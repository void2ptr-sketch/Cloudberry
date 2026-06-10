import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CLOUD_PROVIDER_OPTIONS,
  type CloudConnection,
  type CloudConnectionInput,
  type CloudProviderId,
} from '../../core/domain';
import { UiTranslatePipe } from '../../shared/ui-locale';

@Component({
  selector: 'app-connection-form',
  standalone: true,
  imports: [ReactiveFormsModule, UiTranslatePipe],
  templateUrl: './connection-form.component.html',
  styleUrl: './connection-form.component.scss',
})
export class ConnectionFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly connection = input<CloudConnection | null>(null);
  readonly saved = output<CloudConnectionInput>();
  readonly cancelled = output<void>();

  readonly providerOptions = CLOUD_PROVIDER_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    provider: ['aws' as CloudProviderId, Validators.required],
    externalAccountId: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(128)],
    ],
  });

  constructor() {
    effect(() => {
      const existing = this.connection();
      if (existing) {
        this.form.setValue({
          name: existing.name,
          provider: existing.provider,
          externalAccountId: existing.externalAccountId,
        });
        return;
      }
      this.form.reset({
        name: '',
        provider: 'aws',
        externalAccountId: '',
      });
    });
  }

  get isEditMode(): boolean {
    return this.connection() !== null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saved.emit(this.form.getRawValue());
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
