// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('Test EVERY SINGLE BOOK - Find All Problems', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🔍 TESTING ALL 181 BOOKS INDIVIDUALLY\n');

  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const books = page.locator('.book');
  const totalBooks = await books.count();
  console.log(`📚 Found ${totalBooks} books\n`);

  const results = {
    working: [],
    imageErrors: [],
    hoverErrors: [],
    clickErrors: [],
    modalErrors: []
  };

  // Test EVERY book
  for (let i = 0; i < totalBooks; i++) {
    const book = books.nth(i);
    const bookName = await book.locator('.book-spine').textContent();

    process.stdout.write(`${(i+1).toString().padStart(3)}. ${bookName.padEnd(35)} `);

    try {
      // 1. Test hover
      await book.hover({ timeout: 2000 });
      await page.waitForTimeout(200);

      // 2. Test click
      await book.click({ timeout: 2000 });

      // 3. Wait for modal
      try {
        await page.waitForSelector('#bookModal.active', { timeout: 3000 });
      } catch (e) {
        console.log('❌ Modal failed');
        results.modalErrors.push({ index: i + 1, name: bookName });
        continue;
      }

      // 4. Check image
      const imageElement = page.locator('#pageImage');
      await page.waitForTimeout(1000);

      const imageStatus = await imageElement.evaluate(img => {
        if (!img.complete) return 'loading';
        if (img.naturalHeight === 0) return 'error';
        if (img.src.includes('data:image/svg')) return 'placeholder';
        return 'loaded';
      });

      const imageSrc = await imageElement.getAttribute('src');

      if (imageStatus === 'error' || imageStatus === 'placeholder') {
        console.log(`❌ Image: ${imageStatus}`);
        results.imageErrors.push({
          index: i + 1,
          name: bookName,
          status: imageStatus,
          src: imageSrc
        });
      } else {
        console.log('✅');
        results.working.push({ index: i + 1, name: bookName });
      }

      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

    } catch (error) {
      console.log(`❌ ${error.message.substring(0, 30)}`);

      if (error.message.includes('hover')) {
        results.hoverErrors.push({ index: i + 1, name: bookName });
      } else if (error.message.includes('click')) {
        results.clickErrors.push({ index: i + 1, name: bookName });
      } else {
        results.clickErrors.push({ index: i + 1, name: bookName, error: error.message });
      }

      // Try to close modal if it's open
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      } catch (e) {}
    }
  }

  // DETAILED REPORT
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPLETE TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`Total books: ${totalBooks}`);
  console.log(`✅ Working perfectly: ${results.working.length}`);
  console.log(`❌ Image errors: ${results.imageErrors.length}`);
  console.log(`❌ Hover errors: ${results.hoverErrors.length}`);
  console.log(`❌ Click errors: ${results.clickErrors.length}`);
  console.log(`❌ Modal errors: ${results.modalErrors.length}`);

  const totalErrors = results.imageErrors.length + results.hoverErrors.length +
                      results.clickErrors.length + results.modalErrors.length;
  console.log(`\n⚠️  TOTAL PROBLEMS: ${totalErrors}`);

  if (results.imageErrors.length > 0) {
    console.log('\n❌ BOOKS WITH IMAGE ERRORS:');
    results.imageErrors.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.name}`);
      console.log(`     Status: ${issue.status}`);
      console.log(`     URL: ${issue.src.substring(0, 80)}...`);
    });
  }

  if (results.hoverErrors.length > 0) {
    console.log('\n❌ BOOKS WITH HOVER ERRORS:');
    results.hoverErrors.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.name}`);
    });
  }

  if (results.clickErrors.length > 0) {
    console.log('\n❌ BOOKS WITH CLICK ERRORS:');
    results.clickErrors.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.name}`);
    });
  }

  if (results.modalErrors.length > 0) {
    console.log('\n❌ BOOKS WITH MODAL ERRORS:');
    results.modalErrors.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.name}`);
    });
  }

  // Save report
  const report = {
    testDate: new Date().toISOString(),
    totalBooks,
    results,
    summary: {
      working: results.working.length,
      imageErrors: results.imageErrors.length,
      hoverErrors: results.hoverErrors.length,
      clickErrors: results.clickErrors.length,
      modalErrors: results.modalErrors.length,
      totalErrors
    }
  };

  fs.writeFileSync(
    'test-results/all-books-detailed-report.json',
    JSON.stringify(report, null, 2)
  );

  console.log('\n📄 Report saved: test-results/all-books-detailed-report.json\n');

  // List problem books for easy filtering
  if (totalErrors > 0) {
    const problemBooks = [
      ...results.imageErrors,
      ...results.hoverErrors,
      ...results.clickErrors,
      ...results.modalErrors
    ].map(b => b.name);

    console.log('📝 BOOKS TO FILTER OUT:');
    console.log(JSON.stringify([...new Set(problemBooks)], null, 2));
  }
});
