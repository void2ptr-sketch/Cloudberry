import { Injectable, computed, inject, signal } from '@angular/core';

import { AppLocaleService, APP_LOCALE_RELOAD, type AppLocale } from '../../core/i18n';
import { sanitizeUserProfile, sanitizeUserProfileInput } from './user-profile-sanitize';
import { createDefaultUserProfile } from './user-profile-defaults';
import type { UserProfile } from './user-profile.type';
import type { UserProfileInput } from './user-profile-input.type';

const STORAGE_KEY = 'cloudberry.user-profile';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly appLocale = inject(AppLocaleService);
  private readonly reloadPage = inject(APP_LOCALE_RELOAD);
  private readonly profileState = signal<UserProfile>(this.loadFromStorage());

  readonly userProfile = this.profileState.asReadonly();
  readonly displayName = computed(() => this.profileState().displayName);

  constructor() {
    this.appLocale.registerProfileSync((locale) => this.syncLocale(locale));
  }

  update(input: UserProfileInput): UserProfile {
    const previousLocale = this.profileState().locale;
    const updated: UserProfile = {
      ...this.profileState(),
      ...sanitizeUserProfileInput(input),
    };
    this.profileState.set(updated);
    this.persist(updated);

    if (updated.locale !== previousLocale) {
      this.reloadPage();
    }

    return updated;
  }

  confirmResetMessage(): string {
    return $localize`:@@profile.confirmReset:Сбросить профиль к значениям по умолчанию?`;
  }

  reset(): void {
    const defaults = createDefaultUserProfile();
    const previousLocale = this.profileState().locale;
    this.profileState.set(defaults);
    this.persist(defaults);

    if (defaults.locale !== previousLocale) {
      this.reloadPage();
    }
  }

  private syncLocale(locale: AppLocale): void {
    const current = this.profileState();
    if (current.locale === locale) {
      return;
    }
    const updated: UserProfile = { ...current, locale };
    this.profileState.set(updated);
    this.persist(updated);
  }

  private loadFromStorage(): UserProfile {
    if (typeof localStorage === 'undefined') {
      return createDefaultUserProfile();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultUserProfile();
      }
      const parsed: unknown = JSON.parse(raw);
      if (!isUserProfile(parsed)) {
        return createDefaultUserProfile();
      }
      return sanitizeUserProfile(parsed);
    } catch {
      return createDefaultUserProfile();
    }
  }

  private persist(profile: UserProfile): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record['id'] === 'string' &&
    typeof record['displayName'] === 'string' &&
    typeof record['email'] === 'string' &&
    (record['locale'] === 'ru' || record['locale'] === 'en' || record['locale'] === 'zh') &&
    typeof record['defaultCurrency'] === 'string'
  );
}
