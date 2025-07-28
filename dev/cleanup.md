# Project Cleanup Guide

## What Was Cleaned

### ✅ Removed Files
- `fix.css` (23KB, 922 lines) - Consolidated into `assets/css/main.css`
- `std1/fix.css` - Duplicate file removed
- `std1/manifest.json` - Using shared manifest from root
- `std1/service-worker.js` - Using shared service worker from root
- `std1/assets/` - Duplicate assets folder removed

### ✅ Moved Files
- `debug.html` → `dev/debug.html`
- `setup.html` → `dev/setup.html`

### ✅ Updated References
- `index.html`: Now uses `assets/css/main.css` instead of multiple CSS files
- `std1/std1.html`: Updated to use `../assets/css/main.css` and `../manifest.json`

## Current Clean Structure

```
02-software/
├── assets/                 # Shared assets (CSS, JS, images, fonts)
├── std1/                  # Standard 1 content only
├── dev/                   # Development tools
├── index.html            # Main landing page
├── manifest.json         # Shared PWA manifest
├── service-worker.js     # Shared service worker
└── README.md            # Updated documentation
```

## Benefits of Cleanup

1. **Reduced File Size**: Removed ~50KB of duplicate CSS
2. **Better Organization**: Clear separation of concerns
3. **Easier Maintenance**: Single source of truth for styles
4. **Faster Loading**: Fewer HTTP requests
5. **Cleaner Structure**: Logical file organization

## Future Maintenance

### Adding New Standards
1. Create new folder: `std2/`, `std3/`, etc.
2. Copy `std1/std1.html` as template
3. Update content and references
4. No need to duplicate assets

### CSS Changes
- Edit `assets/css/main.css` for global styles
- Edit `assets/css/animations.css` for animations only
- No more `fix.css` needed

### Development
- Use `dev/` folder for testing and debugging tools
- Keep main directory clean for production files 