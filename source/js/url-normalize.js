(function(){
  try {
    var path = location.pathname;
    // 保留验证与特殊页面
    var keepList = [/^\/404\.html$/i, /^\/google[0-9a-f]+\.html$/i];
    var keep = keepList.some(function(r){ return r.test(path); });
    if (keep) return;
    if (path.endsWith('/index.html')) {
      var to = path.slice(0, -('/index.html'.length)) || '/';
      location.replace(to + location.search + location.hash);
      return;
    }
    if (/\.html$/i.test(path)) {
      var to2 = path.replace(/\.html$/i, '');
      location.replace(to2 + '/'+ location.search + location.hash);
    }
  } catch (_) {}
})();

