/**
 * Java - photo-based semi-realistic assets.
 *
 * These PNGs are extracted from real reference photos with transparent
 * backgrounds, then animated by the renderer.
 */

const pose = (file, label) => `
<img
  class="pet-pose"
  src="../../assets/cats/java/${file}"
  alt="Java ${label}"
  draggable="false"
/>
`;

const HOUR = 60 * 60 * 1000;

module.exports = {
  id: 'java',
  name: 'Java',
  species: '法国蓝猫 / Blue-gray short hair',
  description: '真实照片抠图资产：头小身宽、黑鼻子、圆眼、小爪子和下垂肚皮更接近本体。',
  weightKg: 13.5 * 0.4536,
  accentColor: '#7e8995',
  defaultSize: { width: 220, height: 190 },
  poses: {
    idle: pose('java_idle.png', 'idle'),
    walk: pose('java_walk.png', 'walk'),
    sleep: pose('java_sleep.png', 'sleep'),
    alert: pose('java_alert.png', 'alert'),
    bellyUp: pose('java_idle_lie.png', 'belly up'),
    sitLegUp: pose('java_sitLegUp.png', 'sit leg up'),
    groom: pose('java_groom.png', 'groom'),
  },
  behaviorProfile: {
    walkChance: 0.42,
    restChance: 0.18,
    sleepSequence: {
      poses: ['sleep', 'bellyUp', 'sitLegUp'],
      intervalMs: HOUR,
      totalMs: 3 * HOUR,
    },
    actions: [
      { pose: 'bellyUp', weight: 4, minMs: 6500, maxMs: 9800 },
      {
        pose: 'sitLegUp',
        weight: 3,
        minMs: 3500,
        maxMs: 5200,
        thenPose: 'groom',
        thenMinMs: 2200,
        thenMaxMs: 3600,
      },
      { pose: 'groom', weight: 2, minMs: 2800, maxMs: 4200 },
      { pose: 'sleep', weight: 2 },
    ],
  },
};
