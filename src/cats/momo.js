/**
 * Momo - photo-based semi-realistic assets.
 *
 * These PNGs are extracted from real reference photos with transparent
 * backgrounds, then animated by the renderer.
 */

const pose = (file, label) => `
<img
  class="pet-pose"
  src="../../assets/cats/momo/${file}"
  alt="Momo ${label}"
  draggable="false"
/>
`;

const HOUR = 60 * 60 * 1000;

module.exports = {
  id: 'momo',
  name: '馍馍',
  species: '布偶猫 / Ragdoll',
  description: '真实照片抠图资产：蓝眼粉鼻、大爪子、长身体，保留背部色块和布偶毛感。',
  weightKg: 4.2,
  accentColor: '#68aeda',
  defaultSize: { width: 230, height: 190 },
  poses: {
    idle: pose('momo_idle.png', 'idle'),
    walk: pose('momo_walk.png', 'walk'),
    sleep: pose('momo_sleep.png', 'sleep'),
    alert: pose('momo_alert.png', 'alert'),
    stretch: pose('momo_stretch.png', 'stretch'),
    sideLie: pose('momo_sideLie.png', 'side lie'),
    roll: pose('momo_roll.png', 'roll'),
    reachUp: pose('momo_reachUp.png', 'reach up'),
  },
  behaviorProfile: {
    walkChance: 0.48,
    restChance: 0.12,
    sleepSequence: {
      poses: ['sleep', 'sideLie', 'roll'],
      intervalMs: HOUR,
      totalMs: 3 * HOUR,
    },
    actions: [
      { pose: 'stretch', weight: 4, minMs: 4200, maxMs: 7200 },
      { pose: 'sideLie', weight: 3, minMs: 4600, maxMs: 7600 },
      { pose: 'roll', weight: 3, minMs: 3600, maxMs: 6200 },
      { pose: 'reachUp', weight: 2, minMs: 3200, maxMs: 5200 },
      { pose: 'sleep', weight: 2 },
    ],
  },
};
