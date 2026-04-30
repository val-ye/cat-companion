'use strict';

async function init() {
  const settings = await window.catApi.getSettings();
  document.getElementById('title').textContent = settings.reminderTitle || '该喝水啦';
  document.getElementById('message').textContent =
    settings.reminderMessage || '起来活动一下,喝口水。';

  const catsContainer = document.getElementById('cats');
  const ids = settings.activeCatIds && settings.activeCatIds.length
    ? settings.activeCatIds
    : ['momo'];

  for (const id of ids) {
    const cat = await window.catApi.getCat(id);
    if (!cat) continue;
    const wrap = document.createElement('div');
    wrap.className = 'reminder-cat';
    wrap.innerHTML = cat.poses.alert || cat.poses.idle;
    catsContainer.appendChild(wrap);
  }

  document.getElementById('dismiss').addEventListener('click', dismiss);
  document.getElementById('backdrop').addEventListener('click', dismiss);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismiss();
  });
}

function dismiss() {
  window.catApi.dismissReminder();
}

init();
