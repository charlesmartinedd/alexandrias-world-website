// @ts-check
const { test } = require('@playwright/test');

test('Check for any remaining shadows', async ({ page }) => {
  await page.goto('https://charlesmartinedd.github.io/alexandrias-world-website/library.html');
  await page.waitForTimeout(3000);

  console.log('\n🔍 CHECKING FOR SHADOWS');

  // Check shelf shadows
  const shelfShadow = await page.locator('.shelf').first().evaluate(el => {
    return window.getComputedStyle(el).boxShadow;
  });
  console.log('Shelf shadow:', shelfShadow);

  // Check book shadows (default state)
  const bookShadow = await page.locator('.book').first().evaluate(el => {
    return window.getComputedStyle(el).boxShadow;
  });
  console.log('Book shadow (default):', bookShadow);

  // Check book shadows on hover
  await page.locator('.book').nth(5).hover();
  await page.waitForTimeout(500);

  const bookHoverShadow = await page.locator('.book').nth(5).evaluate(el => {
    return window.getComputedStyle(el).boxShadow;
  });
  console.log('Book shadow (hover):', bookHoverShadow);

  // Screenshot default
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
  await page.screenshot({
    path: 'screenshots/SHADOW-CHECK-default.png',
    fullPage: true
  });
  console.log('✅ Screenshot: SHADOW-CHECK-default.png');

  // Screenshot with hover
  await page.locator('.book').nth(10).hover();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/SHADOW-CHECK-hover.png',
    fullPage: false
  });
  console.log('✅ Screenshot: SHADOW-CHECK-hover.png');
});
