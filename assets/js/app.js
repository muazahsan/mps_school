/**
 * Primary School Learning App - Main Application Logic
 * Handles core functionality, data management, and app initialization
 */

class SchoolApp {
    constructor() {
        this.currentLanguage = 'en';
        this.currentViewMode = 'grid';
        this.userProgress = {};
        this.userSettings = {};
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing School App...');
            
            // Load user settings and progress
            await this.loadUserData();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize components
            this.initializeComponents();
            
            // Apply saved settings
            this.applySettings();
            
            // Check online status
            this.setupOnlineStatus();
            
            // Initialize service worker
            this.initServiceWorker();
            
            console.log('School App initialized successfully');
            
            // Hide loading overlay
            this.hideLoading();
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Load user data from localStorage
     */
    async loadUserData() {
        try {
            // Load user progress
            const progressData = localStorage.getItem('userProgress');
            this.userProgress = progressData ? JSON.parse(progressData) : {};
            
            // Load user settings
            const settingsData = localStorage.getItem('userSettings');
            this.userSettings = settingsData ? JSON.parse(settingsData) : {
                language: 'en',
                viewMode: 'grid',
                soundEnabled: true,
                animationsEnabled: true
            };
            
            // Set current language and view mode
            this.currentLanguage = this.userSettings.language;
            this.currentViewMode = this.userSettings.viewMode;
            
        } catch (error) {
            console.error('Error loading user data:', error);
            // Use default settings if loading fails
            this.userSettings = {
                language: 'en',
                viewMode: 'grid',
                soundEnabled: true,
                animationsEnabled: true
            };
        }
    }

    /**
     * Save user data to localStorage
     */
    saveUserData() {
        try {
            localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
            localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Class card click events
        document.querySelectorAll('.class-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const standard = card.dataset.standard;
                this.navigateToStandard(standard);
            });
        });

        // View mode toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const viewMode = btn.dataset.view;
                console.log('View button clicked:', viewMode);
                this.setViewMode(viewMode);
            });
        });

        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const language = btn.dataset.lang;
                this.setLanguage(language);
            });
        });

        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveUserData();
        });

        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Touch events for mobile
        this.setupTouchEvents();
    }

    /**
     * Initialize app components
     */
    initializeComponents() {
        // Initialize navigation
        if (window.Navigation) {
            window.Navigation.init();
        }

        // Initialize language system
        if (window.LanguageManager) {
            window.LanguageManager.init();
        }

        // Set up intersection observer for animations
        this.setupIntersectionObserver();
    }

    /**
     * Apply saved settings to UI
     */
    applySettings() {
        // Apply language
        this.setLanguage(this.currentLanguage, false);
        
        // Apply view mode
        this.setViewMode(this.currentViewMode, false);
        
        // Apply animation settings
        if (!this.userSettings.animationsEnabled) {
            document.body.classList.add('reduced-motion');
        }
        
        // Force translation update
        setTimeout(() => {
            if (window.LanguageManager) {
                window.LanguageManager.applyTranslations();
            }
        }, 100);
    }

    /**
     * Set view mode (grid/list)
     */
    setViewMode(mode, save = true) {
        this.currentViewMode = mode;
        
        // Update UI
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });
        
        const classesGrid = document.getElementById('classesGrid');
        if (classesGrid) {
            // Remove previous view classes
            classesGrid.classList.remove('grid-view', 'list-view');
            // Add new view class
            classesGrid.classList.add(`${mode}-view`);
        }
        
        // Save setting
        if (save) {
            this.userSettings.viewMode = mode;
            this.saveUserData();
        }
        
        console.log('View mode changed to:', mode);
    }

    /**
     * Set language
     */
    setLanguage(language, save = true) {
        this.currentLanguage = language;
        
        // Update UI
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === language);
        });
        
        // Update document language
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
        
        // Update translations
        if (window.LanguageManager) {
            window.LanguageManager.setLanguage(language);
        }
        
        // Save setting
        if (save) {
            this.userSettings.language = language;
            this.saveUserData();
        }
    }

    /**
     * Navigate to standard page
     */
    navigateToStandard(standard) {
        try {
            // Special handling for Standard 1 which is in a subdirectory
            let url;
            if (standard === '1') {
                url = 'std1/std1.html';
            } else {
                url = `std${standard}.html`;
            }
            
            // Add loading animation
            this.showLoading();
            
            // Navigate after a short delay for animation
            setTimeout(() => {
                window.location.href = url;
            }, 300);
            
        } catch (error) {
            console.error('Error navigating to standard:', error);
            this.showError('Navigation failed');
        }
    }

    /**
     * Set up online status monitoring
     */
    setupOnlineStatus() {
        this.isOnline = navigator.onLine;
        this.updateOnlineStatus();
    }

    /**
     * Handle online status changes
     */
    handleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        this.updateOnlineStatus();
        
        if (isOnline) {
            this.syncOfflineData();
        }
    }

    /**
     * Update online status in UI
     */
    updateOnlineStatus() {
        const statusIndicator = document.querySelector('.online-status');
        if (statusIndicator) {
            statusIndicator.classList.toggle('online', this.isOnline);
            statusIndicator.classList.toggle('offline', !this.isOnline);
        }
    }

    /**
     * Sync offline data when back online
     */
    async syncOfflineData() {
        try {
            // Get offline actions from localStorage
            const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
            
            if (offlineActions.length > 0) {
                console.log('Syncing offline data...');
                
                // Process offline actions
                for (const action of offlineActions) {
                    await this.processOfflineAction(action);
                }
                
                // Clear offline actions
                localStorage.removeItem('offlineActions');
                
                console.log('Offline data synced successfully');
            }
        } catch (error) {
            console.error('Error syncing offline data:', error);
        }
    }

    /**
     * Process offline action
     */
    async processOfflineAction(action) {
        // This would typically send data to server
        // For now, just log the action
        console.log('Processing offline action:', action);
    }

    /**
     * Set up intersection observer for scroll animations
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with fade-in-on-scroll class
        document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Set up touch events for mobile
     */
    setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Swipe left/right for navigation
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next page
                    this.handleSwipe('left');
                } else {
                    // Swipe right - previous page
                    this.handleSwipe('right');
                }
            }

            // Reset touch coordinates
            touchStartX = 0;
            touchStartY = 0;
        });
    }

    /**
     * Handle swipe gestures
     */
    handleSwipe(direction) {
        // This can be implemented for page navigation
        console.log(`Swipe ${direction} detected`);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + L: Toggle language
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            this.cycleLanguage();
        }

        // Ctrl/Cmd + V: Toggle view mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            this.toggleViewMode();
        }

        // Escape: Close sidebar
        if (e.key === 'Escape') {
            if (window.Navigation) {
                window.Navigation.closeSidebar();
            }
        }

        // Number keys 1-6: Navigate to standards
        if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            this.navigateToStandard(e.key);
        }
    }

    /**
     * Cycle through languages
     */
    cycleLanguage() {
        const languages = ['en', 'ta', 'ur'];
        const currentIndex = languages.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        this.setLanguage(languages[nextIndex]);
    }

    /**
     * Toggle view mode
     */
    toggleViewMode() {
        const newMode = this.currentViewMode === 'grid' ? 'list' : 'grid';
        this.setViewMode(newMode);
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error(message);
        
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Initialize service worker
     */
    async initServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered:', registration);
                
                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <p>New version available!</p>
            <button onclick="location.reload()">Update Now</button>
        `;
        
        document.body.appendChild(notification);
    }

    /**
     * Get user progress for a specific lesson
     */
    getLessonProgress(standard, subject, lesson) {
        return this.userProgress[standard]?.[subject]?.[lesson] || 'not-started';
    }

    /**
     * Update lesson progress
     */
    updateLessonProgress(standard, subject, lesson, status) {
        if (!this.userProgress[standard]) {
            this.userProgress[standard] = {};
        }
        if (!this.userProgress[standard][subject]) {
            this.userProgress[standard][subject] = {};
        }
        
        this.userProgress[standard][subject][lesson] = status;
        this.saveUserData();
        
        // Sync with service worker if online
        if (this.isOnline && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'UPDATE_PROGRESS',
                data: { standard, subject, lesson, status }
            });
        }
    }

    /**
     * Get overall progress for a standard
     */
    getStandardProgress(standard) {
        const standardProgress = this.userProgress[standard];
        if (!standardProgress) return 0;
        
        let totalLessons = 0;
        let completedLessons = 0;
        
        Object.values(standardProgress).forEach(subject => {
            Object.values(subject).forEach(status => {
                totalLessons++;
                if (status === 'completed') {
                    completedLessons++;
                }
            });
        });
        
        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    }

    /**
     * Play sound effect
     */
    playSound(soundName) {
        if (!this.userSettings.soundEnabled) return;
        
        // This would typically play audio files
        // For now, just log the sound
        console.log(`Playing sound: ${soundName}`);
    }

    /**
     * Vibrate device (if supported)
     */
    vibrate(pattern = 100) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.SchoolApp = new SchoolApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolApp;
} 