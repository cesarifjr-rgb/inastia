import type { Locale } from "./content/pages.ts";
import { t } from "./lib.ts";

export function managementNotebook(locale: Locale): string {
  const id = `management-notebook-${locale}`;
  const paint = (name: string): string => `url(#${id}-${name})`;
  return `<svg class="management-art-illustration" viewBox="0 0 640 510" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}-blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4386a4"/><stop offset=".55" stop-color="#1c6285"/><stop offset="1" stop-color="#17455b"/></linearGradient>
      <linearGradient id="${id}-cream" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fffefb"/><stop offset=".6" stop-color="#fffaf3"/><stop offset="1" stop-color="#eee7d9"/></linearGradient>
      <linearGradient id="${id}-page-left" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f5eddf"/><stop offset=".3" stop-color="#fffdf7"/><stop offset=".85" stop-color="#fffaf3"/><stop offset="1" stop-color="#d9cdb8"/></linearGradient>
      <linearGradient id="${id}-page-right" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#ddcfb9"/><stop offset=".15" stop-color="#fffaf3"/><stop offset=".75" stop-color="#fffdf8"/><stop offset="1" stop-color="#eee4d3"/></linearGradient>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#edf7fa"/><stop offset="1" stop-color="#bfdbe6"/></linearGradient>
      <linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8e4b9"/><stop offset=".55" stop-color="#e5bf7c"/><stop offset="1" stop-color="#cda365"/></linearGradient>
      <radialGradient id="${id}-halo"><stop stop-color="#d6e9f0" stop-opacity=".65"/><stop offset="1" stop-color="#d6e9f0" stop-opacity="0"/></radialGradient>
      <filter id="${id}-shadow" x="-35%" y="-35%" width="180%" height="185%" color-interpolation-filters="sRGB"><feDropShadow dx="2" dy="7" stdDeviation="5" flood-color="#17455b" flood-opacity=".15"/></filter>
      <filter id="${id}-small-shadow" x="-35%" y="-35%" width="180%" height="185%" color-interpolation-filters="sRGB"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-color="#17455b" flood-opacity=".14"/></filter>
    </defs>
    <ellipse cx="319" cy="267" rx="302" ry="230" fill="${paint("halo")}"/>
    <ellipse cx="320" cy="437" rx="222" ry="23" fill="#17455b" opacity=".055"/>
    <path d="M65 283C42 224 57 155 96 121M501 323C555 299 580 261 576 219" stroke="#aecbd5" stroke-width="1.5" stroke-dasharray="3 9" stroke-linecap="round"/>

    <g class="management-art-notebook">
      <g filter="${paint("shadow")}">
        <path d="M113 203Q212 184 310 215Q407 177 498 189L519 409Q418 409 312 446Q209 416 106 433Z" fill="#17455b" stroke="#143c4f" stroke-width="2" stroke-linejoin="round"/>
        <path d="M110 196Q211 177 310 210Q411 169 500 184L513 398Q412 398 311 435Q206 404 107 422Z" fill="${paint("blue")}" stroke="#3e7993" stroke-width="2" stroke-linejoin="round"/>
        <path d="M115 414Q213 399 311 430Q413 395 505 395" stroke="#7eafc3" stroke-width="2" stroke-linecap="round"/>
        <path d="M122 207Q214 191 310 221Q409 183 489 195L494 398Q410 393 310 428Q216 400 118 413Z" fill="#e6dbc6" stroke="#c9bda5" stroke-width="1.5"/>
        <path d="M121 401Q217 387 310 416Q408 382 492 387M120 406Q216 392 310 421Q409 387 493 392" stroke="#c6b99f" stroke-width="1.3"/>
        <path d="M123 190Q218 176 310 211V418Q215 385 120 402Z" fill="${paint("page-left")}" stroke="#d0c4ae" stroke-width="1.4"/>
        <path d="M310 211Q406 172 488 180L492 388Q404 382 310 418Z" fill="${paint("page-right")}" stroke="#d0c4ae" stroke-width="1.4"/>
        <path d="M130 196Q216 183 299 211M323 211Q409 180 481 186" stroke="#fffefb" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M310 212Q303 313 310 420" stroke="#bca982" stroke-width="2"/>
        <path d="M314 214Q309 313 314 413" stroke="#fff9e9" stroke-width="2"/>
        <path d="M326 211Q321 309 330 427L339 419 348 425Q337 315 340 207Z" fill="${paint("gold")}" stroke="#c6a365" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M332 214Q328 309 339 410" stroke="#fcecc6" stroke-width="1.6"/>
        <g transform="rotate(5 217 274)">
          <path d="M166 234H266" stroke="#c7ad7f" stroke-width="1.5"/>
          <text x="217" y="280" text-anchor="middle" fill="#17455b" font-family="Space,Arial,sans-serif" font-size="25" font-weight="600" letter-spacing="3">INASTIA</text>
          <path d="M184 299H250" stroke="#c7ad7f" stroke-width="1.5"/>
        </g>
        <g transform="rotate(-5 410 250)">
          <text x="410" y="246" text-anchor="middle" fill="#52778a" font-family="Manrope,Arial,sans-serif" font-size="12" font-weight="500">${t(locale, "Carnet de", "Concierge")}</text>
          <text x="410" y="265" text-anchor="middle" fill="#17455b" font-family="Manrope,Arial,sans-serif" font-size="13" font-weight="500">${t(locale, "conciergerie", "journal")}</text>
          <path d="M371 288H450M371 313H450M371 338H450" stroke="#c9d8d8" stroke-width="1.2"/>
          <circle cx="367" cy="288" r="2.5" fill="#d3bb8c"/><circle cx="367" cy="313" r="2.5" fill="#d3bb8c"/><circle cx="367" cy="338" r="2.5" fill="#d3bb8c"/>
        </g>
        <path d="M143 334Q212 325 274 345M141 356Q211 347 274 367" stroke="#d4d9d0" stroke-width="1.2"/>
      </g>
    </g>

    <g class="management-art-zone management-art-zone-listing management-art-diagram" data-management-diagram="listing">
      <g transform="rotate(-9 111 112)" filter="${paint("small-shadow")}">
        <rect x="44" y="39" width="114" height="140" rx="12" fill="${paint("cream")}" stroke="#b9ced4" stroke-width="1.6"/>
        <rect x="53" y="49" width="96" height="59" rx="7" fill="${paint("sky")}"/>
        <circle cx="126" cy="64" r="9" fill="${paint("gold")}"/>
        <path d="M54 89Q73 69 94 87T148 81V101Q148 108 141 108H60Q53 108 53 101Z" fill="#a7cbd9"/>
        <path d="M54 98Q82 89 106 99T148 95V102Q148 108 141 108H60Q53 108 53 102Z" fill="#c4dfe7"/>
        <path d="M59 123H130M59 135H112M59 150H93" stroke="#a4bec8" stroke-width="4" stroke-linecap="round"/>
        <circle cx="137" cy="151" r="7" fill="#e5bf7c"/>
      </g>
      <g transform="rotate(5 175 135)" filter="${paint("shadow")}">
        <rect x="118" y="75" width="119" height="112" rx="13" fill="${paint("cream")}" stroke="#afc6ce" stroke-width="1.6"/>
        <path d="M132 75H223Q237 75 237 89V103H118V89Q118 75 132 75Z" fill="${paint("blue")}"/>
        <path d="M142 68V86M213 68V86" stroke="#bc985e" stroke-width="7" stroke-linecap="round"/>
        <path d="M140 68V82M211 68V82" stroke="#ffe8b6" stroke-width="3" stroke-linecap="round"/>
        <g fill="#d6e5e9"><rect x="133" y="117" width="21" height="18" rx="5"/><rect x="167" y="117" width="21" height="18" rx="5"/><rect x="201" y="117" width="21" height="18" rx="5"/><rect x="133" y="150" width="21" height="18" rx="5"/><rect x="167" y="150" width="21" height="18" rx="5"/><rect x="201" y="150" width="21" height="18" rx="5"/></g>
        <g class="management-diagram-motion management-calendar-marker" data-management-motion="listing">
          <rect x="167" y="117" width="21" height="18" rx="5" fill="${paint("blue")}"/>
          <path d="m172 126 4 4 8-9" stroke="#fffaf3" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </g>
    </g>

    <g class="management-art-zone management-art-zone-guests management-art-diagram" data-management-diagram="guests">
      <g transform="rotate(23 480 130)" filter="${paint("shadow")}">
        <path d="M472 117H491V219L482 227 472 218V200H456V186H472V173H456V160H472Z" fill="${paint("gold")}" stroke="#b89558" stroke-width="1.7" stroke-linejoin="round"/>
        <circle cx="481" cy="86" r="38" fill="${paint("gold")}" stroke="#b89558" stroke-width="1.7"/>
        <circle cx="481" cy="86" r="22" fill="#d6e9f0" stroke="#c8a469" stroke-width="1.7"/>
        <path d="M453 83A29 29 0 0 1 499 63M482 134V210" stroke="#fff0cc" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g filter="${paint("small-shadow")}">
        <path d="M525 131H592Q605 131 605 144V177Q605 190 592 190H557L538 205V190H525Q512 190 512 177V144Q512 131 525 131Z" fill="${paint("cream")}" stroke="#aac5d0" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M528 149H588M528 163H570" stroke="#9ab9c6" stroke-width="4" stroke-linecap="round"/>
        <g class="management-diagram-motion management-guest-reply" data-management-motion="guests">
          <path d="M530 205H582Q593 205 593 216V238Q593 249 582 249H576V262L559 249H530Q519 249 519 238V216Q519 205 530 205Z" fill="${paint("blue")}" stroke="#17455b" stroke-width="1.4" stroke-linejoin="round"/>
          <circle cx="539" cy="227" r="3.7" fill="#fffaf3"/><circle cx="556" cy="227" r="3.7" fill="#fffaf3"/><circle cx="573" cy="227" r="3.7" fill="#fffaf3"/>
        </g>
      </g>
    </g>

    <g class="management-art-zone management-art-zone-home management-art-diagram" data-management-diagram="home">
      <g transform="rotate(-5 126 402)" filter="${paint("shadow")}">
        <rect x="35" y="421" width="167" height="35" rx="15" fill="${paint("blue")}" stroke="#17455b" stroke-width="1.6"/>
        <path d="M50 431H187M50 447H187" stroke="#81adbf" stroke-width="1.5" stroke-linecap="round"/>
        <rect x="43" y="391" width="153" height="35" rx="15" fill="${paint("cream")}" stroke="#c6ceca" stroke-width="1.5"/>
        <path d="M58 400H180M58 417H180" stroke="#d6d1c1" stroke-width="1.5" stroke-linecap="round"/>
        <rect x="51" y="365" width="136" height="31" rx="14" fill="${paint("sky")}" stroke="#a5c3cf" stroke-width="1.5"/>
        <path d="M67 373H168Q180 373 180 381T170 389H154" stroke="#8eb3c4" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M70 369V392" stroke="#f0f9fc" stroke-width="4"/>
      </g>
      <g transform="rotate(7 223 397)" filter="${paint("small-shadow")}">
        <rect x="178" y="338" width="92" height="121" rx="11" fill="${paint("cream")}" stroke="#adc5ce" stroke-width="1.5"/>
        <rect x="201" y="329" width="45" height="18" rx="6" fill="${paint("gold")}" stroke="#c4a16b" stroke-width="1.3"/>
        <g stroke="#b6cdd4" stroke-width="2"><rect x="191" y="362" width="13" height="13" rx="3"/><rect x="191" y="387" width="13" height="13" rx="3"/><rect x="191" y="412" width="13" height="13" rx="3"/><path d="M215 369H254M215 394H254M215 419H244" stroke-linecap="round"/></g>
        <g class="management-diagram-motion management-home-check" data-management-motion="home">
          <circle cx="260" cy="443" r="20" fill="${paint("blue")}" stroke="#17455b" stroke-width="1.4"/>
          <path d="m250 443 7 7 14-15" stroke="#fffaf3" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </g>
    </g>
  </svg>`;
}
