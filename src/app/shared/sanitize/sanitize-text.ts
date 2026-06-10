import { UNSAFE_MARKUP_PATTERN } from './sanitize-patterns';

export type SanitizeTextOptions = {
  maxLength: number;
};

export function containsUnsafeMarkup(value: string): boolean {
  return UNSAFE_MARKUP_PATTERN.test(value);
}

export function sanitizeText(value: string, options: SanitizeTextOptions): string {
  let result = value.trim();
  result = result.replace(/<[^>]*>/g, '');
  result = result.replace(/\0/g, '');
  result = result.replace(/[\u0000-\u001F\u007F]/g, '');
  result = result.replace(/\s+/g, ' ');

  if (result.length > options.maxLength) {
    result = result.slice(0, options.maxLength);
  }

  return result;
}

export function sanitizeEmail(value: string): string {
  return sanitizeText(value, { maxLength: 120 }).toLowerCase();
}

export function sanitizeCurrencyCode(value: string): string {
  return sanitizeText(value, { maxLength: 3 }).toUpperCase();
}

export function sanitizeExternalAccountId(value: string): string {
  const withoutTags = value.replace(/<[^>]*>/g, '');
  const trimmed = withoutTags.trim().replace(/[^A-Za-z0-9._\-:/]/g, '');
  return trimmed.slice(0, 128);
}

export function sanitizeIsoDate(value: string): string {
  const trimmed = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : '';
}

export function sanitizeScopeId(value: string): string {
  const trimmed = value.trim().replace(/[^A-Za-z0-9._-]/g, '');
  return trimmed.slice(0, 64);
}

export function sanitizePositiveAmount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.round(value * 100) / 100);
}
