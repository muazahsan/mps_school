# HTML-Based Navigation Guide

## Overview
The navigation system has been converted from JavaScript-based to HTML-based linking to make it easier to add new subjects and syllabi without modifying JavaScript code.

## How It Works

### Standard Navigation (index.html)
Each standard card is now wrapped in an anchor tag:

```html
<a href="std1/std1.html" class="class-card" data-standard="1">
    <div class="card-content">
        <!-- Card content -->
    </div>
</a>
```

### Subject Navigation (std1/std1.html)
Each subject card is now wrapped in an anchor tag:

```html
<a href="tamil/lessons.html" class="class-card" data-subject="tamil">
    <div class="card-content">
        <!-- Card content -->
    </div>
</a>
```

## Adding New Subjects

### Step 1: Create Subject Folder
Create a new folder for your subject in the appropriate standard directory:
```
std1/
├── new-subject/
│   ├── index.html (Coming Soon page)
│   └── lessons.html (If subject has content)
```

### Step 2: Add Subject Card
Add a new subject card in the appropriate section of `std1/std1.html`:

```html
<!-- New Subject -->
<a href="new-subject/index.html" class="class-card" data-subject="new-subject" style="--card-color: #YOUR_COLOR;">
    <div class="card-content">
        <div class="card-icon">
            <!-- Your SVG icon -->
        </div>
        <h3 class="card-title" data-translate="subjects.newSubject">New Subject</h3>
        <p class="card-subtitle" data-translate="subjects.newSubjectDescription">Description</p>
        <div class="card-stats">
            <span class="stat">4 <span data-translate="ui.lessons">Lessons</span></span>
            <span class="stat">0% <span data-translate="ui.progress">Progress</span></span>
        </div>
    </div>
    <div class="card-overlay">
        <button class="enter-btn" data-translate="ui.enterSubject">Enter Subject</button>
    </div>
</a>
```

### Step 3: Add Translations
Add translations for your new subject in the `applyBasicTranslations` function:

```javascript
const translations = {
    en: {
        'subjects.newSubject': 'New Subject',
        'subjects.newSubjectDescription': 'Description of new subject'
    },
    ta: {
        'subjects.newSubject': 'புதிய பாடம்',
        'subjects.newSubjectDescription': 'புதிய பாடத்தின் விளக்கம்'
    },
    ur: {
        'subjects.newSubject': 'نیا مضمون',
        'subjects.newSubjectDescription': 'نیا مضمون کی تفصیل'
    }
};
```

## Adding New Standards

### Step 1: Create Standard Folder
Create a new folder for your standard:
```
std7/
├── std7.html
└── [subjects]/
```

### Step 2: Add Standard Card
Add a new standard card in `index.html`:

```html
<!-- Standard 7 -->
<a href="std7/std7.html" class="class-card" data-standard="7" style="--card-color: #YOUR_COLOR;">
    <div class="card-content">
        <div class="card-icon">
            <!-- Your SVG icon -->
        </div>
        <h3 class="card-title" data-translate="standards.standard7">Standard 7</h3>
        <p class="card-subtitle" data-translate="standards.standard7Subtitle">Advanced Level</p>
        <div class="card-stats">
            <span class="stat">6 <span data-translate="ui.subjects">Subjects</span></span>
            <span class="stat">48 <span data-translate="ui.lessons">Lessons</span></span>
        </div>
    </div>
    <div class="card-overlay">
        <button class="enter-btn" data-translate="ui.enterClass">Enter Class</button>
    </div>
</a>
```

### Step 3: Update Navigation
Add the new standard to the sidebar navigation in all HTML files:

```html
<li><a href="std7/std7.html" class="nav-link" data-translate="standards.standard7">7th STD</a></li>
```

## Benefits of HTML-Based Navigation

1. **Easier Maintenance**: No need to modify JavaScript when adding new subjects
2. **Better SEO**: Search engines can crawl the links more effectively
3. **Accessibility**: Better screen reader support
4. **Performance**: Faster page loads without JavaScript event handlers
5. **Simplicity**: Direct HTML links are more straightforward

## CSS Styling

The CSS has been updated to ensure anchor tags with the `class-card` class behave exactly like the original div cards:

```css
a.class-card {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
}

a.class-card:hover {
    text-decoration: none;
    color: inherit;
}
```

## File Structure Example

```
std1/
├── std1.html (Main standard page)
├── tamil/
│   ├── lessons.html (Has content)
│   └── lessons.json
├── english/
│   └── index.html (Coming soon)
├── maths/
│   └── index.html (Coming soon)
├── science/
│   └── index.html (Coming soon)
├── social/
│   └── index.html (Coming soon)
└── urdu/
    └── index.html (Coming soon)
```

This structure makes it easy to add new subjects by simply creating a new folder and adding a card to the HTML file. 