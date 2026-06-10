import { TestBed } from '@angular/core/testing';

import { UiLocaleService } from '../ui-locale.service';
import { UiLocaleSwitcherComponent } from './ui-locale-switcher.component';

describe('UiLocaleSwitcherComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLocaleSwitcherComponent],
      providers: [UiLocaleService],
    }).compileComponents();
  });

  it('renders RU, EN and Chinese buttons', () => {
    const fixture = TestBed.createComponent(UiLocaleSwitcherComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.ui-locale-switcher__btn',
    ) as NodeListOf<HTMLButtonElement>;
    const labels = Array.from(buttons).map((btn) => btn.textContent?.trim());

    expect(labels).toEqual(['RU', 'EN', '中文']);
  });

  it('switches locale on Chinese button click', () => {
    const fixture = TestBed.createComponent(UiLocaleSwitcherComponent);
    const locale = TestBed.inject(UiLocaleService);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.ui-locale-switcher__btn',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[2]?.click();
    fixture.detectChanges();

    expect(locale.locale()).toBe('zh');
    expect(buttons[2]?.classList.contains('ui-locale-switcher__btn--active')).toBeTrue();
  });
});
