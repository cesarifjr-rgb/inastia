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

export const villaFallback = `<svg class="scene-fallback" viewBox="0 0 800 690" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="villa-ground" x1="180" y1="300" x2="630" y2="630" gradientUnits="userSpaceOnUse"><stop stop-color="#4d625a"/><stop offset="1" stop-color="#223c34"/></linearGradient><linearGradient id="villa-pool" x1="340" y1="440" x2="530" y2="540" gradientUnits="userSpaceOnUse"><stop stop-color="#9ceccf"/><stop offset="1" stop-color="#329c85"/></linearGradient><linearGradient id="villa-glass" x1="340" y1="250" x2="580" y2="400" gradientUnits="userSpaceOnUse"><stop stop-color="#25473e"/><stop offset="1" stop-color="#0d2721"/></linearGradient><filter id="villa-shadow"><feGaussianBlur stdDeviation="18"/></filter></defs>
<ellipse cx="414" cy="548" rx="264" ry="75" fill="#020d08" opacity=".5" filter="url(#villa-shadow)"/>
<path d="m83 427 301-172 338 190-302 176z" fill="#182e27"/><path d="m83 411 301-172 338 190-302 176z" fill="url(#villa-ground)"/><path d="M83 411v16l337 194v-16M420 605l302-176v16L420 621" stroke="#6f8878" stroke-opacity=".4"/>
<path d="m204 376 197-115 238 137-199 116z" fill="#c4c1ac"/><path d="m228 374 174-100 212 121-175 102z" fill="#e0ddc8"/>
<path d="m285 341 137-80 164 94-137 81z" fill="#e7e2cf"/><path d="M285 341v-117l164 94v118z" fill="#c5c1ae"/><path d="m449 318 137-79v116l-137 81z" fill="#ece8d6"/><path d="m285 224 137-80 164 95-137 79z" fill="#f6f0dc"/>
<path d="m306 259 116 67v79l-116-66z" fill="url(#villa-glass)"/><path d="m466 330 99-57v71l-99 58z" fill="url(#villa-glass)"/>
<path d="M345 282v79m37-58v79m39-57v79m82-96v72m32-90v71" stroke="#c9c6b4" stroke-width="3"/>
<path d="m259 242 25-15 170 98 151-88 29 17-177 103z" fill="#a89166"/><path d="M259 242v9l198 115v-9m0 9 177-103v-9" stroke="#6e7154" stroke-width="3"/>
<path d="M262 248v139m194-29v137m176-238v141" stroke="#bdc1a7" stroke-width="5"/>
<path d="m271 428 98-56 196 113-98 57z" fill="#e1d9c3"/><path d="m284 428 85-49 183 106-85 50z" fill="url(#villa-pool)"/>
<path d="m310 431 61-35m-35 50 60-35m-34 50 60-35m-35 50 60-35m-35 50 60-35m-34 50 60-35" stroke="#d4ffe7" stroke-opacity=".35" stroke-width="2"/>
<path d="m499 449 37-21 27 16-37 21zM542 474l37-21 27 16-37 21z" fill="#ece5d2"/>
<g stroke="#7c9478" stroke-width="5"><path d="M175 384V271M650 396V278M224 313V234"/></g>
<g fill="#59745a"><path d="m175 205-44 105 44 25 43-25z"/><path d="m650 211-44 105 44 25 43-25z"/><path d="m224 180-33 77 33 19 32-19z"/></g><g fill="#7e9a70"><path d="m175 205 43 105-43-24zM650 211l43 105-43-24zM224 180l32 77-32-18z"/></g>
<path d="m167 454 30-17 33 18-30 18zM583 530l32-19 27 16-32 19z" fill="#6e8c64"/>
</svg>`;
