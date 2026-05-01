'use strict';

const params = new URLSearchParams(location.search);
const catId = params.get('catId');

const catEl = document.getElementById('cat');

let cat = null;
let walkTimer = null;
let walking = false;
let walkVx = 0;
let walkVy = 0;
let actionTimeout = null;

async function init() {
  cat = await window.catApi.getCat(catId);
  if (!cat) {
    document.body.innerText = 'Unknown cat: ' + catId;
    return;
  }
  setPose('idle');
  installDrag();
  scheduleNextAction();
}

function setPose(pose) {
  if (!cat || !cat.poses[pose]) return;
  catEl.dataset.pose = pose;
  catEl.innerHTML = cat.poses[pose];
}

function flip(facingLeft) {
  catEl.dataset.flip = facingLeft ? 'true' : 'false';
}

// ---------- Drag ----------

function installDrag() {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  document.body.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    lastX = e.screenX;
    lastY = e.screenY;
    catEl.classList.add('dragging');
    clearTimeout(actionTimeout);
    stopWalking();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.screenX - lastX;
    const dy = e.screenY - lastY;
    lastX = e.screenX;
    lastY = e.screenY;
    if (dx || dy) window.catApi.moveBy(dx, dy);
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    catEl.classList.remove('dragging');
    setPose('idle');
    scheduleNextAction(800);
  });

  // Right-click → context menu via the dock isn't reachable here, so
  // give a quick way to dismiss this cat: cmd-click closes it.
  document.body.addEventListener('mousedown', (e) => {
    if (e.metaKey || e.ctrlKey) window.catApi.closeSelf();
  });

  // Double-click → trigger reminder manually (fun affordance)
  document.body.addEventListener('dblclick', () => {
    window.catApi.triggerReminder();
  });
}

// ---------- Wandering ----------

function scheduleNextAction(extraDelay = 0) {
  clearTimeout(walkTimer);
  const idle = 1500 + Math.random() * 4500 + extraDelay;
  walkTimer = setTimeout(() => {
    const profile = cat.behaviorProfile || {};
    const walkChance = Number.isFinite(profile.walkChance) ? profile.walkChance : 0.55;
    const restChance = Number.isFinite(profile.restChance) ? profile.restChance : 0.2;
    const roll = Math.random();
    if (roll < walkChance) startWalk();
    else if (roll < walkChance + restChance) doNap();
    else doBehaviorAction();
  }, idle);
}

async function startWalk() {
  const b = await window.catApi.bounds();
  if (!b) return;
  const { workArea } = b;

  // Pick a target inside the work area, biased to stay on screen
  const targetX =
    workArea.x +
    Math.max(0, Math.min(workArea.width - b.w, Math.random() * (workArea.width - b.w)));
  const targetY =
    workArea.y +
    workArea.height -
    b.h -
    20 -
    Math.random() * Math.min(180, workArea.height * 0.4);

  const dx = targetX - b.x;
  const dy = targetY - b.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 8) {
    scheduleNextAction();
    return;
  }
  const speed = 1.4; // px per frame
  const steps = Math.max(20, Math.round(dist / speed));
  walkVx = dx / steps;
  walkVy = dy / steps;
  flip(walkVx < 0);
  setPose('walk');
  walking = true;

  let i = 0;
  const tick = () => {
    if (!walking) return;
    if (i >= steps) {
      walking = false;
      setPose('idle');
      scheduleNextAction();
      return;
    }
    window.catApi.moveBy(walkVx, walkVy);
    i++;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function stopWalking() {
  walking = false;
}

function doSit() {
  setPose('idle');
  scheduleNextAction(2000);
}

function doNap() {
  clearTimeout(actionTimeout);
  runSleepSequence();
}

function pickWeightedAction(actions) {
  if (!Array.isArray(actions) || actions.length === 0) return null;
  let total = 0;
  for (const a of actions) total += Math.max(0, Number(a.weight) || 1);
  if (!total) return null;
  let roll = Math.random() * total;
  for (const a of actions) {
    roll -= Math.max(0, Number(a.weight) || 1);
    if (roll <= 0) return a;
  }
  return actions[0];
}

function between(min, max, fallback) {
  const lo = Number.isFinite(min) ? min : fallback;
  const hi = Number.isFinite(max) ? max : lo;
  if (hi <= lo) return lo;
  return lo + Math.random() * (hi - lo);
}

function doBehaviorAction() {
  const profile = cat.behaviorProfile || {};
  const action = pickWeightedAction(profile.actions);
  if (!action || !action.pose || !cat.poses[action.pose]) {
    doSit();
    return;
  }
  clearTimeout(actionTimeout);
  if (action.pose === 'sleep') {
    runSleepSequence();
    return;
  }
  setPose(action.pose);
  const firstMs = between(action.minMs, action.maxMs, 3200);
  actionTimeout = setTimeout(() => {
    if (action.thenPose && cat.poses[action.thenPose]) {
      setPose(action.thenPose);
      const secondMs = between(action.thenMinMs, action.thenMaxMs, 2500);
      actionTimeout = setTimeout(() => {
        setPose('idle');
        scheduleNextAction();
      }, secondMs);
      return;
    }
    setPose('idle');
    scheduleNextAction();
  }, firstMs);
}

function runSleepSequence() {
  const sequence = cat.behaviorProfile && cat.behaviorProfile.sleepSequence;
  const poses =
    sequence && Array.isArray(sequence.poses)
      ? sequence.poses.filter((pose) => cat.poses[pose])
      : ['sleep'].filter((pose) => cat.poses[pose]);
  if (!poses.length) {
    doSit();
    return;
  }

  const totalMs = Math.max(1000, Number(sequence && sequence.totalMs) || 3 * 60 * 60 * 1000);
  const intervalMs = Math.max(1000, Number(sequence && sequence.intervalMs) || 60 * 60 * 1000);
  const startedAt = Date.now();

  const showNext = (index) => {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= totalMs) {
      setPose('idle');
      scheduleNextAction();
      return;
    }
    setPose(poses[index % poses.length]);
    actionTimeout = setTimeout(() => showNext(index + 1), Math.min(intervalMs, totalMs - elapsed));
  };

  showNext(0);
}

init();
