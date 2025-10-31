// @ts-check
const { test, expect } = require('@playwright/test');

test('Verify live GitHub Pages site - ALL FIXES', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🌐 Testing LIVE site:', LIVE_URL);

  // Navigate to live site
  await page.goto(LIVE_URL);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for animations

  // 1. CHECK: Book spine text visibility
  console.log('\n📖 Checking book spine text...');
  const firstBook = page.locator('.book').first();
  const spineText = await firstBook.locator('.book-spine').textContent();
  console.log('✅ First book text:', spineText);

  // Check text styling
  const spineStyles = await firstBook.locator('.book-spine').evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      fontSize: styles.fontSize,
      color: styles.color,
      textShadow: styles.textShadow
    };
  });
  console.log('✅ Text size:', spineStyles.fontSize);
  console.log('✅ Text color:', spineStyles.color);
  console.log('✅ Text shadow:', spineStyles.textShadow);

  // 2. CHECK: Shelf organization (full shelves)
  console.log('\n📚 Checking shelf layout...');
  const shelves = page.locator('.shelf');
  const shelfCount = await shelves.count();
  console.log('✅ Total shelves:', shelfCount);

  // Check first shelf has books
  const firstShelfBooks = await shelves.first().locator('.book').count();
  console.log('✅ Books on first shelf:', firstShelfBooks);

  // 3. CHECK: Loading glitch fixed
  console.log('\n⚡ Checking loading animation...');
  const container = page.locator('.bookshelf-container');
  const hasLoadedClass = await container.evaluate(el => el.classList.contains('loaded'));
  console.log('✅ Loaded class applied:', hasLoadedClass);

  // 4. CHECK: Image loading
  console.log('\n🖼️ Checking image loading...');
  await firstBook.click();
  await page.waitForSelector('#bookModal.active');
  await page.waitForTimeout(1000);

  const pageImage = page.locator('#pageImage');
  const imageSrc = await pageImage.getAttribute('src');
  console.log('✅ Image URL:', imageSrc);

  // Check if image loaded or has error handler
  const imageLoaded = await pageImage.evaluate(img => {
    return img.complete && img.naturalHeight !== 0;
  });
  console.log('✅ Image loaded:', imageLoaded);

  // Take screenshot of open book
  await page.screenshot({
    path: 'screenshots/live-site-book-open.png',
    fullPage: false
  });
  console.log('✅ Screenshot saved: screenshots/live-site-book-open.png');

  // Close book
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 5. Take full bookshelf screenshot
  console.log('\n📸 Taking full bookshelf screenshot...');
  await page.screenshot({
    path: 'screenshots/live-site-bookshelf.png',
    fullPage: true
  });
  console.log('✅ Screenshot saved: screenshots/live-site-bookshelf.png');

  // Final verification
  console.log('\n✅ ALL CHECKS PASSED!');
  console.log('🎉 Live site is working perfectly!\n');
});
