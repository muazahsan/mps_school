/**
 * Navigation Module
 * Handles sidebar navigation, menu interactions, and page transitions
 */

class Navigation {
    constructor() {
        this.sidebar = null;
        this.menuToggle = null;
        this.closeBtn = null;
        this.overlay = null;
        this.isOpen = false;
        this.isAnimating = false;
    }

    /**
     * Initialize navigation
     */
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.menuToggle = document.getElementById('menuToggle');
        this.closeBtn = document.getElementById('closeSidebar');
        
        if (!this.sidebar || !this.menuToggle) {
            console.warn('Navigation elements not found');
            return;
        }

        // Ensure sidebar starts hidden
        this.sidebar.classList.remove('active');
        this.isOpen = false;

        this.setupEventListeners();
        this.createOverlay();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        
        console.log('Navigation initialized');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Menu toggle
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSidebar();
            });
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Navigation links
        this.setupNavLinks();

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });
    }

    /**
     * Set up navigation links
     */
    setupNavLinks() {
        const navLinks = this.sidebar.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click animation
                this.addClickAnimation(link);
                
                // Handle external links
                if (link.getAttribute('target') === '_blank') {
                    return; // Let default behavior handle it
                }
                
                // Handle internal navigation
                const href = link.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('http')) {
                    e.preventDefault();
                    this.navigateToPage(href);
                }
            });
        });
    }

    /**
     * Create overlay for sidebar
     */
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            backdrop-filter: blur(2px);
        `;
        
        document.body.appendChild(this.overlay);
    }

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    /**
     * Open sidebar
     */
    openSidebar() {
        if (this.isAnimating || this.isOpen) return;
        
        this.isAnimating = true;
        this.isOpen = true;
        
        // Add active classes
        this.sidebar.classList.add('active');
        this.menuToggle.classList.add('active');
        this.overlay.style.visibility = 'visible';
        
        // Trigger animations
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Announce to screen readers
        this.announceToScreenReader('Navigation menu opened');
        
        // Add focus trap
        this.setupFocusTrap();
        
        // Animate menu items
        this.animateMenuItems();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    /**
     * Close sidebar
     */
    closeSidebar() {
        if (this.isAnimating || !this.isOpen) return;
        
        this.isAnimating = true;
        
        // Remove active classes
        this.sidebar.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.overlay.style.opacity = '0';
        
        // Remove focus trap
        this.removeFocusTrap();
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Announce to screen readers
        this.announceToScreenReader('Navigation menu closed');
        
        setTimeout(() => {
            this.overlay.style.visibility = 'hidden';
            this.isOpen = false;
            this.isAnimating = false;
        }, 300);
    }

    /**
     * Animate menu items
     */
    animateMenuItems() {
        const menuItems = this.sidebar.querySelectorAll('.nav-link');
        
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }

    /**
     * Set up focus trap for accessibility
     */
    setupFocusTrap() {
        const focusableElements = this.sidebar.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        this.firstFocusableElement.focus();
        
        // Handle tab key
        this.handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === this.firstFocusableElement) {
                        e.preventDefault();
                        this.lastFocusableElement.focus();
                    }
                } else {
                    if (document.activeElement === this.lastFocusableElement) {
                        e.preventDefault();
                        this.firstFocusableElement.focus();
                    }
                }
            }
        };
        
        this.sidebar.addEventListener('keydown', this.handleTabKey);
    }

    /**
     * Remove focus trap
     */
    removeFocusTrap() {
        if (this.handleTabKey) {
            this.sidebar.removeEventListener('keydown', this.handleTabKey);
            this.handleTabKey = null;
        }
    }

    /**
     * Set up keyboard navigation
     */
    setupKeyboardNavigation() {
        const navLinks = this.sidebar.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.focusNextItem(index, navLinks);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.focusPreviousItem(index, navLinks);
                        break;
                    case 'Home':
                        e.preventDefault();
                        navLinks[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        navLinks[navLinks.length - 1].focus();
                        break;
                }
            });
        });
    }

    /**
     * Focus next navigation item
     */
    focusNextItem(currentIndex, items) {
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
    }

    /**
     * Focus previous navigation item
     */
    focusPreviousItem(currentIndex, items) {
        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        items[prevIndex].focus();
    }

    /**
     * Set up touch gestures
     */
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        this.sidebar.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = false;
        });

        this.sidebar.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            // Check if it's a horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                isDragging = true;
                e.preventDefault();
            }
        });

        this.sidebar.addEventListener('touchend', (e) => {
            if (!isDragging) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            // Swipe left to close sidebar
            if (diffX > 100) {
                this.closeSidebar();
            }

            startX = 0;
            startY = 0;
            isDragging = false;
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close sidebar on large screens if it was opened on mobile
        if (window.innerWidth >= 1024 && this.isOpen) {
            this.closeSidebar();
        }
    }

    /**
     * Navigate to page with transition
     */
    navigateToPage(url) {
        // Show loading
        if (window.SchoolApp) {
            window.SchoolApp.showLoading();
        }
        
        // Add page transition
        document.body.classList.add('page-transitioning');
        
        // Navigate after transition
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    /**
     * Add click animation to element
     */
    addClickAnimation(element) {
        element.classList.add('clicked');
        setTimeout(() => {
            element.classList.remove('clicked');
        }, 200);
    }

    /**
     * Announce to screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    /**
     * Update active navigation item
     */
    updateActiveItem(currentPath) {
        const navLinks = this.sidebar.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Get current page path
     */
    getCurrentPath() {
        return window.location.pathname;
    }

    /**
     * Check if sidebar is open
     */
    isSidebarOpen() {
        return this.isOpen;
    }

    /**
     * Close sidebar (public method)
     */
    close() {
        this.closeSidebar();
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.Navigation = new Navigation();
    window.Navigation.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
} 