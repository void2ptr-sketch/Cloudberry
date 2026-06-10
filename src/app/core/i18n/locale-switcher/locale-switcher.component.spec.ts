import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { AppLocaleService } from '../app-locale.service';
import { LocaleSwitcherComponent } from './locale-switcher.component';

const STORAGE_KEY = 'cloudberry.user-profile';

describe('LocaleSwitcherComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders locale buttons', () => {
    TestBed.configureTestingModule({
      imports: [LocaleSwitcherComponent],
      providers: [provideNoopAnimations(), AppLocaleService],
    });

    const fixture = TestBed.createComponent(LocaleSwitcherComponent);
    fixture.detectChanges();

    const toggles = fixture.nativeElement.querySelectorAll(
      '.ui-locale-switcher mat-button-toggle',
    );
    expect(toggles.length).toBe(3);
    expect(toggles[1]?.textContent?.trim()).toBe('EN');
  });

  it('persists locale on selection', () => {
    TestBed.configureTestingModule({
      imports: [LocaleSwitcherComponent],
      providers: [provideNoopAnimations(), AppLocaleService],
    });

    const appLocale = TestBed.inject(AppLocaleService);
    appLocale.registerProfileSync((locale) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          id: 'test',
          displayName: 'User',
          email: '',
          locale,
          theme: 'prod',
          defaultCurrency: 'USD',
        }),
      );
    });

    const fixture = TestBed.createComponent(LocaleSwitcherComponent);
    fixture.detectChanges();

    const zhButton = fixture.nativeElement.querySelector(
      '.ui-locale-switcher mat-button-toggle:nth-child(3) button',
    ) as HTMLButtonElement | null;
    zhButton?.click();
    fixture.detectChanges();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      locale?: string;
    };
    expect(stored.locale).toBe('zh');
  });
});
