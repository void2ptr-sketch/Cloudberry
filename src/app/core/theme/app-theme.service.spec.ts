import { TestBed } from '@angular/core/testing';

import { AppThemeService } from './app-theme.service';

describe('AppThemeService', () => {
  beforeEach(() => {
    document.body.className = '';
    TestBed.configureTestingModule({
      providers: [AppThemeService],
    });
  });

  it('applies theme class on body', () => {
    const service = TestBed.inject(AppThemeService);
    service.apply('dev');

    expect(service.theme()).toBe('dev');
    expect(document.body.classList.contains('theme-dev')).toBeTrue();
    expect(document.body.classList.contains('theme-prod')).toBeFalse();
  });

  it('replaces previous theme class', () => {
    const service = TestBed.inject(AppThemeService);
    service.apply('test');
    service.apply('prod');

    expect(document.body.classList.contains('theme-prod')).toBeTrue();
    expect(document.body.classList.contains('theme-test')).toBeFalse();
  });
});
