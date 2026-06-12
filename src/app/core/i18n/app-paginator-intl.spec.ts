import { loadTranslations } from '@angular/localize';
import { TestBed } from '@angular/core/testing';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { AppPaginatorIntl } from './app-paginator-intl';
import { buildTranslationMap } from './build-translation-map';
import { MESSAGES_EN } from '../../../locale/messages.en';
import { MESSAGES_RU } from '../../../locale/messages.ru';
import { MESSAGES_ZH } from '../../../locale/messages.zh';

describe('AppPaginatorIntl', () => {
  function createIntl(): AppPaginatorIntl {
    TestBed.configureTestingModule({
      providers: [{ provide: MatPaginatorIntl, useClass: AppPaginatorIntl }],
    });
    return TestBed.inject(MatPaginatorIntl) as AppPaginatorIntl;
  }

  it('uses Russian labels by default', () => {
    loadTranslations(buildTranslationMap(MESSAGES_RU));
    const intl = createIntl();

    expect(intl.itemsPerPageLabel).toBe('Элементов на странице:');
    expect(intl.getRangeLabel(0, 5, 12)).toBe('1 – 5 из 12');
    expect(intl.getRangeLabel(0, 5, 0)).toBe('0 из 0');
  });

  it('uses English labels after locale load', () => {
    loadTranslations(buildTranslationMap(MESSAGES_EN));
    const intl = createIntl();

    expect(intl.nextPageLabel).toBe('Next page');
    expect(intl.getRangeLabel(1, 5, 12)).toBe('6 – 10 of 12');
  });

  it('uses Chinese labels after locale load', () => {
    loadTranslations(buildTranslationMap(MESSAGES_ZH));
    const intl = createIntl();

    expect(intl.previousPageLabel).toBe('上一页');
    expect(intl.getRangeLabel(0, 5, 12)).toBe('第 1 – 5 条，共 12 条');
  });
});
