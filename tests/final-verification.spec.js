// @ts-check
const { test } = require('@playwright/test');

test('FINAL VERIFICATION - Text Visibility Check', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🚀 FINAL VERIFICATION TEST');
  console.log('Loading:', LIVE_URL);

  // Clear cache
  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n✅ Page loaded');

  // Check if pointer-events is none
  const pointerEvents = await page.locator('.book-spine').first().evaluate(el => {
    return window.getComputedStyle(el).pointerEvents;
  });
  console.log('Pointer Events:', pointerEvents);

  // Take screenshot of full page
  console.log('\n📸 Taking FRESH screenshot...');
  await page.screenshot({
    path: 'screenshots/FINAL-full-bookshelf.png',
    fullPage: true
  });
  console.log('✅ Saved: screenshots/FINAL-full-bookshelf.png');

  // Close-up of first 5 books
  console.log('\n📸 Taking close-up of first books...');
  await page.locator('.shelf').first().screenshot({
    path: 'screenshots/FINAL-first-shelf.png'
  });
  console.log('✅ Saved: screenshots/FINAL-first-shelf.png');

  // Single book extreme close-up
  console.log('\n📸 Taking EXTREME close-up of one book...');
  const firstBook = page.locator('.book').nth(3); // 4th book
  await firstBook.screenshot({
    path: 'screenshots/FINAL-single-book.png'
  });
  console.log('✅ Saved: screenshots/FINAL-single-book.png');

  // Check computed styles
  const spineStyles = await firstBook.locator('.book-spine').evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      fontSize: styles.fontSize,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      pointerEvents: styles.pointerEvents,
      opacity: styles.opacity,
      visibility: styles.visibility,
      display: styles.display
    };
  });

  console.log('\n🔍 SPINE COMPUTED STYLES:');
  console.log('  Font Size:', spineStyles.fontSize);
  console.log('  Color:', spineStyles.color);
  console.log('  Background:', spineStyles.backgroundColor);
  console.log('  Pointer Events:', spineStyles.pointerEvents);
  console.log('  Opacity:', spineStyles.opacity);
  console.log('  Visibility:', spineStyles.visibility);
  console.log('  Display:', spineStyles.display);

  // Count books per shelf
  const shelves = page.locator('.shelf');
  const shelfCount = await shelves.count();
  console.log('\n📊 SHELF STATISTICS:');
  console.log('  Total Shelves:', shelfCount);

  for (let i = 0; i < Math.min(3, shelfCount); i++) {
    const bookCount = await shelves.nth(i).locator('.book').count();
    console.log(`  Shelf ${i + 1}: ${bookCount} books`);
  }

  console.log('\n✅ VERIFICATION COMPLETE!');
  console.log('Check screenshots folder for visual confirmation.');
});
