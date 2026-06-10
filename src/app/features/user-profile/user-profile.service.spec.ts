import { TestBed } from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';

describe('UserProfileService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [UserProfileService],
    });
  });

  it('starts with default profile', () => {
    const service = TestBed.inject(UserProfileService);
    expect(service.displayName()).toBe('Пользователь');
    expect(service.userProfile().locale).toBe('ru');
  });

  it('updates and persists profile', () => {
    const service = TestBed.inject(UserProfileService);
    service.update({
      displayName: 'Alex',
      email: 'alex@example.com',
      locale: 'en',
      defaultCurrency: 'EUR',
    });

    expect(service.displayName()).toBe('Alex');
    expect(localStorage.getItem('cloudberry.user-profile')).toContain('Alex');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [UserProfileService] });
    const reloaded = TestBed.inject(UserProfileService);
    expect(reloaded.displayName()).toBe('Alex');
    expect(reloaded.userProfile().defaultCurrency).toBe('EUR');
  });

  it('resets profile to defaults', () => {
    const service = TestBed.inject(UserProfileService);
    service.update({
      displayName: 'Alex',
      email: 'alex@example.com',
      locale: 'en',
      defaultCurrency: 'EUR',
    });
    service.reset();
    expect(service.displayName()).toBe('Пользователь');
    expect(service.userProfile().email).toBe('');
  });
});
