/**
 * Java — Russian Blue.
 * Solid gray, black nose, ROUND green eyes (not slanted), small paws,
 * triangular wide-bodied silhouette (small head, wide hips), ~13.5 lbs.
 */

const SVG_DEFS = `
<defs>
  <linearGradient id="java-fur" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#8e9aa6"/>
    <stop offset="60%" stop-color="#6f7c89"/>
    <stop offset="100%" stop-color="#4f5a66"/>
  </linearGradient>
  <radialGradient id="java-eye" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#d8f0b6"/>
    <stop offset="55%" stop-color="#8fbe5d"/>
    <stop offset="100%" stop-color="#3f5e23"/>
  </radialGradient>
  <linearGradient id="java-belly" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#a3aeb8"/>
    <stop offset="100%" stop-color="#7c8794"/>
  </linearGradient>
</defs>
`;

const ears = `
<!-- Ears positioned close together because head is small -->
<path d="M58 38 L52 16 L74 30 Z" fill="url(#java-fur)" stroke="#475260" stroke-width="0.8"/>
<path d="M60 36 L56 24 L70 32 Z" fill="#3a3a40"/>
<path d="M88 38 L96 16 L74 30 Z" fill="url(#java-fur)" stroke="#475260" stroke-width="0.8"/>
<path d="M86 36 L90 24 L78 32 Z" fill="#3a3a40"/>
`;

// Java's head is small, sits on top of a wide triangle body
const head = `
<ellipse cx="73" cy="54" rx="22" ry="20" fill="url(#java-fur)" stroke="#475260" stroke-width="0.8"/>
`;

const face = (eyeState = 'open') => {
  const eyes =
    eyeState === 'closed'
      ? `
        <path d="M62 55 q3 2 6 0" stroke="#1c2026" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M78 55 q3 2 6 0" stroke="#1c2026" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      `
      : eyeState === 'wide'
      ? `
        <circle cx="65" cy="55" r="6" fill="url(#java-eye)"/>
        <circle cx="81" cy="55" r="6" fill="url(#java-eye)"/>
        <ellipse cx="65" cy="55" rx="1.6" ry="3.5" fill="#101216"/>
        <ellipse cx="81" cy="55" rx="1.6" ry="3.5" fill="#101216"/>
        <circle cx="67" cy="53" r="1.1" fill="#fff"/>
        <circle cx="83" cy="53" r="1.1" fill="#fff"/>
      `
      : `
        <circle cx="65" cy="55" r="5" fill="url(#java-eye)"/>
        <circle cx="81" cy="55" r="5" fill="url(#java-eye)"/>
        <ellipse cx="65" cy="55" rx="1.4" ry="3" fill="#101216"/>
        <ellipse cx="81" cy="55" rx="1.4" ry="3" fill="#101216"/>
        <circle cx="66" cy="53" r="1" fill="#fff"/>
        <circle cx="82" cy="53" r="1" fill="#fff"/>
      `;
  return `
    ${eyes}
    <!-- Black nose -->
    <path d="M70 65 L76 65 L73 69 Z" fill="#0f1115"/>
    <!-- Mouth -->
    <path d="M73 69 Q73 73 70 74" stroke="#2a2e36" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M73 69 Q73 73 76 74" stroke="#2a2e36" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <!-- Whiskers -->
    <path d="M58 66 L42 64 M58 69 L42 72 M88 66 L104 64 M88 69 L104 72"
          stroke="#cfd6dc" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>
  `;
};

// Triangular wide body silhouette (narrow shoulders, wide hips)
const triBody = `
<path d="M52 88 Q73 78 94 88 L120 132 Q73 140 26 132 Z"
      fill="url(#java-fur)" stroke="#475260" stroke-width="1"/>
<!-- Lighter belly oval -->
<ellipse cx="73" cy="120" rx="36" ry="12" fill="url(#java-belly)" opacity="0.7"/>
`;

const smallPaws = `
<!-- Small paws -->
<ellipse cx="48" cy="135" rx="6" ry="4" fill="url(#java-fur)" stroke="#475260" stroke-width="0.6"/>
<ellipse cx="98" cy="135" rx="6" ry="4" fill="url(#java-fur)" stroke="#475260" stroke-width="0.6"/>
`;

// Tail trailing behind
const tail = `
<path d="M118 124 Q150 118 148 96 Q142 90 134 100 Q134 116 118 122 Z"
      fill="url(#java-fur)" stroke="#475260" stroke-width="0.8"/>
`;

const idle = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 150" width="160" height="150">
  ${SVG_DEFS}
  ${tail}
  ${triBody}
  ${ears}
  ${head}
  ${face('open')}
  ${smallPaws}
</svg>
`;

const walk = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 150" width="160" height="150">
  ${SVG_DEFS}
  ${tail}
  ${triBody}
  ${ears}
  ${head}
  ${face('open')}
  <!-- Staggered walking paws -->
  <ellipse cx="46" cy="133" rx="6" ry="4" fill="url(#java-fur)" stroke="#475260" stroke-width="0.6"/>
  <ellipse cx="100" cy="138" rx="6" ry="4" fill="url(#java-fur)" stroke="#475260" stroke-width="0.6"/>
</svg>
`;

const sleep = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="160" height="140">
  ${SVG_DEFS}
  <!-- Curled body — loaf with eyes shut -->
  <path d="M28 100 Q28 70 80 60 Q140 60 140 110 Q140 128 80 128 Q28 128 28 100 Z"
        fill="url(#java-fur)" stroke="#475260" stroke-width="1"/>
  <!-- Belly highlight -->
  <ellipse cx="84" cy="116" rx="48" ry="10" fill="url(#java-belly)" opacity="0.5"/>
  <!-- Tail curled around -->
  <path d="M28 100 Q12 92 16 76 Q22 68 30 76 Q26 92 34 100 Z"
        fill="url(#java-fur)" stroke="#475260" stroke-width="0.8"/>
  <!-- Small head tucked in -->
  <ellipse cx="50" cy="92" rx="18" ry="14" fill="url(#java-fur)" stroke="#475260" stroke-width="0.8"/>
  <!-- Ear -->
  <path d="M40 82 L36 70 L50 80 Z" fill="url(#java-fur)" stroke="#475260" stroke-width="0.6"/>
  <path d="M42 80 L40 74 L48 80 Z" fill="#3a3a40"/>
  <!-- Closed eye -->
  <path d="M46 92 q3 2 6 0" stroke="#1c2026" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <!-- Black nose -->
  <circle cx="34" cy="95" r="1.6" fill="#0f1115"/>
  <text x="118" y="50" font-family="ui-sans-serif" font-size="14" fill="#6f7c89" opacity="0.9">Z</text>
  <text x="130" y="42" font-family="ui-sans-serif" font-size="10" fill="#6f7c89" opacity="0.8">z</text>
</svg>
`;

const alert = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  ${SVG_DEFS}
  ${tail}
  ${triBody}
  ${ears}
  ${head}
  ${face('wide')}
  <!-- Tongue blep, like the photo -->
  <path d="M71 73 Q73 78 75 73 Z" fill="#f49bb0"/>
  ${smallPaws}
</svg>
`;

module.exports = {
  id: 'java',
  name: 'Java',
  species: '俄罗斯蓝猫 / Russian Blue',
  description: '黑鼻子、圆眼睛、小爪子，腰身宽呈三角形，眼神时而瞪圆时而眯起。',
  weightKg: 13.5 * 0.4536,
  accentColor: '#7c8794',
  defaultSize: { width: 160, height: 150 },
  poses: { idle, walk, sleep, alert },
};
