'use strict';

const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // matches reminder.css

let countdownTimer = null;

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

  startCountdown(Math.max(5, Number(settings.reminderDurationSec) || 120));
}

function startCountdown(totalSec) {
  const ring = document.querySelector('#ring .ring-fill');
  const text = document.getElementById('countdownText');
  const start = Date.now();
  const endAt = start + totalSec * 1000;

  ring.style.strokeDasharray = String(RING_CIRCUMFERENCE);
  ring.style.strokeDashoffset = '0';

  const tick = () => {
    const remainingMs = Math.max(0, endAt - Date.now());
    const remainingSec = Math.ceil(remainingMs / 1000);
    const elapsedFrac = 1 - remainingMs / (totalSec * 1000);
    ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * elapsedFrac);
    text.textContent = formatMMSS(remainingSec);
    text.classList.toggle('urgent', remainingSec <= 10 && remainingSec > 0);

    if (remainingMs <= 0) {
      clearInterval(countdownTimer);
      dismiss();
    }
  };
  tick();
  countdownTimer = setInterval(tick, 250);
}

function formatMMSS(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function dismiss() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  window.catApi.dismissReminder();
}

init();
