import { sanitizeUserProfileInput } from './user-profile-sanitize';

describe('sanitizeUserProfileInput', () => {
  it('strips markup from display name', () => {
    expect(
      sanitizeUserProfileInput({
        displayName: '<b>Alex</b>',
        email: 'alex@example.com',
        locale: 'ru',
        theme: 'dev',
        defaultCurrency: 'usd',
      }),
    ).toEqual({
      displayName: 'Alex',
      email: 'alex@example.com',
      locale: 'ru',
      theme: 'dev',
      defaultCurrency: 'USD',
    });
  });
});
