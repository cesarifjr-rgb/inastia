export const houseIcon = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m7 23 17-14 17 14M12 20v20h24V20M21 40V28h8v12" stroke="currentColor" stroke-width="1.5"/></svg>`;

export const contours = `<svg class="contours" viewBox="0 0 1200 700" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<path d="M${-100 + i * 18} 720C${-70 + i * 38} ${270 - i * 9},${310 + i * 17} ${650 - i * 31},${390 + i * 19} ${230 - i * 14}S${800 + i * 40} ${180 - i * 13},${1250 + i * 12} ${-110 + i * 30}" stroke="currentColor" stroke-width="1"/>`).join("")}</svg>`;

export function serviceArt(index: number): string {
  const shapes = [
    `<div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="art-core">${houseIcon}</div><span class="art-dot dot-one"></span><span class="art-dot dot-two"></span><span class="art-dot dot-three"></span>`,
    `<div class="art-listing listing-back"></div><div class="art-listing listing-front"><span class="listing-photo">${houseIcon}</span><span class="listing-line"></span><span class="listing-line short"></span><span class="listing-check">✓</span></div>`,
    `<div class="art-key-ring"></div><div class="art-key-stem"></div><div class="art-key-tooth tooth-one"></div><div class="art-key-tooth tooth-two"></div><span class="art-key-spark">✳</span>`,
  ];
  return `<div class="service-art service-art-${index + 1}" aria-hidden="true">${shapes[index] ?? shapes[0]}</div>`;
}

export const coastFallback = `<svg class="scene-fallback" viewBox="0 0 800 690" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="coast-sky" x1="400" y1="122" x2="400" y2="530" gradientUnits="userSpaceOnUse"><stop stop-color="#c9e4f0"/><stop offset="1" stop-color="#a7cede"/></linearGradient><linearGradient id="coast-sand" x1="300" y1="435" x2="400" y2="585" gradientUnits="userSpaceOnUse"><stop stop-color="#e9cf9f"/><stop offset="1" stop-color="#f4e6c7"/></linearGradient><clipPath id="coast-outline"><ellipse cx="400" cy="340" rx="276" ry="209"/></clipPath><filter id="coast-shadow"><feGaussianBlur stdDeviation="14"/></filter></defs>
<ellipse cx="411" cy="562" rx="235" ry="28" fill="#557b8b" opacity=".13" filter="url(#coast-shadow)"/>
<ellipse cx="404" cy="350" rx="288" ry="219" fill="#cdbd9e"/>
<ellipse cx="400" cy="340" rx="285" ry="218" fill="#f5e9d0"/>
<g clip-path="url(#coast-outline)"><path d="M115 110h575v480H115z" fill="url(#coast-sky)"/><circle cx="489" cy="237" r="62" fill="#edc77d"/><path d="M110 327C295 324 430 340 691 328V580H110Z" fill="#8dc3d9"/><path d="M100 377C237 418 376 334 696 392V590H100Z" fill="#65a9c7"/><path d="M107 437C330 443 336 342 699 440V598H107Z" fill="#368bb2"/><path d="M110 466C295 480 414 394 529 426S680 478 695 479V600H110Z" fill="#d0e8e6"/><path d="M110 476C295 490 414 404 529 436S680 488 695 489V600H110Z" fill="url(#coast-sand)"/><path d="M110 502C275 446 369 516 515 526S680 483 695 490V610H110Z" fill="#f4e5c5"/></g>
</svg>`;
