const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  Menu,
  Tray,
  nativeImage,
} = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const store = require('./store');
const { listCats, getCat } = require('../cats');

const isMac = process.platform === 'darwin';

let settings = store.load();
const petWindows = new Map(); // catId -> BrowserWindow
let settingsWindow = null;
let reminderWindow = null;
let reminderTimer = null;
let tray = null;

const RENDERER = path.join(__dirname, '..', 'renderer');

// ---------- Pet windows ----------

function spawnPet(catId) {
  if (petWindows.has(catId)) {
    petWindows.get(catId).focus();
    return;
  }
  const cat = getCat(catId);
  if (!cat) return;

  const display = screen.getPrimaryDisplay();
  const { workArea } = display;
  const scale = settings.catScale || 1;
  const w = Math.round(cat.defaultSize.width * scale);
  const h = Math.round(cat.defaultSize.height * scale);
  const spawnIndex = petWindows.size;
  const spread = Math.min(workArea.width - w, 160 + spawnIndex * 140);
  const safeX = Math.max(0, Math.min(workArea.width - w, spread));

  const win = new BrowserWindow({
    width: w,
    height: h,
    x: workArea.x + Math.round(Math.random() * safeX),
    y: workArea.y + workArea.height - h - 80,
    transparent: true,
    frame: false,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    skipTaskbar: false,
    alwaysOnTop: true,
    focusable: true,
    acceptFirstMouse: true,
    type: isMac ? undefined : 'toolbar',
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setAlwaysOnTop(true, 'floating');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });

  win.loadFile(path.join(RENDERER, 'pet', 'pet.html'), {
    query: { catId },
  });

  win.on('closed', () => {
    petWindows.delete(catId);
    updateDock();
  });

  petWindows.set(catId, win);
  updateDock();
}

function despawnPet(catId) {
  const win = petWindows.get(catId);
  if (win && !win.isDestroyed()) win.close();
}

function syncActiveCats() {
  const active = new Set(settings.activeCatIds);
  // close de-selected
  for (const id of [...petWindows.keys()]) {
    if (!active.has(id)) despawnPet(id);
  }
  // open newly selected
  for (const id of active) {
    if (!petWindows.has(id)) spawnPet(id);
  }
}

// ---------- Reminder ----------

function showReminder() {
  if (reminderWindow && !reminderWindow.isDestroyed()) {
    reminderWindow.focus();
    return;
  }
  const display = screen.getPrimaryDisplay();
  const { bounds } = display;

  reminderWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    fullscreenable: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  reminderWindow.setAlwaysOnTop(true, 'screen-saver');
  reminderWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  reminderWindow.loadFile(path.join(RENDERER, 'reminder', 'reminder.html'));

  reminderWindow.on('closed', () => {
    reminderWindow = null;
  });
}

function dismissReminder() {
  if (reminderWindow && !reminderWindow.isDestroyed()) reminderWindow.close();
}

function rescheduleReminder() {
  if (reminderTimer) {
    clearInterval(reminderTimer);
    reminderTimer = null;
  }
  if (!settings.reminderEnabled) return;
  const ms = Math.max(1, settings.reminderIntervalMin) * 60 * 1000;
  reminderTimer = setInterval(showReminder, ms);
}

// ---------- Settings window ----------

function openSettings() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }
  settingsWindow = new BrowserWindow({
    width: 520,
    height: 640,
    title: 'Purrtners',
    resizable: false,
    minimizable: false,
    maximizable: false,
    backgroundColor: '#1c1f24',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  settingsWindow.loadFile(path.join(RENDERER, 'settings', 'settings.html'));
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// ---------- Dock + Tray ----------

function buildDockMenu() {
  const cats = listCats();
  const items = [
    ...cats.map((c) => ({
      label: `${c.name} ${settings.activeCatIds.includes(c.id) ? '●' : '○'}`,
      click: () => {
        const set = new Set(settings.activeCatIds);
        if (set.has(c.id)) set.delete(c.id);
        else set.add(c.id);
        settings.activeCatIds = [...set];
        store.save(settings);
        syncActiveCats();
        if (isMac && app.dock) app.dock.setMenu(buildDockMenu());
      },
    })),
    { type: 'separator' },
    { label: '现在提醒我一次', click: showReminder },
    { label: '设置…', click: openSettings },
  ];
  return Menu.buildFromTemplate(items);
}

function setDockIcon(state) {
  // state: 'sleeping' | 'awake'
  if (!isMac || !app.dock) return;
  const iconPath = path.join(
    __dirname,
    '..',
    'assets',
    'icons',
    state === 'sleeping' ? 'dock-sleeping.png' : 'dock-awake.png',
  );
  if (fs.existsSync(iconPath)) {
    try {
      app.dock.setIcon(nativeImage.createFromPath(iconPath));
    } catch (e) {
      // ignore — icon is optional
    }
  }
}

function updateDock() {
  if (!isMac || !app.dock) return;
  app.dock.setMenu(buildDockMenu());
  setDockIcon(petWindows.size === 0 ? 'sleeping' : 'awake');
}

function buildTray() {
  // Tray works on all platforms; on mac it's the menubar item.
  const iconPath = path.join(__dirname, '..', 'assets', 'icons', 'tray.png');
  const image = fs.existsSync(iconPath)
    ? nativeImage.createFromPath(iconPath)
    : nativeImage.createEmpty();
  try {
    tray = new Tray(image.isEmpty() ? nativeImage.createEmpty() : image);
    tray.setToolTip('Purrtners');
    tray.setContextMenu(buildDockMenu());
  } catch (e) {
    // Tray creation can fail in headless envs; that's OK.
  }
}

// ---------- IPC ----------

ipcMain.handle('settings:get', () => settings);
ipcMain.handle('cats:list', () => listCats());
ipcMain.handle('cat:get', (_evt, id) => {
  const c = getCat(id);
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    species: c.species,
    accentColor: c.accentColor,
    description: c.description,
    weightKg: c.weightKg,
    defaultSize: c.defaultSize,
    poses: c.poses,
    behaviorProfile: c.behaviorProfile || null,
  };
});

ipcMain.handle('settings:update', (_evt, patch) => {
  settings = { ...settings, ...patch };
  store.save(settings);
  syncActiveCats();
  rescheduleReminder();
  updateDock();
  return settings;
});

ipcMain.handle('reminder:trigger', () => showReminder());
ipcMain.handle('reminder:dismiss', () => dismissReminder());

ipcMain.on('pet:move', (evt, { dx, dy }) => {
  const win = BrowserWindow.fromWebContents(evt.sender);
  if (!win) return;
  const [x, y] = win.getPosition();
  win.setPosition(Math.round(x + dx), Math.round(y + dy));
});

ipcMain.on('pet:set-position', (evt, { x, y }) => {
  const win = BrowserWindow.fromWebContents(evt.sender);
  if (!win) return;
  win.setPosition(Math.round(x), Math.round(y));
});

ipcMain.handle('pet:bounds', (evt) => {
  const win = BrowserWindow.fromWebContents(evt.sender);
  if (!win) return null;
  const [x, y] = win.getPosition();
  const [w, h] = win.getSize();
  const display = screen.getDisplayNearestPoint({ x, y });
  return { x, y, w, h, workArea: display.workArea };
});

ipcMain.on('pet:close', (evt) => {
  const win = BrowserWindow.fromWebContents(evt.sender);
  if (win && !win.isDestroyed()) win.close();
});

ipcMain.on('settings:open', () => openSettings());

// ---------- App lifecycle ----------

app.whenReady().then(() => {
  if (isMac && app.dock) {
    // Keep the dock icon visible — that's the whole point.
    app.dock.show();
  }
  buildTray();
  syncActiveCats();
  rescheduleReminder();
  updateDock();
});

app.on('window-all-closed', (e) => {
  // Don't quit when last pet is closed — stay alive in dock.
  e.preventDefault();
});

app.on('activate', () => {
  if (petWindows.size === 0) {
    syncActiveCats();
  }
});

app.on('before-quit', () => {
  if (reminderTimer) clearInterval(reminderTimer);
});
