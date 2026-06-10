import { InjectionToken } from '@angular/core';

function reloadPage(): void {
  if (typeof window === 'undefined' || 'jasmine' in globalThis) {
    return;
  }
  window.location.reload();
}

export const APP_LOCALE_RELOAD = new InjectionToken<() => void>('APP_LOCALE_RELOAD', {
  providedIn: 'root',
  factory: () => reloadPage,
});
