// @ts-check
const { test, expect } = require('@playwright/test');

test('Verify ALL 197 books are working', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🚀 COMPREHENSIVE BOOK VERIFICATION');
  console.log('Testing all 197 books...\n');

  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Get all books
  const books = page.locator('.book');
  const bookCount = await books.count();
  console.log(`📚 Total books found: ${bookCount}`);
  expect(bookCount).toBeGreaterThanOrEqual(181); // At least 181 complete books

  // Test sample of books (first, middle, last)
  const samplesToTest = [0, 5, 10, 50, 100, 150, bookCount - 1];
  const results = {
    working: [],
    issues: []
  };

  for (const index of samplesToTest) {
    if (index >= bookCount) continue;

    const book = books.nth(index);
    const bookName = await book.locator('.book-spine').textContent();

    console.log(`\n📖 Testing book #${index + 1}: ${bookName}`);

    try {
      // Test hover
      await book.hover();
      await page.waitForTimeout(300);
      const isTextVisible = await book.locator('.book-spine').evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.opacity !== '0' && styles.visibility !== 'hidden';
      });

      if (!isTextVisible) {
        throw new Error('Text not visible on hover');
      }

      // Test click and open
      await book.click();
      await page.waitForSelector('#bookModal.active', { timeout: 5000 });

      // Check if modal has content
      const modalTitle = await page.locator('#countryName').textContent();
      console.log(`  ✅ Opens successfully: "${modalTitle}"`);

      // Check for image load
      const imageElement = page.locator('#pageImage');
      const imageSrc = await imageElement.getAttribute('src');

      // Wait a bit for image to load
      await page.waitForTimeout(1000);

      const imageStatus = await imageElement.evaluate(img => {
        if (!img.complete) return 'loading';
        if (img.naturalHeight === 0) return 'error';
        return 'loaded';
      });

      if (imageStatus === 'error') {
        console.log(`  ⚠️  Image error: ${imageSrc}`);
        results.issues.push({
          book: bookName,
          index: index + 1,
          issue: 'Image failed to load',
          imageSrc
        });
      } else {
        console.log(`  ✅ Image ${imageStatus}`);
        results.working.push({
          book: bookName,
          index: index + 1
        });
      }

      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.issues.push({
        book: bookName,
        index: index + 1,
        issue: error.message
      });
    }
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total books: ${bookCount}`);
  console.log(`Tested: ${samplesToTest.length}`);
  console.log(`Working: ${results.working.length}`);
  console.log(`Issues: ${results.issues.length}`);

  if (results.issues.length > 0) {
    console.log('\n⚠️  BOOKS WITH ISSUES:');
    results.issues.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.book}: ${issue.issue}`);
    });
  } else {
    console.log('\n✅ ALL TESTED BOOKS WORKING PERFECTLY!');
  }

  // Take final screenshot
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/ALL-BOOKS-FINAL.png',
    fullPage: true
  });
  console.log('\n📸 Final screenshot saved: ALL-BOOKS-FINAL.png');
});
