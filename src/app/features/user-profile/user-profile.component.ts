import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { APP_LOCALE_OPTIONS, type AppLocale } from '../../core/i18n';
import { APP_THEME_OPTIONS, type AppTheme } from '../../core/theme';
import { noUnsafeMarkupValidator } from '../../shared/sanitize';
import { sanitizeUserProfileInput } from './user-profile-sanitize';
import { UserProfileService } from './user-profile.service';
import type { UserProfileInput } from './user-profile-input.type';

@Component({
    selector: 'app-user-profile',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userProfileService = inject(UserProfileService);

  readonly localeOptions = APP_LOCALE_OPTIONS;
  readonly themeOptions = APP_THEME_OPTIONS;
  readonly saved = signal(false);

  readonly form = this.fb.nonNullable.group({
    displayName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        noUnsafeMarkupValidator(),
      ],
    ],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    locale: ['ru' as AppLocale, Validators.required],
    theme: ['prod' as AppTheme, Validators.required],
    defaultCurrency: ['USD', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
  });

  constructor() {
    const profile = this.userProfileService.userProfile();
    this.form.setValue({
      displayName: profile.displayName,
      email: profile.email,
      locale: profile.locale,
      theme: profile.theme,
      defaultCurrency: profile.defaultCurrency,
    });

    this.form.controls.theme.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((theme) => {
        this.userProfileService.applyTheme(theme);
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const sanitized = sanitizeUserProfileInput(this.form.getRawValue() as UserProfileInput);
    if (sanitized.displayName.length < 2) {
      this.form.controls.displayName.setErrors({ minlength: true });
      this.form.controls.displayName.markAsTouched();
      return;
    }
    this.userProfileService.update(sanitized);
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
      theme: profile.theme,
      defaultCurrency: profile.defaultCurrency,
    });
    this.saved.set(false);
  }
}
