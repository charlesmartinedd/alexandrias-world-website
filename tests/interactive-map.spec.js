// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Alexandria\'s World Interactive Map', () => {

  test('should load landing page', async ({ page }) => {
    await page.goto('/landing-page.html');

    // Check title
    await expect(page).toHaveTitle(/Alexandria's World/);

    // Check hero heading exists
    const hero = page.locator('.hero h1');
    await expect(hero).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/landing-page.png', fullPage: true });
  });

  test('should load interactive map', async ({ page }) => {
    await page.goto('/interactive-map/index.html');

    // Check page title
    await expect(page).toHaveTitle(/Interactive Map/);

    // Wait for SVG map to load
    const svg = page.locator('svg');
    await expect(svg).toBeVisible({ timeout: 10000 });

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/interactive-map.png', fullPage: true });
  });

  test('should interact with map - open console for testing', async ({ page }) => {
    await page.goto('/interactive-map/index.html');

    // Wait for map to load
    await page.waitForLoadState('networkidle');

    // This test will keep the browser open so you can interact
    // Press any key in terminal to close
    console.log('\n🌍 Browser is open! Use Chrome DevTools to inspect and test.\n');
    console.log('The page is ready for interactive testing.\n');

    // Wait for a long time (5 minutes) to allow manual testing
    await page.waitForTimeout(300000);
  });
});

test.describe('Visual Testing', () => {

  test('should match landing page snapshot', async ({ page }) => {
    await page.goto('/landing-page.html');
    await expect(page).toHaveScreenshot('landing-page-visual.png', {
      fullPage: true,
    });
  });

  test('should match interactive map snapshot', async ({ page }) => {
    await page.goto('/interactive-map/index.html');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('interactive-map-visual.png', {
      fullPage: true,
    });
  });
});
