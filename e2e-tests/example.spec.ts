import { test, expect } from '@playwright/test';

test.describe('Playwright Page Test 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {
    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(
      page.getByRole('heading', { name: 'Installation' })
    ).toBeVisible();
  });

  test('get Copyright', async ({ page }) => {
    await expect(page.getByText('Copyright')).toBeVisible();
  });

  test('enable Search Form', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Search*/ })).toBeEnabled();
  });

  test('h3 titles', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Any browser • Any platform • One API',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'Resilient • No flaky tests',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'No trade-offs • No limits',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'Full isolation • Fast execution',
      })
    ).toBeVisible();
  });

  test('Dummy Fail tests 1', async ({ page }) => {
    await expect(page).toHaveTitle(/ops! this is a dummy test/);

    await expect(
      page.getByRole('heading', {
        name: 'ops! this is a dummy test',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('dialog', {
        name: 'ops! this is a dummy test',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('img', {
        name: 'ops! this is a dummy test',
      })
    ).toBeVisible();
  });
});

test.describe('Playwright Page Test 2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test("has words 'Playwright'", async ({ page }) => {
    const targets = await page.getByText(/Playwright/).all();
    expect(targets.length).toBeGreaterThan(0);
  });

  test('has Browser icon images', async ({ page }) => {
    expect(page.getByAltText(/Browsers/)).toBeVisible();
  });

  test('Dummy Fail tests 2', async ({ page }) => {
    await expect(page).toHaveTitle(/ops! this is a dummy test/);

    await expect(
      page.getByRole('alert', {
        name: 'ops! this is a dummy test',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('banner', {
        name: 'ops! this is a dummy test',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('tooltip', {
        name: 'ops! this is a dummy test',
      })
    ).toBeVisible();
  });
});
