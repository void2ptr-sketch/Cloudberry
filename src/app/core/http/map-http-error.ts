import { HttpErrorResponse } from '@angular/common/http';

import { isApiHttpError, type ApiHttpError } from './api-http-error.type';

const HTTP_ERROR_NETWORK = $localize`:@@http.error.network:Нет соединения с сервером`;
const HTTP_ERROR_UNAUTHORIZED = $localize`:@@http.error.unauthorized:Требуется авторизация`;
const HTTP_ERROR_FORBIDDEN = $localize`:@@http.error.forbidden:Доступ запрещён`;
const HTTP_ERROR_NOT_FOUND = $localize`:@@http.error.notFound:Ресурс не найден`;
const HTTP_ERROR_SERVER = $localize`:@@http.error.server:Ошибка сервера`;
const HTTP_ERROR_UNKNOWN = $localize`:@@http.error.unknown:Не удалось выполнить запрос`;
export const COMMON_ERROR_LOAD = $localize`:@@common.errorLoad:Ошибка загрузки данных`;

const STATUS_MESSAGES: Record<number, string> = {
  401: HTTP_ERROR_UNAUTHORIZED,
  403: HTTP_ERROR_FORBIDDEN,
  404: HTTP_ERROR_NOT_FOUND,
};

export function mapHttpError(error: HttpErrorResponse): ApiHttpError {
  const serverMessage = extractServerMessage(error);
  const message = serverMessage ?? resolveHttpErrorMessage(error);

  return {
    kind: 'api-http',
    status: error.status,
    message,
    url: error.url ?? '',
  };
}

export function resolveErrorMessage(
  error: unknown,
  fallbackMessage: string = COMMON_ERROR_LOAD,
): string {
  if (isApiHttpError(error)) {
    return error.message;
  }
  return fallbackMessage;
}

function resolveHttpErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return HTTP_ERROR_NETWORK;
  }

  const statusMessage = STATUS_MESSAGES[error.status];
  if (statusMessage) {
    return statusMessage;
  }

  if (error.status >= 500) {
    return HTTP_ERROR_SERVER;
  }

  return HTTP_ERROR_UNKNOWN;
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
