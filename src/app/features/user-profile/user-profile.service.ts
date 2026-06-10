import { Injectable, computed, inject, signal } from '@angular/core';

import { UiLocaleService, UiTranslateService, type UiLocale } from '../../shared/ui-locale';
import { sanitizeUserProfile, sanitizeUserProfileInput } from './user-profile-sanitize';
import { createDefaultUserProfile } from './user-profile-defaults';
import type { UserProfile } from './user-profile.type';
import type { UserProfileInput } from './user-profile-input.type';

const STORAGE_KEY = 'cloudberry.user-profile';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly uiLocale = inject(UiLocaleService);
  private readonly translate = inject(UiTranslateService);
  private readonly profileState = signal<UserProfile>(this.loadFromStorage());

  readonly userProfile = this.profileState.asReadonly();
  readonly displayName = computed(() => this.profileState().displayName);

  constructor() {
    this.uiLocale.registerProfileSync((locale) => this.syncLocale(locale));
    this.uiLocale.initLocale(this.profileState().locale);
  }

  update(input: UserProfileInput): UserProfile {
    const updated: UserProfile = {
      ...this.profileState(),
      ...sanitizeUserProfileInput(input),
    };
    this.profileState.set(updated);
    this.persist(updated);
    this.uiLocale.initLocale(updated.locale);
    return updated;
  }

  confirmResetMessage(): string {
    return this.translate.t('profile.confirmReset');
  }

  reset(): void {
    const defaults = createDefaultUserProfile();
    this.profileState.set(defaults);
    this.persist(defaults);
    this.uiLocale.initLocale(defaults.locale);
  }

  private syncLocale(locale: UiLocale): void {
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
