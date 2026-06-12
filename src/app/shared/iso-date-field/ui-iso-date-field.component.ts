import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { formatIsoDate, parseIsoDate } from '../date/iso-date';

@Component({
    selector: 'app-iso-date-field',
    imports: [
        ReactiveFormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
    ],
    templateUrl: './ui-iso-date-field.component.html',
    styleUrl: './ui-iso-date-field.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiIsoDateFieldComponent),
            multi: true,
        },
    ]
})
export class UiIsoDateFieldComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  readonly dateSelected = output<void>();

  readonly minDate = computed(() => {
    const value = this.min();
    return value ? parseIsoDate(value) : null;
  });

  readonly maxDate = computed(() => {
    const value = this.max();
    return value ? parseIsoDate(value) : null;
  });

  readonly dateControl = new FormControl<Date | null>(null);
  readonly isDisabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.dateControl.valueChanges.subscribe((date) => {
      this.onChange(date ? formatIsoDate(date) : '');
    });
  }

  writeValue(value: string): void {
    this.dateControl.setValue(value ? parseIsoDate(value) : null, { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
    if (disabled) {
      this.dateControl.disable({ emitEvent: false });
      return;
    }
    this.dateControl.enable({ emitEvent: false });
  }

  onDateChange(): void {
    this.onTouched();
    this.dateSelected.emit();
  }
}
