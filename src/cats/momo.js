/**
 * 馍馍 — Ragdoll cat.
 * Blue eyes, pink nose, big fluffy paws, cream body with brown/dark patches
 * shaped like wings on the back, brown stripe down the tail.
 */

const SVG_DEFS = `
<defs>
  <radialGradient id="momo-eye" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#bfe3ff"/>
    <stop offset="60%" stop-color="#5fa8d8"/>
    <stop offset="100%" stop-color="#1d4f7a"/>
  </radialGradient>
  <linearGradient id="momo-fur" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fffaf2"/>
    <stop offset="100%" stop-color="#f1e6d4"/>
  </linearGradient>
  <linearGradient id="momo-patch" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#5b3a26"/>
    <stop offset="100%" stop-color="#3d2618"/>
  </linearGradient>
  <linearGradient id="momo-tail" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"  stop-color="#fffaf2"/>
    <stop offset="55%" stop-color="#c9a079"/>
    <stop offset="100%" stop-color="#8a5a35"/>
  </linearGradient>
</defs>
`;

const headBack = `
<!-- Calico patch behind right ear (wing-like) -->
<path d="M64 36 Q56 22 42 28 Q40 42 56 50 Z" fill="url(#momo-patch)"/>
<!-- Small orange-cream patch above forehead -->
<path d="M82 28 Q90 24 96 32 Q92 40 84 38 Z" fill="#e9b478" opacity="0.85"/>
`;

const ears = `
<!-- Left ear -->
<path d="M48 38 L42 14 L66 30 Z" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
<path d="M50 36 L46 22 L60 32 Z" fill="#f5b9b9"/>
<!-- Right ear -->
<path d="M104 38 L114 14 L92 30 Z" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
<path d="M102 36 L108 22 L96 32 Z" fill="#f5b9b9"/>
`;

const head = `
<!-- Head shape -->
<ellipse cx="76" cy="56" rx="34" ry="30" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
<!-- Brown patch around left eye/cheek (the wing-like marking from photo) -->
<path d="M52 50 Q44 58 50 70 Q58 76 66 70 Q66 58 60 50 Z" fill="url(#momo-patch)" opacity="0.9"/>
`;

const face = (eyeState = 'open') => {
  const eyes =
    eyeState === 'closed'
      ? `
        <path d="M62 58 q4 4 8 0" stroke="#3d2618" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M84 58 q4 4 8 0" stroke="#3d2618" stroke-width="2" fill="none" stroke-linecap="round"/>
      `
      : `
        <ellipse cx="66" cy="58" rx="6" ry="7" fill="url(#momo-eye)"/>
        <ellipse cx="88" cy="58" rx="6" ry="7" fill="url(#momo-eye)"/>
        <circle cx="66" cy="59" r="1.6" fill="#0a1d2e"/>
        <circle cx="88" cy="59" r="1.6" fill="#0a1d2e"/>
        <circle cx="68" cy="56" r="1" fill="#fff" opacity="0.9"/>
        <circle cx="90" cy="56" r="1" fill="#fff" opacity="0.9"/>
      `;
  return `
    ${eyes}
    <!-- Pink nose -->
    <path d="M73 70 L79 70 L76 75 Z" fill="#f49bb0"/>
    <!-- Mouth -->
    <path d="M76 75 Q76 80 72 81" stroke="#7a5a48" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M76 75 Q76 80 80 81" stroke="#7a5a48" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <!-- Whiskers -->
    <path d="M58 72 L40 70 M58 75 L40 78 M94 72 L112 70 M94 75 L112 78"
          stroke="#c8b89a" stroke-width="0.9" stroke-linecap="round" opacity="0.85"/>
  `;
};

const bigPaws = `
<!-- Big fluffy front paws -->
<ellipse cx="58" cy="120" rx="11" ry="7" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1"/>
<ellipse cx="94" cy="120" rx="11" ry="7" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1"/>
<circle cx="55" cy="120" r="1.2" fill="#cdb190"/>
<circle cx="60" cy="120" r="1.2" fill="#cdb190"/>
<circle cx="91" cy="120" r="1.2" fill="#cdb190"/>
<circle cx="96" cy="120" r="1.2" fill="#cdb190"/>
`;

const idle = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="160" height="140">
  ${SVG_DEFS}
  <!-- Tail with brown stripe -->
  <path d="M118 110 Q150 90 144 60 Q140 50 130 56 Q132 80 118 100 Z"
        fill="url(#momo-tail)" stroke="#a07b54" stroke-width="0.8"/>
  <!-- Body (round and fluffy) -->
  <ellipse cx="76" cy="105" rx="38" ry="22" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
  <!-- Wing-shaped patch on back (left side) -->
  <path d="M50 92 Q44 100 56 110 Q66 104 60 92 Z" fill="url(#momo-patch)" opacity="0.9"/>
  <!-- Wing-shaped patch on back (right side, smaller) -->
  <path d="M96 96 Q104 102 100 112 Q92 110 92 100 Z" fill="url(#momo-patch)" opacity="0.85"/>
  ${headBack}
  ${ears}
  ${head}
  ${face('open')}
  ${bigPaws}
</svg>
`;

const walk = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="160" height="140">
  ${SVG_DEFS}
  <path d="M118 108 Q152 86 142 56 Q136 48 128 56 Q132 80 118 100 Z"
        fill="url(#momo-tail)" stroke="#a07b54" stroke-width="0.8"/>
  <ellipse cx="76" cy="103" rx="40" ry="20" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
  <path d="M48 90 Q42 100 56 110 Q66 104 60 90 Z" fill="url(#momo-patch)" opacity="0.9"/>
  <path d="M98 94 Q108 100 102 112 Q94 108 94 98 Z" fill="url(#momo-patch)" opacity="0.85"/>
  ${headBack}
  ${ears}
  ${head}
  ${face('open')}
  <!-- Walking paws — staggered -->
  <ellipse cx="56" cy="118" rx="10" ry="6" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1"/>
  <ellipse cx="98" cy="124" rx="10" ry="6" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1"/>
</svg>
`;

const sleep = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="160" height="140">
  ${SVG_DEFS}
  <!-- Curled body -->
  <path d="M30 110 Q30 70 80 60 Q140 60 140 110 Q140 130 80 130 Q30 130 30 110 Z"
        fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
  <!-- Wing patches visible on curled back -->
  <path d="M72 70 Q60 76 70 90 Q86 86 84 72 Z" fill="url(#momo-patch)" opacity="0.85"/>
  <path d="M102 70 Q116 76 108 90 Q94 86 96 72 Z" fill="url(#momo-patch)" opacity="0.8"/>
  <!-- Tail wrapped around -->
  <path d="M28 110 Q12 100 18 80 Q24 70 32 78 Q26 96 36 108 Z"
        fill="url(#momo-tail)" stroke="#a07b54" stroke-width="0.8"/>
  <!-- Tucked head with closed eyes -->
  <ellipse cx="50" cy="100" rx="22" ry="18" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
  <!-- Ear -->
  <path d="M38 90 L34 76 L48 86 Z" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1"/>
  <path d="M40 88 L38 80 L46 86 Z" fill="#f5b9b9"/>
  <!-- Closed eye -->
  <path d="M44 100 q3 3 6 0" stroke="#3d2618" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Pink nose tip -->
  <circle cx="32" cy="103" r="2" fill="#f49bb0"/>
  <!-- Zzz -->
  <text x="120" y="50" font-family="ui-sans-serif" font-size="14" fill="#9f8466" opacity="0.85">Z</text>
  <text x="132" y="42" font-family="ui-sans-serif" font-size="10" fill="#9f8466" opacity="0.75">z</text>
</svg>
`;

const alert = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  ${SVG_DEFS}
  <path d="M118 118 Q156 96 146 60 Q138 50 128 58 Q132 86 118 110 Z"
        fill="url(#momo-tail)" stroke="#a07b54" stroke-width="0.8"/>
  <ellipse cx="76" cy="118" rx="40" ry="22" fill="url(#momo-fur)" stroke="#d9c4a3" stroke-width="1.2"/>
  <path d="M50 102 Q42 112 58 122 Q70 116 62 102 Z" fill="url(#momo-patch)" opacity="0.9"/>
  <path d="M96 106 Q108 112 102 124 Q92 120 92 110 Z" fill="url(#momo-patch)" opacity="0.85"/>
  ${headBack}
  ${ears}
  ${head}
  <!-- Wide alert eyes -->
  <ellipse cx="66" cy="58" rx="7" ry="8" fill="url(#momo-eye)"/>
  <ellipse cx="88" cy="58" rx="7" ry="8" fill="url(#momo-eye)"/>
  <circle cx="66" cy="60" r="1.4" fill="#0a1d2e"/>
  <circle cx="88" cy="60" r="1.4" fill="#0a1d2e"/>
  <circle cx="68" cy="55" r="1.4" fill="#fff"/>
  <circle cx="90" cy="55" r="1.4" fill="#fff"/>
  <path d="M73 70 L79 70 L76 75 Z" fill="#f49bb0"/>
  <path d="M76 75 Q76 80 72 81" stroke="#7a5a48" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M76 75 Q76 80 80 81" stroke="#7a5a48" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  ${bigPaws}
</svg>
`;

module.exports = {
  id: 'momo',
  name: '馍馍',
  species: '布偶猫 / Ragdoll',
  description: '蓝眼睛、粉鼻子、大爪子，背上有翅膀状的色块,尾巴有浅棕色条纹。',
  weightKg: 8.4,
  accentColor: '#5fa8d8',
  defaultSize: { width: 160, height: 140 },
  poses: { idle, walk, sleep, alert },
};
