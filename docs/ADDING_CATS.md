# Add a New Cat

Each cat is a JS module under `src/cats/<id>.js` plus a folder of PNG pose assets under `src/assets/cats/<id>/`.

## 1. Add Pose Assets

Create:

```text
src/assets/cats/<cat-id>/
```

Recommended pose filenames:

```text
<cat-id>_idle.png
<cat-id>_walk.png
<cat-id>_sleep.png
<cat-id>_alert.png
```

You can add extra poses such as:

```text
<cat-id>_roll.png
<cat-id>_stretch.png
<cat-id>_groom.png
```

PNG assets should be around `800-1200px` on the longest side. Transparent background is preferred, but a small amount of background is okay if it keeps the cat body intact.

See [`ASSETS.md`](ASSETS.md) for the full asset guide.

## 2. Create the Cat Definition

Copy an existing cat:

```bash
cp src/cats/momo.js src/cats/biscuit.js
```

Example structure:

```js
const pose = (file, label) => `
<img
  class="pet-pose"
  src="../../assets/cats/biscuit/${file}"
  alt="Biscuit ${label}"
  draggable="false"
/>
`;

const HOUR = 60 * 60 * 1000;

module.exports = {
  id: 'biscuit',
  name: 'Biscuit',
  species: 'British Shorthair',
  description: '一句话外形描述',
  weightKg: 4.5,
  accentColor: '#c08a5a',
  defaultSize: { width: 160, height: 140 },
  poses: {
    idle: pose('biscuit_idle.png', 'idle'),
    walk: pose('biscuit_walk.png', 'walk'),
    sleep: pose('biscuit_sleep.png', 'sleep'),
    alert: pose('biscuit_alert.png', 'alert'),
  },
  behaviorProfile: {
    walkChance: 0.45,
    restChance: 0.15,
    sleepSequence: {
      poses: ['sleep'],
      intervalMs: HOUR,
      totalMs: 3 * HOUR,
    },
    actions: [
      { pose: 'sleep', weight: 2 },
    ],
  },
};
```

## 3. Register It

Edit `src/cats/index.js`:

```js
const momo = require('./momo');
const java = require('./java');
const biscuit = require('./biscuit');

register(momo);
register(java);
register(biscuit);
```

Restart the app. The new cat will appear in Settings and the Dock menu.

## Behavior Notes

- `walkChance`: probability of walking when choosing a random action.
- `restChance`: probability of entering the sleep sequence.
- `sleepSequence.totalMs`: total sleep duration.
- `sleepSequence.intervalMs`: how often to rotate sleep poses.
- `actions`: weighted list of other random poses.
- `thenPose`: optional chained pose after the first action.

## Updating Existing Cats

You can replace a pose by overwriting the corresponding PNG in `src/assets/cats/<cat-id>/`.
Keep the same `id`; changing it breaks existing user settings.

## Release Flow

```bash
npm install
npm start
npm run dist:mac:local
```

Share the `.dmg` from `dist/`.
