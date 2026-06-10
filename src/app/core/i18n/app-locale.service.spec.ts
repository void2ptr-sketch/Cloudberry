import { TestBed } from '@angular/core/testing';

import { AppLocaleService } from './app-locale.service';
import { readStoredLocale } from './app-locale-storage';

describe('AppLocaleService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads current locale from storage', () => {
    TestBed.configureTestingModule({
      providers: [AppLocaleService],
    });

    const service = TestBed.inject(AppLocaleService);
    expect(service.currentLocale()).toBe('ru');
    expect(readStoredLocale()).toBe('ru');
  });

  it('syncs locale through profile handler', () => {
    TestBed.configureTestingModule({
      providers: [AppLocaleService],
    });

    const service = TestBed.inject(AppLocaleService);
    const sync = jasmine.createSpy('sync');
    service.registerProfileSync(sync);

    service.switchLocale('en');

    expect(sync).toHaveBeenCalledWith('en');
  });
});
