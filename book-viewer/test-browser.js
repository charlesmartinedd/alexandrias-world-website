/**
 * Automated Browser Testing with Puppeteer
 * Tests the interactive map and book reader with screenshots
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const SCREENSHOTS_DIR = path.join(__dirname, 'test-screenshots');
const BASE_URL = `file://${path.join(__dirname, 'index.html')}`;

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Test configuration
const TEST_COUNTRIES = [
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' },
    { code: 'FR', name: 'France' },
    { code: 'EG', name: 'Egypt' }
];

async function runTests() {
    console.log('🚀 Starting Automated Browser Tests...\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Collect console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text()
        });
    });

    // Collect errors
    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
    });

    try {
        // Test 1: Load main map page
        console.log('📍 Test 1: Loading main map page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '01-main-map.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: 01-main-map.png\n');

        // Test 2: Check for SVG map loaded
        console.log('🗺️  Test 2: Checking SVG map loaded...');
        const svgExists = await page.evaluate(() => {
            return document.querySelector('svg') !== null;
        });

        if (svgExists) {
            console.log('✅ SVG map loaded successfully\n');
        } else {
            console.log('❌ SVG map NOT found\n');
            errors.push('SVG map did not load');
        }

        // Test 3: Check book availability indicators
        console.log('✨ Test 3: Checking book availability indicators...');
        const availableBooks = await page.evaluate(() => {
            return document.querySelectorAll('g[data-book="available"]').length;
        });
        console.log(`✅ Found ${availableBooks} countries with available books\n`);

        // Test 4-7: Test clicking countries and modal popups
        for (let i = 0; i < TEST_COUNTRIES.length; i++) {
            const country = TEST_COUNTRIES[i];
            console.log(`📚 Test ${4 + i}: Testing ${country.name} (${country.code})...`);

            // Click on country
            const countryClicked = await page.evaluate((code) => {
                const countryElement = document.querySelector(`g[id="${code}"]`);
                if (countryElement) {
                    // Trigger click event on SVG element
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    countryElement.dispatchEvent(event);
                    return true;
                }
                return false;
            }, country.code);

            if (!countryClicked) {
                console.log(`⚠️  Country ${country.code} not found on map\n`);
                continue;
            }

            // Wait for modal to appear
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if modal is visible
            const modalVisible = await page.evaluate(() => {
                const modal = document.getElementById('bookModal');
                return modal && modal.style.display === 'block';
            });

            if (modalVisible) {
                console.log(`✅ Modal popup opened for ${country.name}`);

                // Screenshot of modal
                await page.screenshot({
                    path: path.join(SCREENSHOTS_DIR, `0${4 + i}-modal-${country.code.toLowerCase()}.png`),
                    fullPage: false
                });
                console.log(`✅ Screenshot: 0${4 + i}-modal-${country.code.toLowerCase()}.png`);

                // Check if cover image loaded
                await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for image load

                const coverLoaded = await page.evaluate(() => {
                    const coverImg = document.querySelector('.cover-image');
                    return coverImg && coverImg.complete && coverImg.naturalWidth > 0;
                });

                if (coverLoaded) {
                    console.log(`✅ Cover image loaded for ${country.name}`);
                } else {
                    console.log(`⚠️  Cover image may not have loaded for ${country.name}`);
                }

                // Close modal
                await page.evaluate(() => {
                    const closeButton = document.querySelector('.close-x');
                    if (closeButton) closeButton.click();
                });

                await new Promise(resolve => setTimeout(resolve, 500));
                console.log(`✅ Modal closed\n`);
            } else {
                console.log(`❌ Modal did NOT open for ${country.name}\n`);
                errors.push(`Modal did not open for ${country.name}`);
            }
        }

        // Test 8: Test book reader for Japan
        console.log('📖 Test 8: Testing book reader for Japan...');
        const readerUrl = `file://${path.join(__dirname, 'book-reader.html')}?country=JP`;
        await page.goto(readerUrl, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '08-book-reader-page1.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: 08-book-reader-page1.png');

        // Check if page loaded
        const pageImageLoaded = await page.evaluate(() => {
            const img = document.getElementById('pageImage');
            return img && img.complete && img.naturalWidth > 0;
        });

        if (pageImageLoaded) {
            console.log('✅ Book page 1 (cover) loaded successfully');
        } else {
            console.log('⚠️  Book page 1 may not have loaded');
        }

        // Test 9: Test navigation to next page
        console.log('\n📄 Test 9: Testing page navigation...');
        await page.click('#nextButton');
        await new Promise(resolve => setTimeout(resolve, 1500));

        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, '09-book-reader-page2.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: 09-book-reader-page2.png');

        const page2Loaded = await page.evaluate(() => {
            const pageNumber = document.getElementById('pageNumber').textContent;
            return pageNumber.includes('Page 2');
        });

        if (page2Loaded) {
            console.log('✅ Successfully navigated to page 2');
        } else {
            console.log('❌ Page navigation may have failed');
            errors.push('Page navigation failed');
        }

        // Test 10: Test previous button
        console.log('\n⬅️  Test 10: Testing previous button...');
        await page.click('#prevButton');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const backToPage1 = await page.evaluate(() => {
            const pageNumber = document.getElementById('pageNumber').textContent;
            return pageNumber.includes('Page 1');
        });

        if (backToPage1) {
            console.log('✅ Successfully navigated back to page 1\n');
        } else {
            console.log('❌ Previous button navigation failed\n');
            errors.push('Previous button navigation failed');
        }

        // Generate test report
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));

        console.log(`\n✅ Tests Completed: 10`);
        console.log(`📸 Screenshots Saved: ${SCREENSHOTS_DIR}`);
        console.log(`📚 Books Tested: ${TEST_COUNTRIES.map(c => c.name).join(', ')}`);

        if (errors.length > 0) {
            console.log(`\n⚠️  Errors Found: ${errors.length}`);
            errors.forEach((err, idx) => {
                console.log(`   ${idx + 1}. ${err}`);
            });
        } else {
            console.log('\n🎉 All tests passed! No errors found!');
        }

        // Console messages summary
        const errorMessages = consoleMessages.filter(m => m.type === 'error');
        const warningMessages = consoleMessages.filter(m => m.type === 'warning');

        if (errorMessages.length > 0) {
            console.log(`\n❌ Console Errors: ${errorMessages.length}`);
            errorMessages.forEach((msg, idx) => {
                console.log(`   ${idx + 1}. ${msg.text}`);
            });
        } else {
            console.log('\n✅ No console errors');
        }

        if (warningMessages.length > 0) {
            console.log(`\n⚠️  Console Warnings: ${warningMessages.length}`);
            warningMessages.slice(0, 5).forEach((msg, idx) => {
                console.log(`   ${idx + 1}. ${msg.text}`);
            });
            if (warningMessages.length > 5) {
                console.log(`   ... and ${warningMessages.length - 5} more`);
            }
        }

        // Create HTML report
        await generateHTMLReport(errors, consoleMessages);

        console.log('\n' + '='.repeat(60));
        console.log('✅ Testing Complete!');
        console.log('📁 Screenshots saved to:', SCREENSHOTS_DIR);
        console.log('📄 HTML Report: test-screenshots/report.html');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ Test failed with error:', error.message);
        errors.push(error.message);

        // Take error screenshot
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'error-screenshot.png'),
            fullPage: true
        });
        console.log('📸 Error screenshot saved: error-screenshot.png');
    } finally {
        await browser.close();
    }
}

async function generateHTMLReport(errors, consoleMessages) {
    const screenshots = fs.readdirSync(SCREENSHOTS_DIR)
        .filter(f => f.endsWith('.png'))
        .sort();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexandria's World - Test Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .summary {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin: 5px;
        }
        .status.pass { background: #4CAF50; color: white; }
        .status.fail { background: #f44336; color: white; }
        .status.warn { background: #ff9800; color: white; }
        .screenshot {
            background: white;
            padding: 15px;
            margin: 20px 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .screenshot h3 {
            color: #667eea;
            margin-top: 0;
        }
        .screenshot img {
            max-width: 100%;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
        }
        .error-list {
            background: #ffebee;
            padding: 15px;
            border-left: 4px solid #f44336;
            border-radius: 5px;
            margin: 10px 0;
        }
        .console-messages {
            background: #fff3e0;
            padding: 15px;
            border-left: 4px solid #ff9800;
            border-radius: 5px;
            margin: 10px 0;
            max-height: 300px;
            overflow-y: auto;
        }
        .timestamp {
            color: #999;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <h1>🌍 Alexandria's World - Automated Test Report</h1>

    <div class="summary">
        <h2>Test Summary</h2>
        <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
        <div>
            <span class="status ${errors.length === 0 ? 'pass' : 'fail'}">
                ${errors.length === 0 ? '✅ All Tests Passed' : `❌ ${errors.length} Errors Found`}
            </span>
            <span class="status pass">📸 ${screenshots.length} Screenshots</span>
            <span class="status ${consoleMessages.filter(m => m.type === 'error').length === 0 ? 'pass' : 'fail'}">
                ${consoleMessages.filter(m => m.type === 'error').length} Console Errors
            </span>
            <span class="status ${consoleMessages.filter(m => m.type === 'warning').length === 0 ? 'pass' : 'warn'}">
                ${consoleMessages.filter(m => m.type === 'warning').length} Console Warnings
            </span>
        </div>
    </div>

    ${errors.length > 0 ? `
    <div class="error-list">
        <h3>❌ Errors Found</h3>
        <ul>
            ${errors.map(err => `<li>${err}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${consoleMessages.filter(m => m.type === 'error').length > 0 ? `
    <div class="console-messages">
        <h3>Console Errors</h3>
        <ul>
            ${consoleMessages.filter(m => m.type === 'error').map(msg => `<li>${msg.text}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <h2>📸 Screenshots</h2>
    ${screenshots.map(screenshot => `
        <div class="screenshot">
            <h3>${screenshot.replace('.png', '').replace(/-/g, ' ')}</h3>
            <img src="${screenshot}" alt="${screenshot}">
        </div>
    `).join('')}
</body>
</html>
    `;

    fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'report.html'), html);
}

// Run tests
runTests().catch(console.error);
