import { Component, inject } from '@angular/core';

import { UI_LOCALE_OPTIONS } from '../ui-locale-options';
import { UiLocaleService } from '../ui-locale.service';
import { UiTranslatePipe } from '../ui-translate';
import type { UiLocale } from '../ui-locale.type';

@Component({
  selector: 'app-ui-locale-switcher',
  standalone: true,
  imports: [UiTranslatePipe],
  templateUrl: './ui-locale-switcher.component.html',
  styleUrl: './ui-locale-switcher.component.scss',
})
export class UiLocaleSwitcherComponent {
  private readonly uiLocale = inject(UiLocaleService);

  readonly options = UI_LOCALE_OPTIONS;
  readonly locale = this.uiLocale.locale;

  selectLocale(locale: UiLocale): void {
    this.uiLocale.setLocale(locale);
  }
}
