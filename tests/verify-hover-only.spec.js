// @ts-check
const { test } = require('@playwright/test');

test('Verify hover-only text display', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🎯 VERIFYING HOVER-ONLY FIXES');
  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 1. Screenshot WITHOUT hover (text should be hidden)
  console.log('\n📸 Screenshot 1: Default state (NO text visible)');
  await page.screenshot({
    path: 'screenshots/AFTER-FIX-default-no-text.png',
    fullPage: true
  });
  console.log('✅ Saved: AFTER-FIX-default-no-text.png');

  // Check text is hidden
  const textOpacity = await page.locator('.book-spine').first().evaluate(el => {
    return window.getComputedStyle(el).opacity;
  });
  console.log('Text opacity (should be 0):', textOpacity);

  // 2. Screenshot WITH hover (text should appear)
  console.log('\n📸 Screenshot 2: Hover state (text visible)');
  await page.locator('.book').nth(5).hover();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'screenshots/AFTER-FIX-hover-with-text.png',
    fullPage: false
  });
  console.log('✅ Saved: AFTER-FIX-hover-with-text.png');

  // 3. Check scrollbar removed
  const hasScrollbar = await page.locator('.shelf').first().evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      scrollbarWidth: styles.scrollbarWidth,
      msOverflowStyle: styles.msOverflowStyle,
      webkitScrollbar: styles['::-webkit-scrollbar']
    };
  });
  console.log('\n🔍 Scrollbar check:', hasScrollbar);

  // 4. Check shadows removed
  const bookShadow = await page.locator('.book').first().evaluate(el => {
    return window.getComputedStyle(el).boxShadow;
  });
  console.log('Book shadow (should be none or minimal):', bookShadow);

  console.log('\n✅ VERIFICATION COMPLETE!');
});
