/**
 * Hexo静态增强脚本
 * 在构建时为HTML添加动画类和属性，减少客户端JS工作量
 */

hexo.extend.helper.register('add_animation_classes', function(content, type) {
  if (!content) return '';

  const cheerio = require('cheerio');
  const $ = cheerio.load(content, { decodeEntities: false });

  // 为文章卡片添加fade-in类和延迟
  if (type === 'post-cards') {
    $('.post-item, .post-card, .card').each(function(index) {
      $(this).addClass('fade-in');
      $(this).attr('style', `animation-delay: ${index * 0.1}s`);
    });
  }

  // 为导航菜单项添加动画
  if (type === 'nav-items') {
    $('.navbar .menu-item').each(function(index) {
      $(this).addClass('fade-in');
      $(this).attr('style', `animation-delay: ${index * 0.1}s`);
    });
  }

  return $.html();
});

// 为TOC添加静态属性
hexo.extend.filter.register('after_post_render', function(data) {
  if (!data.content || !data.toc) return data;

  const cheerio = require('cheerio');
  const $ = cheerio.load(data.content, { decodeEntities: false });

  // 统计标题数量
  const headings = $('h1, h2, h3, h4, h5, h6');
  data.heading_count = headings.length;

  // 为每个标题添加data属性方便JS定位
  headings.each(function(index) {
    $(this).attr('data-heading-index', index);
  });

  data.content = $.html();

  return data;
});

// 生成静态TOC增强HTML
hexo.extend.helper.register('static_toc_wrapper', function(tocHtml, headingCount) {
  if (!tocHtml) return '';

  return `
    <div id="toc" class="toc-enhanced" data-heading-count="${headingCount || 0}">
      <div class="toc-content">
        ${tocHtml}
      </div>
      <div class="toc-stats" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 12px; color: #7f8c8d; text-align: center;">
        共 ${headingCount || 0} 个章节
      </div>
    </div>
  `;
});

// 为图片添加懒加载属性
hexo.extend.filter.register('after_post_render', function(data) {
  if (!data.content) return data;

  const cheerio = require('cheerio');
  const $ = cheerio.load(data.content, { decodeEntities: false });

  // 为图片添加懒加载
  $('img').each(function() {
    const $img = $(this);
    const src = $img.attr('src');

    if (src && !src.startsWith('data:')) {
      // 添加懒加载属性
      $img.attr('data-src', src);
      $img.attr('loading', 'lazy');
      $img.addClass('lazy');

      // 添加占位符
      $img.attr('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E');
    }
  });

  data.content = $.html();

  return data;
});

// 带版本号的 JS 加载辅助函数
hexo.extend.helper.register('versioned_js', function(path) {
  const version = hexo.config.version || Date.now();
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return `<script src="${normalizedPath}?v=${version}" defer></script>`;
});

// 带版本号的 CSS 加载辅助函数
hexo.extend.helper.register('versioned_css', function(path) {
  const version = hexo.config.version || Date.now();
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return `<link rel="stylesheet" href="${normalizedPath}?v=${version}">`;
});

console.log('Hexo静态增强脚本已加载');
