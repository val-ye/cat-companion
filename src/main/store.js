const fs = require('node:fs');
const path = require('node:path');
const { app } = require('electron');

const FILE = path.join(app.getPath('userData'), 'cat-companion-settings.json');

const DEFAULTS = {
  activeCatIds: ['momo'],
  reminderEnabled: true,
  reminderIntervalMin: 45,
  reminderDurationSec: 120,
  userNickname: '',
  reminderTitle: '该喝水啦',
  reminderMessage: '{name}，起来活动一下，喝口水，看看远处的窗外。',
  catScale: 1.0,
  walkEnabled: true,
};

function load() {
  try {
    if (!fs.existsSync(FILE)) return { ...DEFAULTS };
    const raw = fs.readFileSync(FILE, 'utf8');
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('[store] failed to read settings, using defaults:', e.message);
    return { ...DEFAULTS };
  }
}

function save(settings) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(settings, null, 2), 'utf8');
}

module.exports = { load, save, DEFAULTS, FILE };
