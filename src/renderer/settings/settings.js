'use strict';

const $ = (id) => document.getElementById(id);

let cats = [];
let settings = null;

async function init() {
  cats = await window.catApi.listCats();
  settings = await window.catApi.getSettings();
  renderCats();

  $('reminderEnabled').checked = !!settings.reminderEnabled;
  $('interval').value = settings.reminderIntervalMin;
  $('duration').value = settings.reminderDurationSec;
  $('nickname').value = settings.userNickname || '';
  $('title').value = settings.reminderTitle;
  $('message').value = settings.reminderMessage;
  $('scale').value = settings.catScale;
  $('scaleValue').textContent = `${Number(settings.catScale).toFixed(1)}×`;

  $('scale').addEventListener('input', () => {
    $('scaleValue').textContent = `${Number($('scale').value).toFixed(1)}×`;
  });

  $('save').addEventListener('click', save);
  $('testReminder').addEventListener('click', () => window.catApi.triggerReminder());
}

function renderCats() {
  const list = $('catList');
  list.innerHTML = '';
  for (const cat of cats) {
    const item = document.createElement('label');
    item.className = 'cat-item';
    if (settings.activeCatIds.includes(cat.id)) item.classList.add('checked');
    item.style.setProperty('--accent', cat.accentColor);

    const thumb = document.createElement('div');
    thumb.className = 'cat-thumb';
    // Lazy-fetch the SVG
    window.catApi.getCat(cat.id).then((full) => {
      if (full) thumb.innerHTML = full.poses.idle;
    });

    const meta = document.createElement('div');
    meta.className = 'cat-meta';
    meta.innerHTML =
      `<div class="name">${cat.name}</div>` +
      `<div class="species">${cat.species}${cat.weightKg ? ` · ${cat.weightKg.toFixed(1)} kg` : ''}</div>` +
      `<div class="desc">${cat.description || ''}</div>`;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = settings.activeCatIds.includes(cat.id);
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!settings.activeCatIds.includes(cat.id))
          settings.activeCatIds = [...settings.activeCatIds, cat.id];
        item.classList.add('checked');
      } else {
        settings.activeCatIds = settings.activeCatIds.filter((id) => id !== cat.id);
        item.classList.remove('checked');
      }
    });

    item.appendChild(cb);
    item.appendChild(thumb);
    item.appendChild(meta);
    list.appendChild(item);
  }
}

async function save() {
  const patch = {
    activeCatIds: settings.activeCatIds,
    reminderEnabled: $('reminderEnabled').checked,
    reminderIntervalMin: Math.max(1, Number($('interval').value) || 45),
    reminderDurationSec: Math.max(5, Math.min(3600, Number($('duration').value) || 120)),
    userNickname: $('nickname').value.trim(),
    reminderTitle: $('title').value.trim() || '该喝水啦',
    reminderMessage: $('message').value.trim() || '{name}，起来活动一下，喝口水。',
    catScale: Math.max(0.6, Math.min(1.6, Number($('scale').value) || 1)),
  };
  settings = await window.catApi.updateSettings(patch);
  const status = $('status');
  status.textContent = '已保存 ✓';
  status.classList.add('visible');
  setTimeout(() => status.classList.remove('visible'), 1600);
}

init();
