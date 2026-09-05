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

export function hospitalityArt(locale: "fr" | "en"): string {
  const french = locale === "fr";
  return `<svg class="hospitality-illustration" viewBox="0 0 800 690" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <clipPath id="welcome-arch"><path d="M207 548V296a192 192 0 0 1 384 0v252Z"/></clipPath>
</defs>
<path d="M190 551V292a209 209 0 0 1 418 0v259" stroke="#9bbdcd" stroke-width="1"/>
<path d="M207 548V296a192 192 0 0 1 384 0v252Z" fill="#d6e9f0"/>
<g clip-path="url(#welcome-arch)">
  <circle cx="509" cy="224" r="53" fill="#efd8a6"/>
  <path d="M178 437C320 416 425 462 619 420V563H178Z" fill="#bedde8"/>
  <path d="M178 501C333 447 436 535 619 475V565H178Z" fill="#c6e0e9"/>
  <g class="hospitality-motion welcome-tide" stroke="#7fadc1" stroke-width="1.1">
    <path d="M160 469C260 431 349 492 461 462S601 449 660 457"/>
    <path d="M143 491C251 453 355 514 460 484S603 471 661 479"/>
    <path d="M130 513C256 475 356 536 461 506S609 493 666 501"/>
  </g>
</g>
<path d="M156 562H638" stroke="#a2bfc8" stroke-width="1"/>
<path d="M154 342C94 249 200 159 279 177" stroke="#9ab8c3" stroke-width="1.2" stroke-dasharray="3 7"/>
<path d="m267 171 15 7-11 11" stroke="#6c97aa" stroke-width="1.4"/>
<g class="hospitality-motion welcome-fob">
  <g transform="rotate(-12 370 322)">
    <path d="M284 198q0-18 18-26l46-25q17-9 34 0l46 25q18 8 18 26v286q0 23-23 23H307q-23 0-23-23Z" fill="#a0b3b8" opacity=".13" transform="translate(8 10)"/>
    <path d="M284 198q0-18 18-26l46-25q17-9 34 0l46 25q18 8 18 26v286q0 23-23 23H307q-23 0-23-23Z" fill="#fffaf1" stroke="#b9b5a5" stroke-width="1.5"/>
    <path d="M297 205q0-13 13-20l45-24q10-5 20 0l45 24q13 7 13 20v275q0 14-14 14H311q-14 0-14-14Z" stroke="#d8cfbd" stroke-width="1"/>
    <circle cx="365" cy="194" r="11" fill="#d6e9f0" stroke="#b7b4a4" stroke-width="1.5"/>
    <text x="365" y="251" text-anchor="middle" fill="#587482" font-family="Manrope,Arial,sans-serif" font-size="10" letter-spacing="2.5">${french ? "BIENVENUE" : "WELCOME"}</text>
    <path d="M327 311a38 38 0 0 1 76 0v61h-76Z" stroke="#89adbb" stroke-width="1"/>
    <text x="365" y="353" text-anchor="middle" fill="#1c6285" font-family="Space,Arial,sans-serif" font-size="61" letter-spacing="-5">i.</text>
    <text x="365" y="413" text-anchor="middle" fill="#17455b" font-family="Space,Arial,sans-serif" font-size="21" font-weight="500" letter-spacing="4">INASTIA</text>
    <path d="M346 434h38" stroke="#c5a368" stroke-width="1.5"/>
    <text x="365" y="461" text-anchor="middle" fill="#587482" font-family="Manrope,Arial,sans-serif" font-size="9" letter-spacing="3">${french ? "CORSE" : "CORSICA"}</text>
  </g>
</g>
<g class="hospitality-motion welcome-key">
  <g transform="rotate(-12 471 231)">
    <path d="M446 288h46v174l-16 15-16-15v-24h-21v-20h21v-19h-21v-20h21v-91Z" fill="#bb9a5d" opacity=".1" transform="translate(5 7)"/>
    <path d="M460 279h25v181l-13 13-12-13v-25h-21v-18h21v-20h-21v-18h21Z" fill="#e5bf7c" stroke="#b89558" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M473 300v150" stroke="#f9e8be" stroke-width="2"/>
    <circle cx="472" cy="240" r="50" fill="#e5bf7c" stroke="#b89558" stroke-width="1.5"/>
    <circle cx="472" cy="240" r="31" fill="#d6e9f0" stroke="#c5a064" stroke-width="1.5"/>
    <path d="M435 238a37 37 0 0 1 68-18" stroke="#f8e7bc" stroke-width="2" stroke-linecap="round"/>
  </g>
</g>
<path d="M336 204C318 141 354 101 407 115s69 59 62 95" stroke="#a98d5d" stroke-width="5" stroke-linecap="round"/>
<path d="M336 204C318 141 354 101 407 115s69 59 62 95" stroke="#f1dbac" stroke-width="2" stroke-linecap="round"/>
<g transform="rotate(5 578 423)">
  <rect x="522" y="377" width="153" height="93" rx="5" fill="#9db8c0" opacity=".11" transform="translate(3 5)"/>
  <rect x="522" y="377" width="153" height="93" rx="5" fill="#fffaf3" stroke="#c5d3d4"/>
  <circle cx="547" cy="403" r="9" stroke="#719dad"/>
  <path d="m543 403 3 3 5-6" stroke="#1c6285" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="562" y="407" fill="#17455b" font-family="Manrope,Arial,sans-serif" font-size="11">${french ? "Le soin" : "Care in"}</text>
  <text x="542" y="440" fill="#17455b" font-family="Space,Arial,sans-serif" font-size="21">${french ? "des détails." : "every detail."}</text>
</g>
<g stroke="#6593a6" stroke-width="1.2" stroke-linecap="round">
  <path d="M611 243v20m-10-10h20M601 245l20 16m-18 0 16-16"/>
  <path d="M177 449v14m-7-7h14"/>
</g>
</svg>`;
}
