import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import {
  EXTERNAL_ACCOUNT_ID_PATTERN,
  UNSAFE_MARKUP_PATTERN,
} from './sanitize-patterns';

export function noUnsafeMarkupValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value !== 'string' || value.length === 0) {
      return null;
    }

    return UNSAFE_MARKUP_PATTERN.test(value) ? { unsafeMarkup: true } : null;
  };
}

export function externalAccountIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value !== 'string' || value.length === 0) {
      return null;
    }

    if (UNSAFE_MARKUP_PATTERN.test(value)) {
      return { unsafeMarkup: true };
    }

    return EXTERNAL_ACCOUNT_ID_PATTERN.test(value) ? null : { accountIdFormat: true };
  };
}
