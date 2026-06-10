import { HttpErrorResponse } from '@angular/common/http';

import type { UiMessageKey } from '../../shared/ui-locale';
import { UiTranslateService } from '../../shared/ui-locale';
import { isApiHttpError, type ApiHttpError } from './api-http-error.type';

const STATUS_MESSAGE_KEYS: Record<number, UiMessageKey> = {
  401: 'http.error.unauthorized',
  403: 'http.error.forbidden',
  404: 'http.error.notFound',
};

export function mapHttpError(
  error: HttpErrorResponse,
  translate: UiTranslateService,
): ApiHttpError {
  const messageKey = resolveMessageKey(error);
  const serverMessage = extractServerMessage(error);
  const message = serverMessage ?? translate.t(messageKey);

  return {
    kind: 'api-http',
    status: error.status,
    message,
    url: error.url ?? '',
  };
}

export function resolveErrorMessage(
  error: unknown,
  translate: UiTranslateService,
  fallbackKey: UiMessageKey = 'common.errorLoad',
): string {
  if (isApiHttpError(error)) {
    return error.message;
  }
  return translate.t(fallbackKey);
}

function resolveMessageKey(error: HttpErrorResponse): UiMessageKey {
  if (error.status === 0) {
    return 'http.error.network';
  }

  const statusKey = STATUS_MESSAGE_KEYS[error.status];
  if (statusKey) {
    return statusKey;
  }

  if (error.status >= 500) {
    return 'http.error.server';
  }

  return 'http.error.unknown';
}

function extractServerMessage(error: HttpErrorResponse): string | null {
  const body: unknown = error.error;
  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  if (typeof body === 'object' && body !== null) {
    const record = body as Record<string, unknown>;
    if (typeof record['message'] === 'string' && record['message'].trim().length > 0) {
      return record['message'];
    }
  }

  return null;
}
