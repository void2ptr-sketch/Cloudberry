import { createSmokeFixture, navigateSmoke, shellContent } from './smoke.harness';

describe('App smoke', () => {
  it('redirects root to dashboard with shell layout', async () => {
    const smoke = await createSmokeFixture();
    const root = await navigateSmoke(smoke, '/');

    expect(root.querySelector('.shell__brand')?.textContent).toContain('Cloudberry');
    expect(smoke.router.url).toContain('/dashboard');
    expect(shellContent(root).textContent).toContain('Расходы за период');
  });

  it('shows mock billing data on dashboard', async () => {
    const smoke = await createSmokeFixture();
    const content = shellContent(await navigateSmoke(smoke, '/dashboard'));

    expect(content.textContent).toContain('Общая статистика');
    expect(content.textContent).toContain('AWS Production');
    expect(content.textContent).toContain('Organization monthly');
    expect(content.textContent).toContain('Platform team');
    expect(content.textContent).toContain('Amazon EC2');
  });

  it('navigates to connections and lists mock connections', async () => {
    const smoke = await createSmokeFixture();
    const content = shellContent(await navigateSmoke(smoke, '/connections'));

    expect(content.textContent).toContain('Подключения к облакам');
    expect(content.textContent).toContain('AWS Production');
    expect(content.textContent).toContain('Azure Shared');
  });

  it('navigates to costs and lists mock cost records', async () => {
    const smoke = await createSmokeFixture();
    const content = shellContent(await navigateSmoke(smoke, '/costs'));

    expect(content.textContent).toContain('Расходы');
    expect(content.textContent).toContain('Amazon EC2');
    expect(content.textContent).toContain('Amazon S3');
  });

  it('navigates to budgets and lists mock budgets', async () => {
    const smoke = await createSmokeFixture();
    const content = shellContent(await navigateSmoke(smoke, '/budgets'));

    expect(content.textContent).toContain('Бюджеты');
    expect(content.textContent).toContain('Organization monthly');
    expect(content.textContent).toContain('Platform team');
  });

  it('navigates to profile and renders the form', async () => {
    const smoke = await createSmokeFixture();
    const content = shellContent(await navigateSmoke(smoke, '/profile'));

    expect(content.textContent).toContain('Профиль пользователя');
    expect(content.querySelector('form.profile-form')).not.toBeNull();
    expect(content.querySelector('input[formcontrolname="displayName"]')).not.toBeNull();
  });

  it('shows not-found page for unknown routes', async () => {
    const smoke = await createSmokeFixture();
    const content = shellContent(await navigateSmoke(smoke, '/unknown-route'));

    expect(content.textContent).toContain('Страница не найдена');
  });

  it('renders English navigation when locale is en', async () => {
    const smoke = await createSmokeFixture({ locale: 'en' });
    const root = await navigateSmoke(smoke, '/dashboard');

    const connectionsLink = root.querySelector('a[href="/connections"]');
    expect(connectionsLink?.textContent?.trim()).toBe('Connections');
  });

  it('switches UI locale from header', async () => {
    const smoke = await createSmokeFixture();
    const root = await navigateSmoke(smoke, '/dashboard');

    const enButton = root.querySelector(
      '.ui-locale-switcher mat-button-toggle:nth-child(2) button',
    ) as HTMLButtonElement | null;
    expect(enButton).not.toBeNull();
    enButton?.click();
    smoke.fixture.detectChanges();

    const stored = JSON.parse(localStorage.getItem('cloudberry.user-profile') ?? '{}') as {
      locale?: string;
    };
    expect(stored.locale).toBe('en');
  });
});
