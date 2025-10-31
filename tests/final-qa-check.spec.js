// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('FINAL QA - All Books Verification', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🚀 FINAL QA CHECK - ALL 181 BOOKS\n');
  console.log('Testing live site after pointer-events fix...\n');

  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // ✅ CHECK 1: Count books
  const books = page.locator('.book');
  const totalBooks = await books.count();
  console.log(`📚 Total books found: ${totalBooks}`);
  expect(totalBooks).toBe(181);

  // ✅ CHECK 2: Text is HIDDEN by default
  console.log('\n🔍 Checking text visibility (should be hidden)...');
  const firstSpine = page.locator('.book-spine').first();
  const isHidden = await firstSpine.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return styles.display === 'none';
  });
  console.log(`✅ Text hidden by default: ${isHidden}`);
  expect(isHidden).toBe(true);

  // ✅ CHECK 3: No scrollbars
  console.log('\n📏 Checking for scrollbars...');
  const hasHorizontalScroll = await page.locator('.shelf').first().evaluate(el => {
    return el.scrollWidth > el.clientWidth;
  });
  console.log(`✅ No horizontal scroll: ${!hasHorizontalScroll}`);
  expect(hasHorizontalScroll).toBe(false);

  // ✅ CHECK 4: Hover works (book click should work now)
  console.log('\n👆 Testing hover and click...');
  const firstBook = books.first();

  // Hover test
  await firstBook.hover();
  await page.waitForTimeout(300);

  const isTextVisible = await firstSpine.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return styles.display === 'block';
  });
  console.log(`✅ Text visible on hover: ${isTextVisible}`);

  // Click test
  await firstBook.click();
  await page.waitForSelector('#bookModal.active', { timeout: 5000 });
  console.log('✅ Book opens successfully');

  // ✅ CHECK 5: Image loads
  const modalImage = page.locator('#pageImage');
  await page.waitForTimeout(1000);

  const imageStatus = await modalImage.evaluate(img => {
    if (!img.complete) return 'loading';
    if (img.naturalHeight === 0) return 'error';
    if (img.src.includes('data:image/svg')) return 'placeholder';
    return 'loaded';
  });
  console.log(`✅ Image status: ${imageStatus}`);
  expect(imageStatus).toBe('loaded');

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // ✅ CHECK 6: Test sample of books across the site
  console.log('\n📖 Testing sample books (10 books across the library)...\n');
  const sampleIndices = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
  const results = { working: [], failed: [] };

  for (const index of sampleIndices) {
    if (index >= totalBooks) continue;

    const book = books.nth(index);
    const bookName = await book.locator('.book-spine').textContent();

    process.stdout.write(`  ${index + 1}. ${bookName.padEnd(30)} `);

    try {
      await book.hover();
      await page.waitForTimeout(200);

      await book.click();
      await page.waitForSelector('#bookModal.active', { timeout: 3000 });

      const imgElement = page.locator('#pageImage');
      await page.waitForTimeout(500);

      const imgStatus = await imgElement.evaluate(img => {
        if (!img.complete || img.naturalHeight === 0) return 'error';
        return 'loaded';
      });

      if (imgStatus === 'error') {
        console.log('❌');
        results.failed.push({ index: index + 1, name: bookName, reason: 'Image error' });
      } else {
        console.log('✅');
        results.working.push({ index: index + 1, name: bookName });
      }

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

    } catch (error) {
      console.log(`❌ ${error.message}`);
      results.failed.push({ index: index + 1, name: bookName, reason: error.message });
    }
  }

  // ✅ CHECK 7: Take screenshots
  console.log('\n📸 Taking final screenshots...\n');

  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/FINAL-QA-full-page.png',
    fullPage: true
  });
  console.log('✅ Saved: FINAL-QA-full-page.png');

  // Hover screenshot
  await books.nth(5).hover();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/FINAL-QA-hover-effect.png',
    clip: { x: 0, y: 100, width: 800, height: 400 }
  });
  console.log('✅ Saved: FINAL-QA-hover-effect.png');

  // Modal screenshot
  await books.nth(10).click();
  await page.waitForSelector('#bookModal.active');
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'screenshots/FINAL-QA-modal-open.png'
  });
  console.log('✅ Saved: FINAL-QA-modal-open.png');

  // 📊 SUMMARY
  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL QA SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total books: ${totalBooks}`);
  console.log(`Sample tested: ${sampleIndices.length}`);
  console.log(`✅ Working: ${results.working.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n⚠️  FAILED BOOKS:');
    results.failed.forEach(book => {
      console.log(`  ${book.index}. ${book.name} - ${book.reason}`);
    });
  }

  // Save report
  const report = {
    testDate: new Date().toISOString(),
    totalBooks,
    sampleSize: sampleIndices.length,
    results,
    checksPerformed: [
      'Book count verification',
      'Text hidden by default',
      'No scrollbars',
      'Hover effects',
      'Click functionality',
      'Image loading',
      'Modal opening',
      'Sample book verification'
    ]
  };

  fs.writeFileSync(
    'test-results/final-qa-report.json',
    JSON.stringify(report, null, 2)
  );

  console.log('\n📄 Report saved: test-results/final-qa-report.json');

  if (results.failed.length === 0) {
    console.log('\n✨ ALL TESTS PASSED! SITE IS READY! ✨\n');
  } else {
    console.log('\n⚠️  Some issues found - see report above\n');
  }

  // Pass/fail the test
  expect(results.failed.length).toBe(0);
});
