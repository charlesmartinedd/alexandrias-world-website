// @ts-check
const { test } = require('@playwright/test');

test('Capture current state before fixes', async ({ page }) => {
  await page.goto('https://charlesmartinedd.github.io/alexandrias-world-website/library.html');
  await page.waitForTimeout(3000);

  console.log('📸 Capturing current state...');

  await page.screenshot({
    path: 'screenshots/BEFORE-HOVER-FIX.png',
    fullPage: true
  });

  console.log('✅ Screenshot saved');
});
