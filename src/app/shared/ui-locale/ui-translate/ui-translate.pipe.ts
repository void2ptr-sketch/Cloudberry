import { Pipe, PipeTransform, inject } from '@angular/core';

import type { UiMessageKey } from '../ui-messages/ui-message-key.type';
import { UiTranslateService, type UiTranslateParams } from './ui-translate.service';
import { UiLocaleService } from '../ui-locale.service';

@Pipe({
  name: 'uiT',
  standalone: true,
  pure: false,
})
export class UiTranslatePipe implements PipeTransform {
  private readonly translate = inject(UiTranslateService);
  private readonly uiLocale = inject(UiLocaleService);

  transform(key: UiMessageKey, params?: UiTranslateParams): string {
    this.uiLocale.locale();
    return this.translate.t(key, params);
  }
}
