/**
 * 性能优化脚本 - Performance Optimization
 * 减少加载时间，提升用户体验
 */

(function() {
    'use strict';

    // 1. 延迟加载非关键JavaScript
    function deferNonCriticalJS() {
        // 延迟加载非关键功能
        const nonCriticalFeatures = [
            'mouse-follower',
            'page-loader',
            'advanced-animations'
        ];

        // 使用requestIdleCallback延迟执行
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                loadNonCriticalFeatures();
            });
        } else {
            setTimeout(loadNonCriticalFeatures, 2000);
        }
    }

    function loadNonCriticalFeatures() {
        // 延迟加载鼠标跟随效果
        if (document.querySelector('.mouse-follower-enhanced')) {
            initMouseFollower();
        }
    }

    // 2. 优化页面加载动画
    function optimizePageLoader() {
        const loader = document.querySelector('.page-loader-enhanced');
        if (loader) {
            // 减少加载动画时间
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.remove();
                    }, 300); // 减少延迟时间
                }, 500); // 减少初始延迟
            });
        }
    }

    // 3. 图片懒加载优化
    function optimizeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px', // 提前50px开始加载
                threshold: 0.01
            });

            // 观察所有懒加载图片
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // 4. 防抖和节流优化
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 5. 优化滚动事件
    function optimizeScrollEvents() {
        const scrollHandler = throttle(() => {
            const scrolled = window.pageYOffset;
            
            // 更新导航栏
            const navbar = document.querySelector('.navbar-enhanced');
            if (navbar) {
                if (scrolled > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // 更新滚动进度条
            const indicator = document.querySelector('.scroll-indicator');
            if (indicator) {
                const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
                const percentage = (scrolled / maxHeight) * 100;
                indicator.style.width = percentage + '%';
            }
        }, 16); // 60fps

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // 6. 预加载关键资源
    function preloadCriticalResources() {
        // 预加载关键CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.href = '/css/performance-optimization.css';
        criticalCSS.as = 'style';
        document.head.appendChild(criticalCSS);

        // 预加载关键图片
        const criticalImages = [
            '/img/avatar.png',
            '/img/default.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    // 7. 减少DOM操作
    function optimizeDOMOperations() {
        // 使用DocumentFragment减少重排
        const fragment = document.createDocumentFragment();
        
        // 批量处理DOM操作
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.05}s`; // 减少延迟
        });
    }

    // 8. 内存优化
    function optimizeMemory() {
        // 清理事件监听器
        window.addEventListener('beforeunload', () => {
            // 清理定时器
            const timers = window.performance.getEntriesByType('measure');
            timers.forEach(timer => {
                if (timer.name.includes('timer')) {
                    clearTimeout(timer.startTime);
                }
            });
        });
    }

    // 9. 网络优化
    function optimizeNetwork() {
        // 使用Service Worker缓存
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // 静默失败
            });
        }

        // 预连接到CDN域名 - 优化版本
        const preconnectDomains = [
            'https://cdn.jsdelivr.net',
            'https://busuanzi.ibruce.info',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // 预加载关键CDN资源
        const preloadResources = [
            {
                href: 'https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js',
                as: 'script'
            },
            {
                href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css',
                as: 'style'
            }
        ];

        preloadResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // 10. 关键路径优化
    function optimizeCriticalPath() {
        // 内联关键CSS
        const criticalCSS = `
            body { margin: 0; font-family: system-ui, sans-serif; }
            .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
            .main-content { margin-top: 60px; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // 11. 性能监控
    function monitorPerformance() {
        // 监控页面加载时间
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            if (loadTime > 3000) {
                console.warn('页面加载时间过长:', loadTime + 'ms');
            }
        });

        // 监控资源加载
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.duration > 1000) {
                    console.warn('资源加载缓慢:', entry.name, entry.duration + 'ms');
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }

    // 初始化性能优化
    function initPerformanceOptimization() {
        // 立即执行关键优化
        optimizeCriticalPath();
        preloadCriticalResources();
        optimizeDOMOperations();
        
        // 延迟执行非关键优化
        deferNonCriticalJS();
        optimizePageLoader();
        optimizeLazyLoading();
        optimizeScrollEvents();
        optimizeMemory();
        optimizeNetwork();
        monitorPerformance();
    }

    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformanceOptimization);
    } else {
        initPerformanceOptimization();
    }

    // 导出优化函数供其他脚本使用
    window.PerformanceOptimizer = {
        debounce,
        throttle,
        optimizeLazyLoading,
        optimizeScrollEvents
    };

})();
