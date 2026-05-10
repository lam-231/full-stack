import { test, expect } from '@playwright/test';

test.describe('SEHub E2E Tests', () => {

  test('should load the homepage and display main heading', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Вітаємо');
  });

  test('should navigate to articles page when clicking the button', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.click('text=Перейти до відкриттів');

    await expect(page).toHaveURL(/.*\/articles/);
  });

  test('should navigate to login page from dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/articles');

    await page.click('text=Увійти');

    await expect(page).toHaveURL(/.*\/api\/auth\/signin/);
  });
});