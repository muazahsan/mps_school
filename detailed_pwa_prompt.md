# Complete PWA Development Prompt for Primary School Learning App

## Project Overview
Create a modular Progressive Web App (PWA) for primary school education (Standards 1-6) that works fully offline on Windows smart boards and Android tablets. The app should support Tamil, English, and Urdu languages with a colorful, kid-friendly interface.

## Technical Requirements

### Core Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6+) or React/Vue.js (optional)
- **PWA Features**: Service Worker, Web App Manifest, offline-first architecture
- **Storage**: LocalStorage/IndexedDB for offline data persistence
- **Canvas**: HTML5 Canvas for drawing functionality
- **Responsive Design**: CSS Grid/Flexbox for multi-device support

### Browser Compatibility
- Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- Android WebView 70+, iOS Safari 12+
- Touch and pen input support

## Project Structure
```
/project-root
├── index.html (Home page)
├── manifest.json (PWA manifest)
├── service-worker.js (Offline caching)
├── /assets
│   ├── /css
│   │   ├── global.css
│   │   ├── responsive.css
│   │   └── animations.css
│   ├── /js
│   │   ├── app.js (Main application logic)
│   │   ├── navigation.js
│   │   ├── language.js
│   │   ├── drawing.js
│   │   └── quiz.js
│   ├── /images
│   │   ├── icons/ (PWA icons)
│   │   └── subjects/ (Subject illustrations)
│   └── /fonts (Local web fonts)
├── /std1
│   ├── /tamil
│   │   ├── lessons.json (Lesson metadata)
│   │   ├── lesson1.html
│   │   └── lesson2.html
│   ├── /urdu
│   ├── /maths
│   ├── /english
│   ├── /science
│   └── /social
├── /std2 (Same structure as std1)
├── /std3
├── /std4
├── /std5
└── /std6
```

## Page Architecture & Features

### 1. Home Page (index.html)
**Layout Requirements:**
- Header with school name and language switcher (top-right)
- Hamburger menu (top-left) for sidebar navigation
- Grid/List view toggle buttons
- 6 colorful class cards (Standard 1-6) in responsive grid
- Each card shows class number, name, and subject count

**Interactive Features:**
- Smooth hover animations with lift effect
- Click to navigate to class page
- View mode persistence in localStorage
- Touch-friendly buttons (minimum 44px touch target)

**Color Scheme:**
- Std 1: Red/Pink gradient (#FF6B6B)
- Std 2: Teal/Cyan (#4ECDC4) 
- Std 3: Blue (#45B7D1)
- Std 4: Green (#96CEB4)
- Std 5: Yellow/Orange (#FECA57)
- Std 6: Purple/Magenta (#FF9FF3)

### 2. Class Page (Dynamic)
**Layout Requirements:**
- Breadcrumb navigation (Home > Standard X)
- Class title header with gradient background
- 6 subject cards in responsive grid layout
- Sidebar navigation (slide-in from left)

**Subject Cards:**
- Tamil: Book icon, red theme
- Urdu: Script icon, green theme  
- Mathematics: Numbers icon, blue theme
- English: Globe icon, purple theme
- Science: Flask icon, orange theme
- Social Studies: Map icon, teal theme

**Navigation Sidebar:**
- Home link
- All Standards (Std 1-6) quick access
- Settings (placeholder)
- About page
- Smooth slide animation (300ms)
- Overlay background blur

### 3. Lesson Page (Dynamic)
**Layout Components:**
- Lesson header (Subject name + lesson number)
- Completed lessons list with progress indicators
- "Add New Lesson" button
- Active lesson content area
- Interactive quiz section
- HTML5 Canvas drawing area
- Navigation controls

**Lesson Content Features:**
- Rich text content with formatting
- Embedded images and illustrations
- CSS animations for educational concepts
- Progressive disclosure of content
- Auto-save progress to localStorage

**Drawing Canvas:**
- Minimum 600x400px, responsive scaling
- Pen tool with adjustable thickness (2-10px)
- Eraser tool with size options
- Color palette (8 basic colors)
- Clear all functionality
- Save/load drawings to localStorage
- Touch and stylus support
- Smooth line rendering (quadratic curves)

**Quiz System:**
- Multiple choice questions (2-4 options)
- Instant feedback with color coding
- Progress tracking and scoring
- Randomized question order
- Timer functionality (optional)
- Results summary with retry option

## Multi-Language Support

### Language Implementation:
- JSON-based translation files for each language
- Dynamic text replacement using data attributes
- RTL text support for Urdu
- Font loading for Tamil/Urdu scripts
- Language persistence in localStorage
- Instant UI updates without page reload

### Translation Structure:
```javascript
const translations = {
  en: {
    ui: { home: "Home", back: "Back", ... },
    subjects: { maths: "Mathematics", ... },
    lessons: { title: "Lesson {number}", ... }
  },
  ta: {
    ui: { home: "முகப்பு", back: "பின்", ... },
    // Tamil translations
  },
  ur: {
    ui: { home: "گھر", back: "واپس", ... },
    // Urdu translations  
  }
}
```

## PWA Implementation

### Service Worker Requirements:
- Cache all static assets (HTML, CSS, JS, images, fonts)
- Cache dynamic lesson content
- Implement cache-first strategy for assets
- Network-first for lesson data with fallback
- Background sync for progress tracking
- Cache versioning and updates

### Web App Manifest:
```json
{
  "name": "Primary School Learning App",
  "short_name": "School App",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4ECDC4",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "assets/images/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/images/icons/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Responsive Design Specifications

### Breakpoints:
- Mobile: 320px - 768px
- Tablet: 769px - 1024px  
- Desktop/Smart Board: 1025px+

### Smart Board Optimizations:
- Large touch targets (minimum 60px)
- High contrast text (4.5:1 ratio minimum)
- Bold fonts (minimum 18px)
- Simplified navigation
- Reduced cognitive load

### Tablet Optimizations:
- Touch-friendly interfaces
- Swipe gestures for navigation
- Orientation change handling
- Keyboard avoidance for inputs

## Animation & Interactions

### CSS Animations:
- Page transitions (slide, fade)
- Card hover effects (lift, glow)
- Button press feedback
- Loading spinners
- Progress indicators

### Performance Requirements:
- 60fps animations
- Hardware acceleration (transform3d)
- Optimized repaints
- Debounced user inputs

## Data Management

### Local Storage Structure:
```javascript
{
  userProgress: {
    std1: { tamil: { lesson1: "completed", lesson2: "in-progress" } },
    std2: { maths: { lesson1: "completed" } }
  },
  userSettings: {
    language: "en",
    viewMode: "grid",
    soundEnabled: true
  },
  drawings: {
    std1_maths_lesson1: "base64ImageData",
    std2_tamil_lesson3: "base64ImageData"
  }
}
```

## Code Quality Requirements

### JavaScript Standards:
- ES6+ syntax (arrow functions, const/let, template literals)
- Modular architecture with separate concerns
- Error handling with try-catch blocks
- Input validation and sanitization
- Performance monitoring (console.time)

### CSS Standards:
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- CSS custom properties (variables)
- Optimized selectors
- Vendor prefixes for compatibility

### HTML Standards:
- Semantic HTML5 elements
- ARIA labels for accessibility
- Meta tags for SEO and PWA
- Proper heading hierarchy
- Alt text for images

## Testing & Deployment

### Testing Requirements:
- Cross-browser compatibility testing
- Offline functionality testing
- Touch/pen input testing on devices
- Performance testing (Lighthouse)
- Accessibility testing (WAVE, axe)

### Deployment Checklist:
- HTTPS hosting requirement
- Gzip compression enabled
- Cache headers configured
- Service worker registration
- Manifest file linked
- Icons properly sized and linked

## Extension Guidelines

### Adding New Lessons:
1. Create lesson HTML file in appropriate /stdX/subject/ folder
2. Update lessons.json metadata file
3. Add translations to language files
4. Test offline functionality
5. Update service worker cache list

### Adding New Subjects:
1. Create subject folder in each standard directory
2. Add subject card to class page template
3. Create subject icon and styling
4. Add translations for subject name
5. Implement subject-specific lesson templates

## Performance Targets
- First Contentful Paint: < 2 seconds
- Time to Interactive: < 3 seconds
- Bundle size: < 500KB (excluding media)
- Memory usage: < 100MB on mobile devices
- Smooth 60fps animations on all target devices

---

**Final Output Requirements:**
Provide complete, working code files for all components with inline comments explaining functionality. Include setup instructions for testing offline on Windows and Android devices. Code should be production-ready with error handling, performance optimization, and extensibility built in.