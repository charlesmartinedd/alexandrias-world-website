// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Alexandria\'s Library - Premium QA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/library.html');
    // Wait for books to load
    await page.waitForSelector('.book', { timeout: 10000 });
  });

  test('loads bookshelf with organized books', async ({ page }) => {
    // Check header
    await expect(page.locator('.library-header h1')).toContainText('ALEXANDRIA\'S LIBRARY');

    // Check books are rendered
    const books = page.locator('.book');
    const bookCount = await books.count();
    expect(bookCount).toBeGreaterThan(50);
    console.log(`✅ Loaded ${bookCount} books`);

    // Check shelves exist
    const shelves = page.locator('.shelf');
    const shelfCount = await shelves.count();
    expect(shelfCount).toBeGreaterThan(3);
    console.log(`✅ ${shelfCount} continent shelves`);
  });

  test('book hover effects work', async ({ page }) => {
    const firstBook = page.locator('.book').first();

    // Get initial position
    const initialBox = await firstBook.boundingBox();

    // Hover
    await firstBook.hover();
    await page.waitForTimeout(500);

    // Book should have transform applied
    const transform = await firstBook.evaluate(el => window.getComputedStyle(el).transform);
    expect(transform).not.toBe('none');
    console.log('✅ Hover effect working');
  });

  test('opens book modal with animation', async ({ page }) => {
    // Click first book
    await page.locator('.book').first().click();

    // Modal should appear
    const modal = page.locator('#bookModal');
    await expect(modal).toHaveClass(/active/);

    // Check book content loaded
    await expect(page.locator('#countryName')).not.toBeEmpty();
    await expect(page.locator('#pageImage')).toBeVisible();

    console.log('✅ Book opens successfully');
  });

  test('page navigation works', async ({ page }) => {
    // Open a book
    await page.locator('.book').first().click();
    await page.waitForSelector('#pageImage[src]');

    // Get initial image source
    const initialSrc = await page.locator('#pageImage').getAttribute('src');

    // Click next page
    await page.locator('#nextPage').click();
    await page.waitForTimeout(300);

    // Image should change
    const newSrc = await page.locator('#pageImage').getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);

    console.log('✅ Page navigation working');
  });

  test('keyboard navigation works', async ({ page }) => {
    // Open a book
    await page.locator('.book').first().click();
    await page.waitForSelector('#pageImage[src]');

    // Press right arrow
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);

    // Page should change
    const pageInfo = await page.locator('#pageInfo').textContent();
    expect(pageInfo).toContain('Page 2');

    // Press ESC to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Modal should be closed
    const modal = page.locator('#bookModal');
    await expect(modal).not.toHaveClass(/active/);

    console.log('✅ Keyboard shortcuts working');
  });

  test('close button works', async ({ page }) => {
    // Open a book
    await page.locator('.book').first().click();
    await page.waitForSelector('#bookModal.active');

    // Click close button
    await page.locator('#closeBook').click();
    await page.waitForTimeout(300);

    // Modal should be closed
    const modal = page.locator('#bookModal');
    await expect(modal).not.toHaveClass(/active/);

    console.log('✅ Close button working');
  });

  test('navigation buttons disable correctly', async ({ page }) => {
    // Open a book
    await page.locator('.book').first().click();
    await page.waitForSelector('#pageImage[src]');

    // Previous button should be disabled on first page
    const prevBtn = page.locator('#prevPage');
    await expect(prevBtn).toBeDisabled();

    // Navigate to last page
    while (!(await page.locator('#nextPage').isDisabled())) {
      await page.locator('#nextPage').click();
      await page.waitForTimeout(200);
    }

    // Next button should be disabled on last page
    const nextBtn = page.locator('#nextPage');
    await expect(nextBtn).toBeDisabled();

    console.log('✅ Button states correct');
  });

  test('visual regression - bookshelf', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('bookshelf-full.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('visual regression - open book', async ({ page }) => {
    // Open first complete book
    await page.locator('.book').first().click();
    await page.waitForSelector('#pageImage[src]');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('book-open.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });

  test('performance metrics', async ({ page }) => {
    // Measure load time
    const startTime = Date.now();
    await page.goto('/library.html');
    await page.waitForSelector('.book');
    const loadTime = Date.now() - startTime;

    console.log(`⏱️  Load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);

    // Measure book open time
    const openStart = Date.now();
    await page.locator('.book').first().click();
    await page.waitForSelector('#bookModal.active');
    const openTime = Date.now() - openStart;

    console.log(`⏱️  Book open time: ${openTime}ms`);
    expect(openTime).toBeLessThan(1000);
  });

  test('mobile responsive', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForSelector('.book');

    // Books should be smaller
    const book = page.locator('.book').first();
    const box = await book.boundingBox();
    expect(box.width).toBeLessThan(50);

    // Open book should be full screen
    await book.click();
    const modal = page.locator('.book-open');
    const modalBox = await modal.boundingBox();
    expect(modalBox.width).toBeGreaterThan(350);

    console.log('✅ Mobile responsive');
  });
});
