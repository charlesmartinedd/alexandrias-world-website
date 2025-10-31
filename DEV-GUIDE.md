# Alexandria's World - Development Guide

## 🚀 Quick Start

### Start Development Server
```bash
npm run dev:map
```
This will:
- Start live server on http://localhost:8080
- Open the interactive map in Chrome
- Auto-reload on file changes

### Start with Playwright Testing
```bash
npm run test:ui
```
This will:
- Start the live server
- Open Playwright UI for testing
- Keep Chrome DevTools open

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with landing page |
| `npm run dev:map` | Start server with interactive map |
| `npm run test` | Run all Playwright tests |
| `npm run test:ui` | Open Playwright UI (interactive mode) |
| `npm run test:debug` | Debug tests with step-through |
| `npm start` | Run both dev server and test UI |

## 🔧 Development Workflow

### Making Updates

1. **Start the dev server:**
   ```bash
   npm run dev:map
   ```

2. **Edit files** - The page will auto-reload on save:
   - HTML: `interactive-map/index.html`
   - CSS: `interactive-map/modal-storybook.css`
   - JS: `interactive-map/integrate-map.js`
   - SVG: `interactive-map/world-map-complete.svg`

3. **Use Chrome DevTools:**
   - Press F12 to open DevTools
   - Use Elements tab to inspect HTML/CSS
   - Use Console tab to test JavaScript
   - Use Network tab to debug loading issues

4. **Test with Playwright:**
   - Open another terminal
   - Run `npm run test:ui`
   - Select tests to run
   - See visual comparisons

## 🧪 Testing with Playwright

### Interactive Testing Mode
The test suite includes an "open console" test that keeps the browser open for 5 minutes:

```bash
npm run test:ui
```

Select "should interact with map - open console for testing" to:
- Keep browser open
- Use DevTools freely
- Test interactions manually
- See console output in real-time

### Visual Testing
Playwright automatically creates screenshots for comparison:
- `tests/screenshots/landing-page.png`
- `tests/screenshots/interactive-map.png`

### Debugging Tests
```bash
npm run test:debug
```

This opens Playwright Inspector where you can:
- Step through test actions
- Pause and resume
- Inspect page state
- See locators highlighted

## 📁 Project Structure

```
alexandrias-world-website/
├── interactive-map/
│   ├── index.html              # Main interactive map page
│   ├── integrate-map.js        # Map functionality
│   ├── modal-storybook.css     # Styling
│   └── world-map-complete.svg  # SVG world map
├── tests/
│   └── interactive-map.spec.js # Playwright tests
├── playwright.config.js         # Playwright configuration
└── package.json                # Dependencies and scripts
```

## 🎨 Making Changes

### Update Map Styles
Edit `interactive-map/modal-storybook.css`:
```css
/* Example: Change country hover color */
.country:hover {
  fill: #your-color;
}
```

### Update Map Functionality
Edit `interactive-map/integrate-map.js`:
```javascript
// Example: Add click handler
document.querySelector('.country').addEventListener('click', (e) => {
  console.log('Country clicked:', e.target.id);
});
```

### Update HTML Structure
Edit `interactive-map/index.html`:
```html
<!-- Your changes here -->
```

## 🔄 Live Reload

The live-server watches all files and auto-reloads when you:
- Save any HTML file
- Save any CSS file
- Save any JS file
- Save any image file

**Note:** If changes don't appear, try:
1. Hard refresh: Ctrl+F5
2. Clear cache: Ctrl+Shift+Delete
3. Restart dev server

## 🌐 URLs

- Landing Page: http://localhost:8080/landing-page.html
- Interactive Map: http://localhost:8080/interactive-map/index.html
- Book Viewer: http://localhost:8080/book-viewer/index.html

## 💡 Tips

1. **Keep DevTools open** - You can dock it to the side for split view
2. **Use Playwright UI** - Great for visual regression testing
3. **Check Console** - All JavaScript errors appear here
4. **Network Tab** - See what's loading slow
5. **Elements Tab** - Live CSS editing

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Playwright Browser Not Found
```bash
npx playwright install chromium
```

### Changes Not Appearing
1. Check file is saved
2. Check console for errors
3. Try hard refresh (Ctrl+F5)
4. Restart dev server

## 📸 Screenshots

Playwright saves screenshots to:
- `tests/screenshots/` - Manual screenshots
- `test-results/` - Test failure screenshots
- `playwright-report/` - HTML test report

## 🎯 Next Steps

1. Start dev server: `npm run dev:map`
2. Open Chrome DevTools: Press F12
3. Make changes to files
4. See updates automatically
5. Test with Playwright UI when ready

Happy coding! 🚀
