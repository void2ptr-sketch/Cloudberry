import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { APP_LOCALE_OPTIONS } from '../app-locale-options';
import { AppLocaleService } from '../app-locale.service';
import type { AppLocale } from '../app-locale.type';

@Component({
    selector: 'app-locale-switcher',
    imports: [MatButtonToggleModule],
    templateUrl: './locale-switcher.component.html',
    styleUrl: './locale-switcher.component.scss'
})
export class LocaleSwitcherComponent {
  private readonly appLocale = inject(AppLocaleService);

  readonly options = APP_LOCALE_OPTIONS;

  currentLocale(): AppLocale {
    return this.appLocale.currentLocale();
  }

  onLocaleChange(locale: AppLocale | null): void {
    if (locale) {
      this.appLocale.switchLocale(locale);
    }
  }
}
