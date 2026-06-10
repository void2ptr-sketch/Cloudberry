import { Injectable, inject } from '@angular/core';

import { UI_MESSAGES } from '../ui-messages';
import type { UiMessageKey } from '../ui-messages/ui-message-key.type';
import { UiLocaleService } from '../ui-locale.service';

export type UiTranslateParams = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class UiTranslateService {
  private readonly uiLocale = inject(UiLocaleService);

  t(key: UiMessageKey, params?: UiTranslateParams): string {
    const locale = this.uiLocale.locale();
    const catalog = UI_MESSAGES[locale];
    const fallback = UI_MESSAGES.ru[key];
    let message = catalog[key] ?? fallback ?? key;

    if (!params) {
      return message;
    }

    for (const [name, value] of Object.entries(params)) {
      message = message.replaceAll(`{${name}}`, value);
    }
    return message;
  }
}
