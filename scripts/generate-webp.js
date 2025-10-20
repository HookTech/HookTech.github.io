'use strict';

// Hexo plugin: before_generate -> generate .webp for PNG/JPEG under `source/`
// Requires dependency: cwebp-bin

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const exts = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip build and deps
      if (entry.name === 'public' || entry.name === 'node_modules') continue;
      walk(full, cb);
    } else if (entry.isFile()) {
      cb(full);
    }
  }
}

function ensureDir(p) {
  const d = path.dirname(p);
  fs.mkdirSync(d, { recursive: true });
}

function convertWithCwebp(input, output, quality = 82) {
  return new Promise((resolve, reject) => {
    const cwebp = require('cwebp-bin');
    const args = ['-q', String(quality), input, '-o', output];
    const p = spawn(cwebp, args, { stdio: 'ignore' });
    p.on('error', reject);
    p.on('close', code => code === 0 ? resolve() : reject(new Error('cwebp exit ' + code)));
  });
}

function limit(concurrency, tasks) {
  let i = 0; let active = 0; let resolveAll; const results = [];
  return new Promise(res => { resolveAll = res; run(); });
  function run() {
    while (active < concurrency && i < tasks.length) {
      const idx = i++;
      active++;
      tasks[idx]().then(r => { results[idx] = r; done(); }, _ => done());
    }
    if (i >= tasks.length && active === 0) resolveAll(results);
  }
  function done() { active--; run(); }
}

hexo.extend.filter.register('before_generate', async function() {
  const srcDir = path.join(hexo.base_dir, 'source');
  const toProcess = [];
  walk(srcDir, (file) => {
    const ext = path.extname(file).toLowerCase();
    if (!exts.has(ext)) return;
    const out = file.replace(ext, '.webp');
    try {
      const srcStat = fs.statSync(file);
      const webpStat = fs.existsSync(out) ? fs.statSync(out) : null;
      if (!webpStat || webpStat.mtimeMs < srcStat.mtimeMs) {
        toProcess.push({ input: file, output: out });
      }
    } catch (_) {}
  });

  if (toProcess.length === 0) return;
  hexo.log.i(`[webp] Converting ${toProcess.length} images to WebP...`);
  const tasks = toProcess.map(({ input, output }) => () => {
    ensureDir(output);
    return convertWithCwebp(input, output, 82);
  });
  const concurrency = Math.max(2, Math.min(os.cpus()?.length || 2, 6));
  await limit(concurrency, tasks);
  hexo.log.i('[webp] Done');
});

