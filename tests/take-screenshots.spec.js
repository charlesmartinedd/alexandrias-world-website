// @ts-check
const { test } = require('@playwright/test');

test('Take screenshots for review', async ({ page }) => {
  // Go to library
  await page.goto('http://localhost:8080/library.html');
  await page.waitForSelector('.book');

  // Full bookshelf screenshot
  await page.screenshot({
    path: 'screenshots/01-bookshelf-overview.png',
    fullPage: true
  });

  console.log('✅ Screenshot 1: Bookshelf overview');

  // Hover over a book
  await page.locator('.book').first().hover();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/02-book-hover-effect.png'
  });

  console.log('✅ Screenshot 2: Hover effect');

  // Open a book
  await page.locator('.book').first().click();
  await page.waitForSelector('#bookModal.active');
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'screenshots/03-book-opened.png',
    fullPage: false
  });

  console.log('✅ Screenshot 3: Book opened');

  // Navigate to page 2
  await page.locator('#nextPage').click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'screenshots/04-page-two.png'
  });

  console.log('✅ Screenshot 4: Page navigation');

  // Mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.locator('#closeBook').click();
  await page.waitForTimeout(300);

  await page.screenshot({
    path: 'screenshots/05-mobile-view.png',
    fullPage: true
  });

  console.log('✅ Screenshot 5: Mobile responsive');

  console.log('\n🎉 All screenshots saved to screenshots/ folder!');
});
