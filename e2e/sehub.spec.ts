import { test, expect } from '@playwright/test';

test.describe('SEHub E2E Tests', () => {

  test('should load the homepage and display main heading', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    await expect(page.locator('text=Ваш особистий бортовий журнал для дослідження Всесвіту')).toBeVisible();
  });

  test('should navigate to login page from homepage as guest', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.click('text=Увійти в систему');

    await expect(page).toHaveURL(/.*\/api\/auth\/signin/);
  });

  test('should navigate to login page from dashboard navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/articles');

    await page.click('text=Увійти');

    await expect(page).toHaveURL(/.*\/api\/auth\/signin/);
  });
});