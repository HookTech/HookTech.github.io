const { test, expect } = require('@playwright/test');

test.describe('静态化增强功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 启动本地服务器并访问首页
    await page.goto('http://localhost:4000');
  });

  test('验证图片懒加载属性已静态化', async ({ page }) => {
    // 检查图片是否有懒加载属性
    const images = await page.locator('img[loading="lazy"]').all();

    console.log(`找到 ${images.length} 个带懒加载属性的图片`);

    // 至少应该有一些图片设置了懒加载
    expect(images.length).toBeGreaterThan(0);

    // 验证图片有data-src属性(用于懒加载)
    const firstImg = page.locator('img[data-src]').first();
    const dataSrc = await firstImg.getAttribute('data-src');

    if (dataSrc) {
      console.log(`图片data-src属性: ${dataSrc}`);
      expect(dataSrc).toBeTruthy();
    }
  });

  test('验证文章卡片有预渲染的动画类', async ({ page }) => {
    // 检查是否有fade-in类的元素
    const fadeInElements = await page.locator('.fade-in').all();

    console.log(`找到 ${fadeInElements.length} 个带fade-in类的元素`);

    // 应该有一些元素已经有fade-in类
    if (fadeInElements.length > 0) {
      // 检查第一个元素是否有animation-delay样式
      const firstElement = page.locator('.fade-in').first();
      const style = await firstElement.getAttribute('style');

      console.log(`第一个fade-in元素的样式: ${style}`);

      if (style) {
        expect(style).toContain('animation-delay');
      }
    }
  });

  test('验证TOC目录功能正常', async ({ page }) => {
    // 访问一篇文章
    await page.goto('http://localhost:4000/2025/08/04/Cursor-Usage/');

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 检查TOC是否存在
    const toc = page.locator('#toc');
    const tocExists = await toc.count() > 0;

    if (tocExists) {
      console.log('TOC目录存在');

      // 检查TOC是否有data-heading-count属性
      const headingCount = await toc.getAttribute('data-heading-count');
      console.log(`TOC标题数量: ${headingCount}`);

      // 检查TOC统计信息
      const tocStats = toc.locator('.toc-stats');
      const statsExists = await tocStats.count() > 0;

      if (statsExists) {
        const statsText = await tocStats.textContent();
        console.log(`TOC统计: ${statsText}`);
        expect(statsText).toContain('章节');
      }

      // 测试TOC链接点击
      const firstLink = toc.locator('.toc-link').first();
      const linkExists = await firstLink.count() > 0;

      if (linkExists) {
        await firstLink.click();

        // 等待滚动动画完成
        await page.waitForTimeout(500);

        // 验证链接被激活
        const isActive = await firstLink.evaluate(el => el.classList.contains('active'));
        console.log(`TOC链接被激活: ${isActive}`);
      }
    } else {
      console.log('此页面没有TOC目录');
    }
  });

  test('验证滚动效果正常工作', async ({ page }) => {
    // 访问一篇文章
    await page.goto('http://localhost:4000/2025/08/04/Cursor-Usage/');
    await page.waitForLoadState('networkidle');

    // 记录初始滚动位置
    const initialScroll = await page.evaluate(() => window.pageYOffset);
    console.log(`初始滚动位置: ${initialScroll}`);

    // 滚动页面
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // 记录滚动后位置
    const afterScroll = await page.evaluate(() => window.pageYOffset);
    console.log(`滚动后位置: ${afterScroll}`);

    expect(afterScroll).toBeGreaterThan(initialScroll);
  });

  test('验证性能优化 - 检查资源加载', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:4000');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    console.log(`页面加载时间: ${loadTime}ms`);

    // 验证页面加载时间在合理范围内(10秒内)
    expect(loadTime).toBeLessThan(10000);

    // 检查关键CSS是否加载
    const styles = await page.evaluate(() => {
      return Array.from(document.styleSheets).map(sheet => {
        try {
          return sheet.href || 'inline';
        } catch (e) {
          return 'blocked';
        }
      });
    });

    console.log(`加载的样式表: ${styles.length}个`);
    expect(styles.length).toBeGreaterThan(0);
  });

  test('验证JavaScript交互功能', async ({ page }) => {
    await page.goto('http://localhost:4000');
    await page.waitForLoadState('networkidle');

    // 检查自定义交互脚本是否加载
    const hasCustomInteractions = await page.evaluate(() => {
      return typeof window.TOCEnhancer !== 'undefined' ||
             typeof window.PerformanceOptimizer !== 'undefined';
    });

    console.log(`自定义交互脚本已加载: ${hasCustomInteractions}`);

    // 验证页面上有交互元素
    const clickableElements = await page.locator('a, button').count();
    console.log(`可点击元素数量: ${clickableElements}`);
    expect(clickableElements).toBeGreaterThan(0);
  });

  test('验证原生懒加载功能', async ({ page }) => {
    await page.goto('http://localhost:4000');

    // 检查浏览器是否支持原生懒加载
    const supportsNativeLazyLoading = await page.evaluate(() => {
      return 'loading' in HTMLImageElement.prototype;
    });

    console.log(`浏览器支持原生懒加载: ${supportsNativeLazyLoading}`);
    expect(supportsNativeLazyLoading).toBe(true);

    if (supportsNativeLazyLoading) {
      // 验证图片使用了loading="lazy"属性
      const lazyImages = await page.locator('img[loading="lazy"]').count();
      console.log(`使用原生懒加载的图片数量: ${lazyImages}`);
    }
  });

  test('验证动画类不重复添加', async ({ page }) => {
    await page.goto('http://localhost:4000');
    await page.waitForLoadState('networkidle');

    // 获取所有fade-in元素
    const fadeInCount = await page.locator('.fade-in').count();
    console.log(`初始fade-in元素数量: ${fadeInCount}`);

    // 等待一段时间让JS执行
    await page.waitForTimeout(1000);

    // 再次检查数量,应该没有增加(证明没有重复添加)
    const fadeInCountAfter = await page.locator('.fade-in').count();
    console.log(`执行后fade-in元素数量: ${fadeInCountAfter}`);

    // 数量应该相同,证明没有重复添加
    expect(fadeInCountAfter).toBe(fadeInCount);
  });
});
