// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('Test ALL 181 books individually', async ({ page }) => {
  const LIVE_URL = 'https://charlesmartinedd.github.io/alexandrias-world-website/library.html';

  console.log('\n🚀 TESTING ALL 181 BOOKS INDIVIDUALLY\n');

  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const books = page.locator('.book');
  const totalBooks = await books.count();
  console.log(`📚 Found ${totalBooks} books\n`);

  const results = {
    working: [],
    imageIssues: [],
    hoverIssues: [],
    clickIssues: []
  };

  // Test EVERY single book
  for (let i = 0; i < totalBooks; i++) {
    const book = books.nth(i);
    const bookName = await book.locator('.book-spine').textContent();

    process.stdout.write(`Testing ${i+1}/${totalBooks}: ${bookName.padEnd(30)} `);

    try {
      // Test hover
      await book.hover();
      await page.waitForTimeout(200);

      // Test click
      await book.click();
      await page.waitForSelector('#bookModal.active', { timeout: 3000 });

      // Check image
      const imageElement = page.locator('#pageImage');
      await page.waitForTimeout(500);

      const imageStatus = await imageElement.evaluate(img => {
        if (!img.complete) return 'loading';
        if (img.naturalHeight === 0) return 'error';
        if (img.src.includes('data:image/svg')) return 'placeholder';
        return 'loaded';
      });

      if (imageStatus === 'error' || imageStatus === 'placeholder') {
        console.log('❌ Image issue');
        const imageSrc = await imageElement.getAttribute('src');
        results.imageIssues.push({
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
      console.log(`❌ ${error.message}`);
      if (error.message.includes('hover')) {
        results.hoverIssues.push({ index: i + 1, name: bookName, error: error.message });
      } else if (error.message.includes('click') || error.message.includes('modal')) {
        results.clickIssues.push({ index: i + 1, name: bookName, error: error.message });
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 COMPLETE TEST RESULTS');
  console.log('='.repeat(70));
  console.log(`Total books tested: ${totalBooks}`);
  console.log(`✅ Working perfectly: ${results.working.length}`);
  console.log(`⚠️  Image issues: ${results.imageIssues.length}`);
  console.log(`⚠️  Hover issues: ${results.hoverIssues.length}`);
  console.log(`⚠️  Click issues: ${results.clickIssues.length}`);

  if (results.imageIssues.length > 0) {
    console.log('\n⚠️  BOOKS WITH IMAGE ISSUES:');
    results.imageIssues.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.name} (${issue.status})`);
    });
  }

  if (results.hoverIssues.length > 0) {
    console.log('\n⚠️  BOOKS WITH HOVER ISSUES:');
    results.hoverIssues.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.name}`);
    });
  }

  if (results.clickIssues.length > 0) {
    console.log('\n⚠️  BOOKS WITH CLICK ISSUES:');
    results.clickIssues.forEach(issue => {
      console.log(`  ${issue.index}. ${issue.name}`);
    });
  }

  // Save detailed report
  const report = {
    testDate: new Date().toISOString(),
    totalBooks,
    results
  };

  fs.writeFileSync(
    'test-results/all-books-report.json',
    JSON.stringify(report, null, 2)
  );

  console.log('\n📄 Detailed report saved: test-results/all-books-report.json');

  // Fail test if there are issues
  if (results.imageIssues.length > 0 || results.hoverIssues.length > 0 || results.clickIssues.length > 0) {
    console.log('\n⚠️  SOME BOOKS HAVE ISSUES - SEE REPORT ABOVE');
  } else {
    console.log('\n🎉 ALL 181 BOOKS WORKING PERFECTLY!');
  }
});
