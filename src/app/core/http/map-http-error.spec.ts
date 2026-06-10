import { HttpErrorResponse } from '@angular/common/http';

import { mapHttpError, resolveErrorMessage } from './map-http-error';

describe('mapHttpError', () => {
  it('maps network errors to localized message', () => {
    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    const mapped = mapHttpError(error);

    expect(mapped.status).toBe(0);
    expect(mapped.message).toBe('Нет соединения с сервером');
  });

  it('resolveErrorMessage returns ApiHttpError message', () => {
    const apiError = { kind: 'api-http' as const, status: 404, message: 'Not found', url: '/api/foo' };
    expect(resolveErrorMessage(apiError)).toBe('Not found');
  });

  it('resolveErrorMessage falls back to default message', () => {
    expect(resolveErrorMessage(new Error('boom'))).toBe('Ошибка загрузки данных');
  });
});
