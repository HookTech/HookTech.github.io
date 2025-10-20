/**
 * 字体懒加载 + FOUT 优化
 * - 异步加载 Google Fonts（含国内镜像兜底）
 * - 首次加载后缓存状态，后续页面尽早应用，减少闪烁
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'fonts-loaded-v1';

  function addLoadedClass() {
    document.documentElement.classList.add('fonts-loaded');
  }

  function loadFontStylesheet(href) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.crossOrigin = 'anonymous';
      link.onload = function () {
        link.rel = 'stylesheet';
        resolve();
      };
      link.onerror = function () { reject(new Error('font css load failed')); };
      (document.head || document.getElementsByTagName('head')[0]).appendChild(link);
    });
  }

  function ensureFonts() {
    // 如果已存在 Inter 字体，则直接标记完成
    try {
      if (document.fonts && document.fonts.check && document.fonts.check('1em "Inter"')) {
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
        addLoadedClass();
        return;
      }
    } catch (e) {}

    var primary = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    var mirror = 'https://fonts.loli.net/css2?family=Inter:wght@400;500;600;700&display=swap';

    loadFontStylesheet(primary)
      .catch(function () { return loadFontStylesheet(mirror); })
      .then(function () {
        // 等待关键字重权重字重就绪，或 2s 兜底
        var loading = [];
        try {
          if (document.fonts && document.fonts.load) {
            loading.push(document.fonts.load('400 1em Inter'));
            loading.push(document.fonts.load('600 1em Inter'));
          }
        } catch (e) {}
        return Promise.race([
          Promise.all(loading).catch(function () {}),
          new Promise(function (r) { setTimeout(r, 2000); })
        ]);
      })
      .then(function () {
        addLoadedClass();
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      })
      .catch(function () { /* 静默失败，不影响首屏渲染 */ });
  }

  // 已缓存则尽早应用类，异步保证样式就绪
  try {
    if (localStorage.getItem(STORAGE_KEY)) {
      addLoadedClass();
      setTimeout(ensureFonts, 0);
      return;
    }
  } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureFonts);
  } else {
    ensureFonts();
  }
})();

