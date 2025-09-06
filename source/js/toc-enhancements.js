/**
 * 目录区域增强脚本 - TOC Enhancements
 * 优化目录的交互体验和视觉效果
 */

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        enhanceTOC();
    });

    function enhanceTOC() {
        const toc = document.getElementById('toc');
        if (!toc) return;

        // 1. 添加加载状态
        toc.classList.add('loading');
        
        // 2. 延迟加载目录内容
        setTimeout(() => {
            initTOCInteractions();
            initTOCAnimations();
            initTOCScrollSpy();
            toc.classList.remove('loading');
        }, 300);
    }

    /**
     * 初始化目录交互
     */
    function initTOCInteractions() {
        const tocLinks = document.querySelectorAll('#toc .toc-link');
        
        tocLinks.forEach(link => {
            // 添加点击效果
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 移除所有激活状态
                tocLinks.forEach(l => l.classList.remove('active'));
                
                // 添加当前激活状态
                this.classList.add('active');
                
                // 平滑滚动到目标位置
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
                
                // 添加点击动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });

            // 添加悬停效果
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(4px)';
            });

            link.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    /**
     * 初始化目录动画
     */
    function initTOCAnimations() {
        const toc = document.getElementById('toc');
        const tocLinks = document.querySelectorAll('#toc .toc-link');
        
        // 为每个目录项添加延迟动画
        tocLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 + index * 50);
        });

        // 添加目录整体动画
        toc.style.opacity = '0';
        toc.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            toc.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            toc.style.opacity = '1';
            toc.style.transform = 'translateY(0)';
        }, 200);
    }

    /**
     * 初始化滚动监听
     */
    function initTOCScrollSpy() {
        const tocLinks = document.querySelectorAll('#toc .toc-link');
        const sections = [];
        
        // 收集所有目标章节
        tocLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const section = document.querySelector(targetId);
                if (section) {
                    sections.push({
                        element: section,
                        link: link
                    });
                }
            }
        });

        // 滚动监听
        let ticking = false;
        
        function updateActiveSection() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            let activeSection = null;
            
            sections.forEach(({ element, link }) => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollTop;
                const elementBottom = elementTop + rect.height;
                
                // 检查元素是否在视口中
                if (scrollTop >= elementTop - 100 && scrollTop < elementBottom - windowHeight / 2) {
                    activeSection = link;
                }
            });
            
            // 更新激活状态
            tocLinks.forEach(link => link.classList.remove('active'));
            if (activeSection) {
                activeSection.classList.add('active');
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateActiveSection);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // 初始检查
        updateActiveSection();
    }

    /**
     * 添加目录折叠功能
     */
    function initTOCCollapse() {
        const toc = document.getElementById('toc');
        if (!toc) return;

        // 创建折叠按钮
        const collapseBtn = document.createElement('button');
        collapseBtn.innerHTML = '📋';
        collapseBtn.className = 'toc-collapse-btn';
        collapseBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.2s ease;
        `;

        const tocContent = toc.querySelector('.toc-list');
        let isCollapsed = false;

        collapseBtn.addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            
            if (isCollapsed) {
                tocContent.style.maxHeight = '0';
                tocContent.style.overflow = 'hidden';
                collapseBtn.innerHTML = '📂';
                collapseBtn.style.transform = 'rotate(0deg)';
            } else {
                tocContent.style.maxHeight = 'none';
                tocContent.style.overflow = 'visible';
                collapseBtn.innerHTML = '📋';
                collapseBtn.style.transform = 'rotate(0deg)';
            }
        });

        toc.style.position = 'relative';
        toc.appendChild(collapseBtn);
    }

    /**
     * 添加目录搜索功能
     */
    function initTOCSearch() {
        const toc = document.getElementById('toc');
        if (!toc) return;

        // 创建搜索框
        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = '搜索目录...';
        searchBox.className = 'toc-search';
        searchBox.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            margin-bottom: 12px;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 6px;
            font-size: 14px;
            background: rgba(255,255,255,0.8);
            transition: all 0.2s ease;
        `;

        const tocTitle = toc.querySelector('.toc-title');
        if (tocTitle) {
            tocTitle.parentNode.insertBefore(searchBox, tocTitle.nextSibling);
        }

        // 搜索功能
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tocLinks = document.querySelectorAll('#toc .toc-link');
            
            tocLinks.forEach(link => {
                const text = link.textContent.toLowerCase();
                const listItem = link.closest('li');
                
                if (text.includes(searchTerm)) {
                    listItem.style.display = 'block';
                    link.style.opacity = '1';
                } else {
                    listItem.style.display = searchTerm ? 'none' : 'block';
                    link.style.opacity = searchTerm ? '0.3' : '1';
                }
            });
        });

        // 搜索框样式
        searchBox.addEventListener('focus', function() {
            this.style.borderColor = '#3498db';
            this.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
        });

        searchBox.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(0,0,0,0.1)';
            this.style.boxShadow = 'none';
        });
    }

    /**
     * 添加目录统计信息
     */
    function addTOCStats() {
        const toc = document.getElementById('toc');
        if (!toc) return;

        const tocLinks = document.querySelectorAll('#toc .toc-link');
        const stats = document.createElement('div');
        stats.className = 'toc-stats';
        stats.style.cssText = `
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(0,0,0,0.1);
            font-size: 12px;
            color: #7f8c8d;
            text-align: center;
        `;
        
        stats.innerHTML = `共 ${tocLinks.length} 个章节`;
        toc.appendChild(stats);
    }

    // 初始化所有功能
    setTimeout(() => {
        initTOCCollapse();
        initTOCSearch();
        addTOCStats();
    }, 500);

    // 导出功能供其他脚本使用
    window.TOCEnhancer = {
        enhanceTOC,
        initTOCInteractions,
        initTOCAnimations,
        initTOCScrollSpy
    };

})();
