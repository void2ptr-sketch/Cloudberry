import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  UI_LOCALE_OPTIONS,
  UiLocaleService,
  UiTranslatePipe,
  type UiLocale,
} from '../../shared/ui-locale';
import { UserProfileService } from './user-profile.service';
import type { UserProfileInput } from './user-profile-input.type';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, UiTranslatePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userProfileService = inject(UserProfileService);
  private readonly uiLocale = inject(UiLocaleService);

  readonly localeOptions = UI_LOCALE_OPTIONS;
  readonly saved = signal(false);

  readonly form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    locale: ['ru' as UiLocale, Validators.required],
    defaultCurrency: ['USD', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
  });

  constructor() {
    const profile = this.userProfileService.userProfile();
    this.form.setValue({
      displayName: profile.displayName,
      email: profile.email,
      locale: profile.locale,
      defaultCurrency: profile.defaultCurrency,
    });

    this.form.controls.locale.valueChanges.pipe(takeUntilDestroyed()).subscribe((locale) => {
      this.uiLocale.initLocale(locale);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.userProfileService.update(this.form.getRawValue() as UserProfileInput);
    this.saved.set(true);
  }

  resetToDefaults(): void {
    const confirmed = confirm(this.userProfileService.confirmResetMessage());
    if (!confirmed) {
      return;
    }

    this.userProfileService.reset();
    const profile = this.userProfileService.userProfile();
    this.form.setValue({
      displayName: profile.displayName,
      email: profile.email,
      locale: profile.locale,
      defaultCurrency: profile.defaultCurrency,
    });
    this.saved.set(false);
  }
}
