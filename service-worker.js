const CACHE_NAME = 'school-app-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/global.css',
    '/assets/css/responsive.css',
    '/assets/css/animations.css',
    '/assets/js/app.js',
    '/assets/js/navigation.js',
    '/assets/js/language.js',
    '/assets/js/drawing.js',
    '/assets/js/quiz.js',
    '/assets/fonts/NotoSans-Regular.woff2',
    '/assets/fonts/NotoSansTamil-Regular.woff2',
    '/assets/fonts/NotoNastaliqUrdu-Regular.woff2',
    '/assets/images/icons/icon-16.png',
    '/assets/images/icons/icon-32.png',
    '/assets/images/icons/icon-72.png',
    '/assets/images/icons/icon-96.png',
    '/assets/images/icons/icon-128.png',
    '/assets/images/icons/icon-144.png',
    '/assets/images/icons/icon-152.png',
    '/assets/images/icons/icon-192.png',
    '/assets/images/icons/icon-384.png',
    '/assets/images/icons/icon-512.png'
];

// Standard pages to cache
const STANDARD_PAGES = [
    '/std1.html',
    '/std2.html',
    '/std3.html',
    '/std4.html',
    '/std5.html',
    '/std6.html'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(request.url)) {
        // Cache-first strategy for static assets
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isLessonContent(request.url)) {
        // Network-first strategy for lesson content
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else if (isStandardPage(request.url)) {
        // Cache-first for standard pages
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else {
        // Default network-first strategy
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache-first strategy failed:', error);
        return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
        }
        
        return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Helper functions to determine request type
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => url.includes(ext)) || 
           url.includes('/assets/') ||
           url.includes('/manifest.json');
}

function isLessonContent(url) {
    return url.includes('/std') && (url.includes('/lesson') || url.includes('.json'));
}

function isStandardPage(url) {
    return STANDARD_PAGES.some(page => url.includes(page));
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync user progress when online
        const progress = await getStoredProgress();
        if (progress && navigator.onLine) {
            // Here you would typically send progress to server
            console.log('Syncing progress:', progress);
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Helper function to get stored progress
async function getStoredProgress() {
    // This would typically interact with IndexedDB
    // For now, return null
    return null;
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/images/icons/icon-192.png',
            badge: '/assets/images/icons/icon-72.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_LESSON') {
        const { url, content } = event.data;
        cacheLessonContent(url, content);
    }
});

// Cache lesson content
async function cacheLessonContent(url, content) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(content, {
            headers: { 'Content-Type': 'text/html' }
        });
        await cache.put(url, response);
        console.log('Lesson content cached:', url);
    } catch (error) {
        console.error('Error caching lesson content:', error);
    }
} 