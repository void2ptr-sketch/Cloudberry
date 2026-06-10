import { TestBed } from '@angular/core/testing';

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
      providers: [AppLocaleService],
    });

    const fixture = TestBed.createComponent(LocaleSwitcherComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.ui-locale-switcher__btn',
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(3);
    expect(buttons[1]?.getAttribute('aria-label')).toBe('English');
  });

  it('persists locale on selection', () => {
    TestBed.configureTestingModule({
      imports: [LocaleSwitcherComponent],
      providers: [AppLocaleService],
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
          defaultCurrency: 'USD',
        }),
      );
    });

    const fixture = TestBed.createComponent(LocaleSwitcherComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.ui-locale-switcher__btn',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[2]?.click();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      locale?: string;
    };
    expect(stored.locale).toBe('zh');
  });
});
