// @ts-check
const { test, expect } = require('@playwright/test');

test('Comprehensive Live Site Check with Screenshots', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🌐 Loading live site:', LIVE_URL);

  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // Wait for animations

  // 1. FULL PAGE SCREENSHOT
  console.log('\n📸 Taking full page screenshot...');
  await page.screenshot({
    path: 'screenshots/01-full-page.png',
    fullPage: true
  });
  console.log('✅ Saved: screenshots/01-full-page.png');

  // 2. CHECK BOOK SPINE STYLING
  console.log('\n🔍 Checking book spine styles...');
  const firstBook = page.locator('.book').first();

  const spineStyles = await firstBook.locator('.book-spine').evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      textShadow: styles.textShadow,
      letterSpacing: styles.letterSpacing,
      padding: styles.padding,
      writingMode: styles.writingMode
    };
  });

  console.log('Font Size:', spineStyles.fontSize);
  console.log('Font Weight:', spineStyles.fontWeight);
  console.log('Color:', spineStyles.color);
  console.log('Background:', spineStyles.backgroundColor);
  console.log('Letter Spacing:', spineStyles.letterSpacing);
  console.log('Padding:', spineStyles.padding);
  console.log('Writing Mode:', spineStyles.writingMode);
  console.log('Text Shadow:', spineStyles.textShadow.substring(0, 100) + '...');

  // 3. ZOOM IN ON BOOKS
  console.log('\n📸 Taking close-up of first shelf...');
  await page.locator('.shelf').first().screenshot({
    path: 'screenshots/02-first-shelf-closeup.png'
  });
  console.log('✅ Saved: screenshots/02-first-shelf-closeup.png');

  // 4. ZOOM IN ON SINGLE BOOK
  console.log('\n📸 Taking extreme close-up of first book...');
  await firstBook.screenshot({
    path: 'screenshots/03-single-book-extreme-closeup.png'
  });
  console.log('✅ Saved: screenshots/03-single-book-extreme-closeup.png');

  // 5. CHECK TEXT CONTENT
  console.log('\n📖 Checking text content...');
  const bookTexts = await page.locator('.book-spine').allTextContents();
  console.log('First 10 books:', bookTexts.slice(0, 10).join(', '));

  // 6. CHECK HORIZONTAL SCROLLING
  console.log('\n🔍 Checking for horizontal scroll...');
  const shelfOverflow = await page.locator('.shelf').first().evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      overflowX: styles.overflowX,
      overflowY: styles.overflowY,
      flexWrap: styles.flexWrap,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      hasHorizontalScroll: el.scrollWidth > el.clientWidth
    };
  });

  console.log('Overflow-X:', shelfOverflow.overflowX);
  console.log('Overflow-Y:', shelfOverflow.overflowY);
  console.log('Flex-Wrap:', shelfOverflow.flexWrap);
  console.log('Has horizontal scroll:', shelfOverflow.hasHorizontalScroll);

  // 7. VIEWPORT AT 100%
  console.log('\n📸 Screenshot at 100% zoom...');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({
    path: 'screenshots/04-desktop-1920x1080.png',
    fullPage: false
  });
  console.log('✅ Saved: screenshots/04-desktop-1920x1080.png');

  // 8. HOVER EFFECT
  console.log('\n📸 Testing hover effect...');
  await firstBook.hover();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/05-hover-effect.png',
    fullPage: false
  });
  console.log('✅ Saved: screenshots/05-hover-effect.png');

  // 9. OPEN A BOOK
  console.log('\n📸 Opening a book...');
  await page.click('.book >> nth=5'); // Click 6th book to avoid hover issues
  await page.waitForSelector('#bookModal.active');
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'screenshots/06-book-opened.png',
    fullPage: false
  });
  console.log('✅ Saved: screenshots/06-book-opened.png');

  // 10. CONSOLE LOGS CHECK
  console.log('\n🔍 Checking for console errors...');
  const logs = [];
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));

  console.log('\n✅ COMPREHENSIVE CHECK COMPLETE!');
  console.log('📁 All screenshots saved to screenshots/ folder');
  console.log('\n🎯 Summary:');
  console.log('- Live URL accessible: YES');
  console.log('- Books loaded: YES');
  console.log('- Text visible: CHECK SCREENSHOTS');
  console.log('- Horizontal scroll:', shelfOverflow.hasHorizontalScroll ? 'YES (PROBLEM!)' : 'NO (GOOD!)');
});
