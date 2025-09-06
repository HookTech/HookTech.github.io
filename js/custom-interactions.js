/**
 * 自定义交互效果 - Custom Interactions
 * 为philo的小站添加动态交互效果
 */

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        initAnimations();
        initScrollEffects();
        initSkillBars();
        initCounters();
        initScrollIndicator();
        initParallax();
        initTypingEffect();
    });

    /**
     * 初始化动画效果
     */
    function initAnimations() {
        // 为文章卡片添加渐入动画
        const postCards = document.querySelectorAll('.post-item, .post-card, .card');
        postCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // 为导航菜单项添加动画
        const navItems = document.querySelectorAll('.navbar .menu-item');
        navItems.forEach((item, index) => {
            item.classList.add('fade-in');
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    /**
     * 滚动效果
     */
    function initScrollEffects() {
        let ticking = false;

        function updateScrollEffects() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // 视差滚动效果
            const parallaxElements = document.querySelectorAll('.parallax');
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });

            // 导航栏背景透明度
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const opacity = Math.min(scrolled / 100, 1);
                navbar.style.background = `rgba(255, 255, 255, ${0.9 + opacity * 0.1})`;
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }

    /**
     * 技能条动画
     */
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        if (skillBars.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width') || '100%';
                    bar.style.width = width;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            bar.style.width = '0%';
            observer.observe(bar);
        });
    }

    /**
     * 数字计数动画
     */
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target')) || 0;
                    const duration = 2000; // 2秒
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 16);

                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    /**
     * 滚动进度指示器
     */
    function initScrollIndicator() {
        // 创建滚动指示器
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percentage = (scrolled / maxHeight) * 100;
            indicator.style.width = percentage + '%';
        });
    }

    /**
     * 视差效果
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    /**
     * 增强打字机效果
     */
    function initTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-effect');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.classList.add('typing-effect');
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // 延迟开始打字效果
            setTimeout(typeWriter, 500);
        });
    }

    /**
     * 图片懒加载增强
     */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * 平滑滚动到锚点
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * 鼠标跟随效果
     */
    function initMouseFollower() {
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,107,107,0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            follower.style.display = 'block';
            follower.style.left = e.clientX - 10 + 'px';
            follower.style.top = e.clientY - 10 + 'px';
        });

        document.addEventListener('mouseleave', () => {
            follower.style.display = 'none';
        });
    }

    /**
     * 页面加载动画
     */
    function initPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        `;
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        loader.appendChild(spinner);
        document.body.appendChild(loader);

        // 添加旋转动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // 页面加载完成后隐藏加载器 - 优化版本
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 300); // 减少延迟时间
            }, 500); // 减少初始延迟
        });
    }

    // 初始化关键效果 - 性能优化版本
    initLazyLoading();
    initSmoothScroll();
    
    // 延迟初始化非关键效果
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initMouseFollower();
            initPageLoader();
        });
    } else {
        setTimeout(() => {
            initMouseFollower();
            initPageLoader();
        }, 1000);
    }

})();
