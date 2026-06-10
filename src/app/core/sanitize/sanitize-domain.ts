import type { Budget } from '../domain/budget.type';
import type { BudgetInput } from '../domain/budget-input.type';
import type { CloudConnection } from '../domain/cloud-connection.type';
import type { CloudConnectionInput } from '../domain/cloud-connection-input.type';
import { CLOUD_PROVIDER_OPTIONS } from '../domain/cloud-provider-options';
import type { CloudProviderId } from '../domain/cloud-provider.type';
import {
  CURRENCY_CODE_PATTERN,
  ISO_DATE_PATTERN,
  SCOPE_ID_PATTERN,
} from '../../shared/sanitize/sanitize-patterns';
import {
  sanitizeCurrencyCode,
  sanitizeExternalAccountId,
  sanitizeIsoDate,
  sanitizePositiveAmount,
  sanitizeScopeId,
  sanitizeText,
} from '../../shared/sanitize/sanitize-text';

const CLOUD_PROVIDER_IDS = new Set<CloudProviderId>(
  CLOUD_PROVIDER_OPTIONS.map((option) => option.id),
);

export function sanitizeCloudProviderId(value: CloudProviderId): CloudProviderId {
  return CLOUD_PROVIDER_IDS.has(value) ? value : 'other';
}

export function sanitizeCloudConnectionInput(input: CloudConnectionInput): CloudConnectionInput {
  return {
    name: sanitizeText(input.name, { maxLength: 80 }),
    provider: sanitizeCloudProviderId(input.provider),
    externalAccountId: sanitizeExternalAccountId(input.externalAccountId),
  };
}

export function sanitizeCloudConnection(connection: CloudConnection): CloudConnection | null {
  const sanitized = sanitizeCloudConnectionInput(connection);
  if (sanitized.name.length < 2 || sanitized.externalAccountId.length < 3) {
    return null;
  }

  return {
    id: connection.id,
    ...sanitized,
  };
}

export function sanitizeBudgetInput(input: BudgetInput): BudgetInput {
  const limitAmount = sanitizePositiveAmount(input.limitAmount);
  const currency = sanitizeCurrencyCode(input.currency);
  const periodStart = sanitizeIsoDate(input.periodStart);
  const periodEnd = sanitizeIsoDate(input.periodEnd);
  const scopeId = sanitizeScopeId(input.scopeId);

  return {
    name: sanitizeText(input.name, { maxLength: 80 }),
    limitAmount: limitAmount > 0 ? limitAmount : 1,
    currency: CURRENCY_CODE_PATTERN.test(currency) ? currency : 'USD',
    periodStart: ISO_DATE_PATTERN.test(periodStart) ? periodStart : input.periodStart,
    periodEnd: ISO_DATE_PATTERN.test(periodEnd) ? periodEnd : input.periodEnd,
    scopeId: SCOPE_ID_PATTERN.test(scopeId) ? scopeId : scopeId || 'org-default',
  };
}

export function sanitizeBudget(budget: Budget): Budget | null {
  const sanitized = sanitizeBudgetInput(budget);
  if (sanitized.name.length < 2) {
    return null;
  }

  return {
    id: budget.id,
    ...sanitized,
  };
}
