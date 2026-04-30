#!/usr/bin/env node
/**
 * Convert the SVG icons in src/assets/icons/ into PNGs Electron's
 * dock/tray APIs can consume. Runs in a hidden Electron BrowserWindow
 * so no extra image-processing dependency is required.
 *
 * Usage:  npx electron scripts/build-icons.js
 *   (or:  npm run build:icons)
 */

const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const ICONS_DIR = path.join(__dirname, '..', 'src', 'assets', 'icons');
const TARGETS = [
  { name: 'dock-awake',    size: 512 },
  { name: 'dock-sleeping', size: 512 },
  { name: 'tray',          size: 32, source: 'dock-sleeping' },
  { name: 'app',           size: 1024, source: 'dock-awake' },
];

async function renderOne(win, svgPath, outPath, size) {
  const svg = fs.readFileSync(svgPath, 'utf8');
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:transparent;width:${size}px;height:${size}px;}
    svg{width:${size}px;height:${size}px;display:block;}
  </style></head><body>${svg}</body></html>`;
  const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  await win.loadURL(dataUrl);
  await new Promise((r) => setTimeout(r, 60));
  const image = await win.webContents.capturePage({ x: 0, y: 0, width: size, height: size });
  fs.writeFileSync(outPath, image.toPNG());
}

app.whenReady().then(async () => {
  for (const t of TARGETS) {
    const sourceName = t.source || t.name;
    const svgPath = path.join(ICONS_DIR, sourceName + '.svg');
    if (!fs.existsSync(svgPath)) {
      console.warn('skip (no SVG):', svgPath);
      continue;
    }
    const win = new BrowserWindow({
      width: t.size,
      height: t.size,
      show: false,
      transparent: true,
      frame: false,
      webPreferences: { offscreen: false },
    });
    const outPath = path.join(ICONS_DIR, t.name + '.png');
    await renderOne(win, svgPath, outPath, t.size);
    win.destroy();
    console.log('wrote', path.relative(process.cwd(), outPath));
  }
  app.quit();
});
