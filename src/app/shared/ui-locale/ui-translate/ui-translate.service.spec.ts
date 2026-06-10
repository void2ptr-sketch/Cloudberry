import { TestBed } from '@angular/core/testing';

import { UiLocaleService } from '../ui-locale.service';
import { UiTranslateService } from './ui-translate.service';

describe('UiTranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiLocaleService, UiTranslateService],
    });
  });

  it('returns Russian message by default', () => {
    const translate = TestBed.inject(UiTranslateService);
    expect(translate.t('common.save')).toBe('Сохранить');
  });

  it('returns English message after locale switch', () => {
    const locale = TestBed.inject(UiLocaleService);
    const translate = TestBed.inject(UiTranslateService);

    locale.setLocale('en');
    expect(translate.t('common.save')).toBe('Save');
  });

  it('returns Chinese message after locale switch', () => {
    const locale = TestBed.inject(UiLocaleService);
    const translate = TestBed.inject(UiTranslateService);

    locale.setLocale('zh');
    expect(translate.t('common.save')).toBe('保存');
  });

  it('interpolates params', () => {
    const translate = TestBed.inject(UiTranslateService);
    expect(
      translate.t('dashboard.lead', { start: '2026-06-01', end: '2026-06-30' }),
    ).toContain('2026-06-01');
  });
});
