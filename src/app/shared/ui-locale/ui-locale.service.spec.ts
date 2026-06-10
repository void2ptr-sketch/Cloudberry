import { TestBed } from '@angular/core/testing';

import { UiLocaleService } from './ui-locale.service';

describe('UiLocaleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiLocaleService],
    });
  });

  it('starts with default locale', () => {
    const service = TestBed.inject(UiLocaleService);
    expect(service.locale()).toBe('ru');
  });

  it('setLocale updates signal and document lang', () => {
    const service = TestBed.inject(UiLocaleService);
    service.setLocale('en');
    expect(service.locale()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('maps Chinese locale to zh-CN document lang', () => {
    const service = TestBed.inject(UiLocaleService);
    service.setLocale('zh');
    expect(service.locale()).toBe('zh');
    expect(document.documentElement.lang).toBe('zh-CN');
  });

  it('setLocale notifies profile sync handler', () => {
    const service = TestBed.inject(UiLocaleService);
    const synced: string[] = [];
    service.registerProfileSync((locale) => synced.push(locale));

    service.setLocale('en');
    expect(synced).toEqual(['en']);

    service.setLocale('en');
    expect(synced).toEqual(['en']);
  });

  it('initLocale does not notify profile sync handler', () => {
    const service = TestBed.inject(UiLocaleService);
    const synced: string[] = [];
    service.registerProfileSync((locale) => synced.push(locale));

    service.initLocale('en');
    expect(service.locale()).toBe('en');
    expect(synced).toEqual([]);
  });
});
