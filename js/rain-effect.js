/**
 * 优雅的下雨效果实现
 */
class RainEffect {
    constructor() {
        this.rainContainer = null;
        this.rainDrops = [];
        this.isActive = false;
        this.animationId = null;
        this.splashTimeout = [];
        
        // 配置参数
        this.config = {
            maxDrops: this.isMobile() ? 40 : 80,
            dropSpeed: {
                min: 2,
                max: 6
            },
            dropHeight: {
                min: 15,
                max: 30
            },
            spawnRate: 0.7, // 生成概率
            splashChance: 0.1, // 撞击效果概率
            windEffect: 0.5 // 风效果
        };

        this.init();
    }

    isMobile() {
        return window.innerWidth <= 768;
    }

    init() {
        // 检查用户是否偏好减少动画
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.config.maxDrops = Math.floor(this.config.maxDrops * 0.3);
            this.config.spawnRate = 0.3;
            this.config.splashChance = 0;
        }

        this.createRainContainer();
        this.startRain();
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 页面可见性变化时暂停/恢复动画
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    createRainContainer() {
        this.rainContainer = document.createElement('div');
        this.rainContainer.className = 'rain-container';
        this.rainContainer.id = 'rain-effect-container';
        
        // 将雨效果容器添加到banner内部
        const banner = document.getElementById('banner');
        if (banner) {
            banner.appendChild(this.rainContainer);
        } else {
            document.body.appendChild(this.rainContainer);
        }
    }

    createRainDrop() {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        
        // 随机位置和属性
        const x = Math.random() * (window.innerWidth + 100) - 50;
        const height = this.config.dropHeight.min + 
                      Math.random() * (this.config.dropHeight.max - this.config.dropHeight.min);
        const speed = this.config.dropSpeed.min + 
                      Math.random() * (this.config.dropSpeed.max - this.config.dropSpeed.min);
        const duration = (window.innerHeight + height) / speed / 60; // 转换为秒
        
        drop.style.left = x + 'px';
        drop.style.height = height + 'px';
        drop.style.animationDuration = duration + 's';
        drop.style.animationDelay = Math.random() * 1 + 's';
        
        // 添加轻微的风效果
        const windOffset = (Math.random() - 0.5) * this.config.windEffect;
        drop.style.transform = `translateX(${windOffset}px)`;
        
        // 随机透明度
        drop.style.opacity = 0.3 + Math.random() * 0.4;
        
        this.rainContainer.appendChild(drop);
        this.rainDrops.push({
            element: drop,
            x: x,
            speed: speed,
            createdAt: Date.now()
        });

        // 设置清理定时器
        setTimeout(() => {
            this.removeRainDrop(drop);
        }, (duration + 1) * 1000);

        // 随机添加撞击效果
        if (Math.random() < this.config.splashChance) {
            this.createSplash(x, window.innerHeight - 50, duration * 1000);
        }
    }

    createSplash(x, y, delay) {
        const splashTimeout = setTimeout(() => {
            const splash = document.createElement('div');
            splash.className = 'rain-splash';
            splash.style.left = (x - 4) + 'px';
            splash.style.top = y + 'px';
            
            this.rainContainer.appendChild(splash);
            
            setTimeout(() => {
                if (splash && splash.parentNode) {
                    splash.parentNode.removeChild(splash);
                }
            }, 400);
        }, delay);
        
        this.splashTimeout.push(splashTimeout);
    }

    removeRainDrop(dropElement) {
        if (dropElement && dropElement.parentNode) {
            dropElement.parentNode.removeChild(dropElement);
        }
        
        // 从数组中移除
        this.rainDrops = this.rainDrops.filter(drop => drop.element !== dropElement);
    }

    updateRain() {
        if (!this.isActive) return;

        // 随机生成新雨滴
        if (this.rainDrops.length < this.config.maxDrops && Math.random() < this.config.spawnRate) {
            this.createRainDrop();
        }

        this.animationId = requestAnimationFrame(this.updateRain.bind(this));
    }

    startRain() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.updateRain();
    }

    stopRain() {
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // 清理所有雨滴
        this.rainDrops.forEach(drop => {
            this.removeRainDrop(drop.element);
        });
        this.rainDrops = [];
        
        // 清理所有撞击效果定时器
        this.splashTimeout.forEach(timeout => clearTimeout(timeout));
        this.splashTimeout = [];
        
        // 清理容器
        if (this.rainContainer) {
            this.rainContainer.innerHTML = '';
        }
    }

    handleResize() {
        // 重新计算移动设备状态
        const wasMobile = this.config.maxDrops <= 40;
        const isMobileNow = this.isMobile();
        
        if (wasMobile !== isMobileNow) {
            this.config.maxDrops = isMobileNow ? 40 : 80;
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.stopRain();
        } else {
            this.startRain();
        }
    }

    destroy() {
        this.stopRain();
        
        if (this.rainContainer && this.rainContainer.parentNode) {
            this.rainContainer.parentNode.removeChild(this.rainContainer);
        }
        
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// 页面加载完成后初始化下雨效果
document.addEventListener('DOMContentLoaded', function() {
    // 延迟启动，避免影响页面加载性能
    setTimeout(() => {
        window.rainEffect = new RainEffect();
    }, 1000);
});

// 在页面卸载前清理资源
window.addEventListener('beforeunload', function() {
    if (window.rainEffect) {
        window.rainEffect.destroy();
    }
});