#!/usr/bin/env node
/* Measure response times for all generated pages in `public/` against the live site. */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE = 'https://hooktech.github.io';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function collectRoutes(dir) {
  const routes = new Set();
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        const rel = path.relative(PUBLIC_DIR, full).replace(/\\/g, '/');
        if (rel.endsWith('index.html')) {
          const base = rel.slice(0, -'index.html'.length);
          routes.add('/' + base);
        } else {
          routes.add('/' + rel);
        }
      }
    }
  }
  walk(dir);
  const list = Array.from(routes).sort();
  const preferred = list.filter(p => p === '/' || /^(\/20\d{2}\/|\/categories\/|\/tags\/|\/archives\/|\/404\.html|\/links\/)/.test(p));
  const others = list.filter(p => !preferred.includes(p));
  return preferred.concat(others).slice(0, 50);
}

function curlMeasure(url) {
  const fmt = JSON.stringify({
    http_code: '%{http_code}',
    remote_ip: '%{remote_ip}',
    size_download: '%{size_download}',
    time_namelookup: '%{time_namelookup}',
    time_connect: '%{time_connect}',
    time_appconnect: '%{time_appconnect}',
    time_starttransfer: '%{time_starttransfer}',
    time_total: '%{time_total}',
    speed_download: '%{speed_download}'
  });
  const args = ['-sS', '-o', '/dev/null', '-w', fmt, '-H', 'Cache-Control: no-cache', url];
  const res = spawnSync('curl', args, { encoding: 'utf8' });
  if (res.error) throw res.error;
  try {
    return JSON.parse(res.stdout.trim());
  } catch (e) {
    return { error: res.stdout || String(e) };
  }
}

function median(arr) { const a = [...arr].sort((x, y) => x - y); const m = Math.floor(a.length/2); return a.length%2?a[m]:(a[m-1]+a[m])/2; }
function p(arr, q) { const a = [...arr].sort((x, y) => x - y); const i = Math.min(a.length-1, Math.max(0, Math.floor((a.length-1)*q))); return a[i]; }

(function main() {
  const routes = collectRoutes(PUBLIC_DIR);
  const now = Date.now();
  const results = [];
  for (const r of routes) {
    const cold = curlMeasure(SITE + r + (r.includes('?') ? '&' : '?') + 'ts=' + now);
    const warm = curlMeasure(SITE + r);
    results.push({ route: r, cold, warm });
  }
  const totalsCold = results.map(x => parseFloat(x.cold.time_total || '0')).filter(Boolean);
  const totalsWarm = results.map(x => parseFloat(x.warm.time_total || '0')).filter(Boolean);
  const summary = {
    count: results.length,
    cold: { median: median(totalsCold), p90: p(totalsCold, 0.9), p95: p(totalsCold, 0.95) },
    warm: { median: median(totalsWarm), p90: p(totalsWarm, 0.9), p95: p(totalsWarm, 0.95) }
  };
  console.log(JSON.stringify({ summary, results }, null, 2));
})();

