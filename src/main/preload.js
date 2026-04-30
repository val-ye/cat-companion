const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('catApi', {
  // settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (patch) => ipcRenderer.invoke('settings:update', patch),

  // cats
  listCats: () => ipcRenderer.invoke('cats:list'),
  getCat: (id) => ipcRenderer.invoke('cat:get', id),

  // pet window
  moveBy: (dx, dy) => ipcRenderer.send('pet:move', { dx, dy }),
  setPosition: (x, y) => ipcRenderer.send('pet:set-position', { x, y }),
  bounds: () => ipcRenderer.invoke('pet:bounds'),
  closeSelf: () => ipcRenderer.send('pet:close'),

  // reminder
  triggerReminder: () => ipcRenderer.invoke('reminder:trigger'),
  dismissReminder: () => ipcRenderer.invoke('reminder:dismiss'),

  // settings window
  openSettings: () => ipcRenderer.send('settings:open'),
});
