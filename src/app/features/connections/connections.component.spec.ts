import { loadTranslations } from '@angular/localize';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { BillingApiService } from '../../core/api/billing-api.service';
import { buildTranslationMap } from '../../core/i18n/build-translation-map';
import { MESSAGES_RU } from '../../core/i18n/messages/messages.ru';
import { BudgetsApiService } from '../../core/api/budgets-api.service';
import { ConnectionsApiService } from '../../core/api/connections-api.service';
import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { AppStore } from '../../core/state';
import { ConnectionsComponent } from './connections.component';

describe('ConnectionsComponent', () => {
  beforeEach(async () => {
    loadTranslations(buildTranslationMap(MESSAGES_RU));
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ConnectionsComponent],
      providers: [
        provideRouter([]),
        AppStore,
        {
          provide: APP_ENVIRONMENT,
          useValue: { production: false, name: 'dev', apiUrl: '', enableDebug: false },
        },
        {
          provide: BillingApiService,
          useValue: { getSnapshot: () => Promise.resolve({ connections: [], costCenters: [], costRecords: [], budgets: [] }) },
        },
        {
          provide: ConnectionsApiService,
          useValue: { list: () => Promise.resolve([]), create: () => Promise.resolve(), update: () => Promise.resolve(), delete: () => Promise.resolve() },
        },
        {
          provide: BudgetsApiService,
          useValue: { list: () => Promise.resolve([]), create: () => Promise.resolve(), update: () => Promise.resolve(), delete: () => Promise.resolve() },
        },
      ],
    }).compileComponents();
  });

  it('should create and show empty state', async () => {
    const fixture = TestBed.createComponent(ConnectionsComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Подключений пока нет');
  });
});
