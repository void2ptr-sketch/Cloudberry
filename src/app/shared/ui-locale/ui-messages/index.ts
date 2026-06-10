import type { UiMessageCatalog } from './ui-message-catalog.type';
import type { UiLocale } from '../ui-locale.type';
import { UI_MESSAGES_EN } from './ui-messages.en';
import { UI_MESSAGES_RU } from './ui-messages.ru';
import { UI_MESSAGES_ZH } from './ui-messages.zh';

export type { UiMessageCatalog } from './ui-message-catalog.type';

export const UI_MESSAGES: Record<UiLocale, UiMessageCatalog> = {
  ru: UI_MESSAGES_RU,
  en: UI_MESSAGES_EN,
  zh: UI_MESSAGES_ZH,
};
