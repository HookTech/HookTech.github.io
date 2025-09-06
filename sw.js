/**
 * Service Worker - 缓存策略优化
 * 提升网站加载速度和离线体验
 */

const CACHE_NAME = 'philo-site-v1.0.0';
const STATIC_CACHE = 'philo-static-v1.0.0';
const DYNAMIC_CACHE = 'philo-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/about/',
    '/css/main.css',
    '/css/custom-animations.css',
    '/css/homepage-enhancements.css',
    '/css/performance-optimization.css',
    '/js/boot.js',
    '/js/events.js',
    '/js/plugins.js',
    '/js/custom-interactions.js',
    '/js/homepage-interactions.js',
    '/js/performance-optimization.js',
    '/img/avatar.png',
    '/img/default.png',
    '/img/loading.gif'
];

// 需要缓存的动态资源
const DYNAMIC_ASSETS = [
    '/archives/',
    '/categories/',
    '/tags/',
    '/2025/08/04/Cursor-Usage/',
    '/2018/07/09/Golden-Ratio-Fibonacci/'
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// 拦截请求 - 缓存策略
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理同源请求
    if (url.origin !== location.origin) {
        return;
    }
    
    // 缓存策略
    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        // 返回缓存
                        return response;
                    }
                    
                    // 网络请求
                    return fetch(request)
                        .then(fetchResponse => {
                            // 检查响应是否有效
                            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                                return fetchResponse;
                            }
                            
                            // 克隆响应
                            const responseToCache = fetchResponse.clone();
                            
                            // 决定缓存策略
                            if (isStaticAsset(request.url)) {
                                // 静态资源 - 长期缓存
                                caches.open(STATIC_CACHE)
                                    .then(cache => {
                                        cache.put(request, responseToCache);
                                    });
                            } else if (isDynamicAsset(request.url)) {
                                // 动态资源 - 短期缓存
                                caches.open(DYNAMIC_CACHE)
                                    .then(cache => {
                                        cache.put(request, responseToCache);
                                    });
                            }
                            
                            return fetchResponse;
                        })
                        .catch(error => {
                            console.error('Service Worker: Fetch failed', error);
                            
                            // 返回离线页面或默认内容
                            if (request.destination === 'document') {
                                return caches.match('/');
                            }
                            
                            throw error;
                        });
                })
        );
    }
});

// 判断是否为静态资源
function isStaticAsset(url) {
    return url.includes('/css/') || 
           url.includes('/js/') || 
           url.includes('/img/') || 
           url.includes('/fonts/') ||
           url.endsWith('.css') ||
           url.endsWith('.js') ||
           url.endsWith('.png') ||
           url.endsWith('.jpg') ||
           url.endsWith('.jpeg') ||
           url.endsWith('.gif') ||
           url.endsWith('.svg') ||
           url.endsWith('.woff') ||
           url.endsWith('.woff2');
}

// 判断是否为动态资源
function isDynamicAsset(url) {
    return url.includes('/archives/') ||
           url.includes('/categories/') ||
           url.includes('/tags/') ||
           url.includes('/2025/') ||
           url.includes('/2018/') ||
           url.includes('/about/');
}

// 消息处理 - 手动更新缓存
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        const urlsToCache = event.data.payload;
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    return cache.addAll(urlsToCache);
                })
        );
    }
});

// 后台同步 - 预加载资源
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            preloadCriticalResources()
        );
    }
});

// 预加载关键资源
function preloadCriticalResources() {
    const criticalUrls = [
        '/css/performance-optimization.css',
        '/js/performance-optimization.js'
    ];
    
    return caches.open(STATIC_CACHE)
        .then(cache => {
            return cache.addAll(criticalUrls);
        });
}

console.log('Service Worker: Loaded successfully');
