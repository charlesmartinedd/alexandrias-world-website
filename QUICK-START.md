# 🚀 Quick Start - Alexandria's World

## One-Command Start

### Option 1: Just the Website (Recommended for updates)
```bash
npm run dev:map
```
✅ Opens http://localhost:8080/interactive-map/index.html
✅ Auto-reloads on file changes
✅ Press F12 for Chrome DevTools

### Option 2: Website + Playwright Testing
```bash
npm run test:ui
```
✅ Starts server automatically
✅ Opens Playwright test UI
✅ Visual testing & debugging tools

### Option 3: Both Together
```bash
npm start
```
✅ Runs dev server + test UI
✅ Full development environment

## 📝 Make Updates - Workflow

1. **Start server** (if not running):
   ```bash
   npm run dev:map
   ```

2. **Open in Chrome** - automatically opens at:
   - http://localhost:8080/interactive-map/index.html

3. **Press F12** - Open Chrome DevTools

4. **Edit files** in your favorite editor:
   - `interactive-map/index.html`
   - `interactive-map/modal-storybook.css`
   - `interactive-map/integrate-map.js`

5. **Save** - Page auto-reloads instantly ⚡

6. **Test changes** - Use DevTools:
   - Elements: Inspect HTML/CSS
   - Console: Test JavaScript
   - Network: Debug loading
   - Sources: Debug with breakpoints

## 🎯 Common Tasks

### Change Map Colors
Edit `interactive-map/modal-storybook.css`:
```css
.country:hover {
  fill: #your-color;
}
```

### Add New Functionality
Edit `interactive-map/integrate-map.js`:
```javascript
// Add your code here
```

### Update HTML
Edit `interactive-map/index.html`:
```html
<!-- Your changes -->
```

## 🔧 Chrome DevTools Shortcuts

| Shortcut | Action |
|----------|--------|
| F12 | Open/Close DevTools |
| Ctrl+Shift+C | Inspect Element |
| Ctrl+Shift+M | Toggle Mobile View |
| Ctrl+Shift+I | Open DevTools |
| F5 | Refresh |
| Ctrl+F5 | Hard Refresh (clear cache) |

## 📱 Test Responsive Design

1. Open DevTools (F12)
2. Click Toggle Device Toolbar (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test your changes

## 🎨 Live CSS Editing

1. Open DevTools (F12)
2. Go to Elements tab
3. Click any element
4. Edit CSS in Styles panel
5. Copy changes back to your CSS file

## 🐛 Debug JavaScript

1. Open DevTools (F12)
2. Go to Sources tab
3. Find your JS file
4. Click line number to add breakpoint
5. Refresh page to trigger breakpoint

## 📸 Take Screenshots

### Manual (DevTools):
1. F12 → More Tools → Capture screenshot

### Automated (Playwright):
```bash
npm run test
```

## 🔄 Back & Forth Workflow

```
Edit File → Save → Auto Reload → Check Result → Repeat
    ↓
Open DevTools → Inspect → Test → Copy CSS → Edit File
    ↓
npm run test:ui → Visual Check → Approve → Commit
```

## 💾 Save Your Work

```bash
git add .
git commit -m "Your update message"
git push
```

## 🆘 Need Help?

See full guide: `DEV-GUIDE.md`

---

**You're ready to go! Just run:**
```bash
npm run dev:map
```

🌍 Happy coding!
