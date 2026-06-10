import { TestBed } from '@angular/core/testing';

import { APP_ENVIRONMENT } from '../../core/config/environment.token';
import { UserProfileService } from './user-profile.service';

describe('UserProfileService', () => {
  beforeEach(() => {
    document.body.className = '';
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        UserProfileService,
        {
          provide: APP_ENVIRONMENT,
          useValue: { production: false, name: 'dev', apiUrl: '', enableDebug: true },
        },
      ],
    });
  });

  it('starts with default profile', () => {
    const service = TestBed.inject(UserProfileService);
    expect(service.displayName()).toBe('Пользователь');
    expect(service.userProfile().locale).toBe('ru');
    expect(service.userProfile().theme).toBe('dev');
    expect(document.body.classList.contains('theme-dev')).toBeTrue();
  });

  it('updates and persists profile', () => {
    const service = TestBed.inject(UserProfileService);
    service.update({
      displayName: 'Alex',
      email: 'alex@example.com',
      locale: 'en',
      theme: 'test',
      defaultCurrency: 'EUR',
    });

    expect(service.displayName()).toBe('Alex');
    expect(localStorage.getItem('cloudberry.user-profile')).toContain('Alex');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [UserProfileService] });
    const reloaded = TestBed.inject(UserProfileService);
    expect(reloaded.displayName()).toBe('Alex');
    expect(reloaded.userProfile().defaultCurrency).toBe('EUR');
    expect(reloaded.userProfile().theme).toBe('test');
    expect(document.body.classList.contains('theme-test')).toBeTrue();
  });

  it('applies theme immediately when changed', () => {
    const service = TestBed.inject(UserProfileService);
    service.applyTheme('prod');

    expect(service.userProfile().theme).toBe('prod');
    expect(document.body.classList.contains('theme-prod')).toBeTrue();
    expect(localStorage.getItem('cloudberry.user-profile')).toContain('"theme":"prod"');
  });

  it('resets profile to defaults', () => {
    const service = TestBed.inject(UserProfileService);
    service.update({
      displayName: 'Alex',
      email: 'alex@example.com',
      locale: 'en',
      theme: 'test',
      defaultCurrency: 'EUR',
    });
    service.reset();
    expect(service.displayName()).toBe('Пользователь');
    expect(service.userProfile().email).toBe('');
  });
});
