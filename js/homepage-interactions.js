/**
 * 首页交互效果 - Homepage Interactions
 * 为首页添加更多动态交互效果
 */

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        initHomepageEffects();
        initScrollToTop();
        initNavbarEffects();
        initSearchEnhancements();
        initPaginationEffects();
    });

    /**
     * 初始化首页效果
     */
    function initHomepageEffects() {
        // 为文章卡片添加增强类
        const postItems = document.querySelectorAll('.post-item, .post-card');
        postItems.forEach(item => {
            item.classList.add('post-item-enhanced');
        });

        // 为分类和标签添加增强类
        const categoryTags = document.querySelectorAll('.category, .tag');
        categoryTags.forEach(tag => {
            tag.classList.add('category-tag');
        });

        // 为导航栏添加增强类
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('navbar-enhanced');
        }

        // 为搜索框添加增强类
        const searchBox = document.querySelector('.search-box, .search-input');
        if (searchBox) {
            searchBox.classList.add('search-box-enhanced');
        }

        // 为分页器添加增强类
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.classList.add('pagination-enhanced');
        }

        // 为页脚添加增强类
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.classList.add('footer-enhanced');
        }
    }

    /**
     * 滚动到顶部按钮
     */
    function initScrollToTop() {
        // 创建滚动到顶部按钮
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-enhanced';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', '回到顶部');
        document.body.appendChild(scrollTopBtn);

        // 监听滚动事件
        let ticking = false;
        function updateScrollTop() {
            const scrolled = window.pageYOffset;
            const shouldShow = scrolled > 300;
            
            if (shouldShow) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
            
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollTop);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);

        // 点击事件
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * 导航栏效果
     */
    function initNavbarEffects() {
        const navbar = document.querySelector('.navbar-enhanced');
        if (!navbar) return;

        let ticking = false;
        function updateNavbar() {
            const scrolled = window.pageYOffset;
            
            if (scrolled > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }

    /**
     * 搜索框增强
     */
    function initSearchEnhancements() {
        const searchBox = document.querySelector('.search-box-enhanced');
        if (!searchBox) return;

        // 添加搜索图标
        const searchIcon = document.createElement('span');
        searchIcon.innerHTML = '🔍';
        searchIcon.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        `;
        searchBox.appendChild(searchIcon);

        // 聚焦效果
        const searchInput = searchBox.querySelector('input');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchIcon.style.opacity = '1';
            });

            searchInput.addEventListener('blur', () => {
                searchIcon.style.opacity = '0.6';
            });
        }
    }

    /**
     * 分页器效果
     */
    function initPaginationEffects() {
        const pagination = document.querySelector('.pagination-enhanced');
        if (!pagination) return;

        const pageItems = pagination.querySelectorAll('.page-item');
        pageItems.forEach((item, index) => {
            // 添加延迟动画
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in');
        });
    }

    /**
     * 文章卡片点击效果
     */
    function initPostCardEffects() {
        const postCards = document.querySelectorAll('.post-item-enhanced');
        
        postCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // 创建波纹效果
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // 添加波纹动画CSS
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 图片懒加载增强
     */
    function initImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    /**
     * 鼠标跟随效果增强
     */
    function initMouseFollower() {
        const follower = document.createElement('div');
        follower.className = 'mouse-follower-enhanced';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,107,107,0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;
        document.body.appendChild(follower);

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            follower.style.display = 'block';
        });

        document.addEventListener('mouseleave', () => {
            follower.style.display = 'none';
        });

        // 平滑跟随动画
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.left = followerX - 10 + 'px';
            follower.style.top = followerY - 10 + 'px';
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
    }

    /**
     * 页面加载动画
     */
    function initPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader-enhanced';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        `;
        
        const loaderContent = document.createElement('div');
        loaderContent.style.cssText = `
            text-align: center;
            color: white;
        `;
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        `;
        
        const text = document.createElement('div');
        text.textContent = 'philo的小站';
        text.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
            opacity: 0.9;
        `;
        
        loaderContent.appendChild(spinner);
        loaderContent.appendChild(text);
        loader.appendChild(loaderContent);
        document.body.appendChild(loader);

        // 页面加载完成后隐藏加载器
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1500);
        });
    }

    // 初始化所有效果
    initPostCardEffects();
    initImageLazyLoading();
    initMouseFollower();
    initPageLoader();

})();
