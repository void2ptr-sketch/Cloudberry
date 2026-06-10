import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UiLocaleService, UiTranslateService } from '../../shared/ui-locale';
import { mapHttpError, resolveErrorMessage } from './map-http-error';

describe('mapHttpError', () => {
  let translate: UiTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiLocaleService, UiTranslateService],
    });
    translate = TestBed.inject(UiTranslateService);
  });

  it('maps network errors to localized message', () => {
    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    const mapped = mapHttpError(error, translate);

    expect(mapped.status).toBe(0);
    expect(mapped.message).toBe('Нет соединения с сервером');
  });

  it('resolveErrorMessage returns ApiHttpError message', () => {
    const apiError = { kind: 'api-http' as const, status: 404, message: 'Not found', url: '/api/foo' };
    expect(resolveErrorMessage(apiError, translate)).toBe('Not found');
  });

  it('resolveErrorMessage falls back to catalog key', () => {
    expect(resolveErrorMessage(new Error('boom'), translate, 'common.errorLoad')).toBe(
      'Ошибка загрузки данных',
    );
  });
});
