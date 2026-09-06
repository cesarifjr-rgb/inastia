export function serviceDetailArt(index: number): string {
  const scene = Number.isInteger(index) && index >= 0 && index < 7 ? index : 0;
  const id = `service-detail-${scene}`;
  const paint = (name: string): string => `url(#${id}-${name})`;
  const scenes = [
    `<g transform="rotate(-5 72 58)" filter="${paint("shadow")}">
      <rect x="29" y="21" width="83" height="76" rx="9" fill="${paint("cream")}" stroke="#b9ced4"/>
      <rect x="37" y="29" width="67" height="43" rx="5" fill="${paint("sky")}"/>
      <circle cx="91" cy="39" r="6" fill="#efd8a6"/>
      <path d="M37 63Q56 53 72 61T104 59V68Q104 72 100 72H41Q37 72 37 68Z" fill="#b9d7df"/>
      <path d="M53 50 69 37 85 50V65H53Z" fill="#fffaf3" stroke="#7ea7b8"/>
      <path d="m49 51 20-17 20 17" stroke="#1c6285" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M65 65V53H74V65" fill="#e5bf7c" stroke="#c4a16b"/>
      <path d="M39 81H73M39 87H61" stroke="#9db9c3" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g filter="${paint("shadow")}">
      <path d="M95 71 99 65H115L119 71H130Q134 71 134 75V94Q134 98 130 98H92Q88 98 88 94V75Q88 71 92 71Z" fill="${paint("blue")}" stroke="#17455b"/>
      <path d="M94 75H127" stroke="#8bb5c7" stroke-linecap="round"/>
      <circle cx="110" cy="84" r="10" fill="#d6e9f0" stroke="#123d52" stroke-width="2"/>
      <circle cx="110" cy="84" r="6" fill="#315e75"/>
      <path d="M106 81Q109 77 113 80" stroke="#f5fbfc" stroke-width="2" stroke-linecap="round"/>
      <circle cx="126" cy="79" r="2" fill="#e5bf7c"/>
    </g>`,
    `<g transform="rotate(-6 61 61)" filter="${paint("shadow")}">
      <rect x="31" y="25" width="63" height="73" rx="10" fill="${paint("cream")}" stroke="#b9ced4"/>
      <circle cx="62" cy="50" r="17" fill="${paint("sky")}"/>
      <circle cx="62" cy="45" r="6" fill="#427a95"/>
      <path d="M51 61Q51 52 62 52T73 61" fill="#427a95"/>
      <path d="M43 77H78M49 85H72" stroke="#a9c0c9" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g filter="${paint("shadow")}">
      <path d="M90 24H126Q132 24 132 30V47Q132 53 126 53H111L101 61V53H90Q84 53 84 47V30Q84 24 90 24Z" fill="${paint("blue")}" stroke="#17455b" stroke-linejoin="round"/>
      <path d="M94 35H121M94 43H114" stroke="#e0eef3" stroke-width="3" stroke-linecap="round"/>
      <path d="M103 64H130Q135 64 135 69V82Q135 87 130 87H124V94L115 87H103Q98 87 98 82V69Q98 64 103 64Z" fill="${paint("gold")}" stroke="#c5a16b" stroke-linejoin="round"/>
      <circle cx="108" cy="76" r="2" fill="#896c42"/><circle cx="116" cy="76" r="2" fill="#896c42"/><circle cx="124" cy="76" r="2" fill="#896c42"/>
    </g>`,
    `<g filter="${paint("shadow")}">
      <rect x="26" y="77" width="81" height="21" rx="9" fill="${paint("blue")}" stroke="#17455b"/>
      <path d="M34 83H97M35 92H97" stroke="#88adc0" stroke-linecap="round"/>
      <rect x="31" y="60" width="72" height="21" rx="9" fill="${paint("cream")}" stroke="#c5ceca"/>
      <path d="M40 65H94M40 74H94" stroke="#d6d3c6" stroke-linecap="round"/>
      <path d="M40 43H88Q97 43 97 52Q97 63 87 63H40Q31 63 31 53T40 43Z" fill="${paint("sky")}" stroke="#9dbcca"/>
      <path d="M42 49H86Q91 49 91 54T86 59H79" stroke="#7ea8b9" stroke-linecap="round"/>
      <path d="M42 45V60" stroke="#edf7fa" stroke-width="3"/>
    </g>
    <g transform="rotate(5 117 67)" filter="${paint("shadow")}">
      <path d="M109 40H122V50L129 58V92Q129 98 123 98H108Q102 98 102 92V59L109 50Z" fill="${paint("cream")}" stroke="#aac1ca" stroke-linejoin="round"/>
      <path d="M109 40V33H126V39H121V43" fill="${paint("blue")}" stroke="#17455b" stroke-linejoin="round"/>
      <path d="M112 34H132V39H125" fill="#1c6285" stroke="#17455b" stroke-linejoin="round"/>
      <rect x="106" y="65" width="19" height="20" rx="4" fill="${paint("sky")}"/>
      <path d="M115 69Q108 76 111 79Q115 84 119 79Q122 76 115 69Z" fill="#4c8aa4"/>
      <path d="M108 89V93H122" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </g>`,
    `<g transform="rotate(-5 71 60)" filter="${paint("shadow")}">
      <rect x="28" y="29" width="84" height="68" rx="9" fill="${paint("cream")}" stroke="#b8cbd1"/>
      <path d="M37 29H103Q112 29 112 38V47H28V38Q28 29 37 29Z" fill="${paint("blue")}"/>
      <path d="M44 24V36M95 24V36" stroke="#d1ad73" stroke-width="5" stroke-linecap="round"/>
      <path d="M43 24V33M94 24V33" stroke="#ffe9bf" stroke-width="2" stroke-linecap="round"/>
      <g fill="#c5dce4"><rect x="40" y="56" width="12" height="10" rx="3"/><rect x="61" y="56" width="12" height="10" rx="3"/><rect x="82" y="56" width="12" height="10" rx="3"/><rect x="40" y="75" width="12" height="10" rx="3"/><rect x="61" y="75" width="12" height="10" rx="3"/></g>
      <rect x="82" y="75" width="12" height="10" rx="3" fill="#e5bf7c"/>
    </g>
    <g transform="rotate(13 119 77)" filter="${paint("shadow")}">
      <path d="M104 57H124L137 70V94Q137 98 133 98H104Q100 98 100 94V61Q100 57 104 57Z" fill="${paint("gold")}" stroke="#bc975d" stroke-linejoin="round"/>
      <circle cx="124" cy="67" r="3" fill="#fffaf3" stroke="#bc975d"/>
      <path d="M109 87V81M117 87V76M125 87V80" stroke="#856640" stroke-width="4" stroke-linecap="round"/>
      <path d="M105 61H118" stroke="#fff0cf" stroke-linecap="round"/>
    </g>`,
    `<g filter="${paint("shadow")}">
      <path d="M35 98V48A31 31 0 0 1 62 17A31 31 0 0 1 89 48V98Z" fill="${paint("cream")}" stroke="#c6ccbf"/>
      <path d="M44 97V49A18 18 0 0 1 80 49V97Z" fill="${paint("blue")}" stroke="#17455b"/>
      <path d="M49 94V51A13 13 0 0 1 75 51V94" stroke="#74a2b6"/>
      <path d="M51 64H73M51 80H73" stroke="#39728e"/>
      <circle cx="72" cy="71" r="3" fill="#e5bf7c"/>
      <path d="M30 98H94L99 103H26Z" fill="#d2d5ca" stroke="#b8c5c6" stroke-linejoin="round"/>
    </g>
    <g transform="rotate(25 116 73)" filter="${paint("shadow")}">
      <path d="M111 62H121V97L116 102 111 97V89H103V82H111Z" fill="${paint("gold")}" stroke="#b89558" stroke-linejoin="round"/>
      <circle cx="116" cy="49" r="19" fill="${paint("gold")}" stroke="#b89558"/>
      <circle cx="116" cy="49" r="10" fill="#d6e9f0" stroke="#bd9b62"/>
      <path d="M102 47A14 14 0 0 1 125 38M115 70V93" stroke="#fff0cc" stroke-width="2" stroke-linecap="round"/>
    </g>`,
    `<g filter="${paint("shadow")}">
      <path d="M32 66V53A30 30 0 0 1 92 53V66" stroke="#17455b" stroke-width="11" stroke-linecap="round"/>
      <path d="M32 56V52A30 30 0 0 1 92 52V56" stroke="#6fa4bb" stroke-width="5" stroke-linecap="round"/>
      <rect x="25" y="55" width="17" height="29" rx="8" fill="${paint("blue")}" stroke="#17455b"/>
      <rect x="82" y="55" width="17" height="29" rx="8" fill="${paint("blue")}" stroke="#17455b"/>
      <path d="M31 61V76M88 61V76" stroke="#9bc4d3" stroke-width="3" stroke-linecap="round"/>
      <path d="M91 82Q91 97 69 96" stroke="#17455b" stroke-width="4" stroke-linecap="round"/>
      <rect x="58" y="91" width="17" height="9" rx="4.5" fill="${paint("gold")}" stroke="#bb975b"/>
    </g>
    <g transform="rotate(29 119 70)" filter="${paint("shadow")}">
      <path d="M109 34A17 17 0 0 0 106 63L106 95Q106 103 114 103T122 95V63A17 17 0 0 0 119 34V48L114 53 109 48Z" fill="${paint("cream")}" stroke="#92adba" stroke-linejoin="round"/>
      <path d="M114 66V88" stroke="#c6dbe2" stroke-width="4" stroke-linecap="round"/>
      <circle cx="114" cy="95" r="3" fill="#1c6285"/>
    </g>`,
    `<g transform="rotate(-5 71 62)" filter="${paint("shadow")}">
      <path d="M39 22H83L103 42V94Q103 100 97 100H39Q33 100 33 94V28Q33 22 39 22Z" fill="${paint("cream")}" stroke="#b9cbd0" stroke-linejoin="round"/>
      <path d="M83 22V37Q83 42 88 42H103" fill="${paint("sky")}" stroke="#b9cbd0" stroke-linejoin="round"/>
      <path d="M47 43H68M47 57H84M47 66H77M47 81H65" stroke="#9bb7c3" stroke-width="3" stroke-linecap="round"/>
      <rect x="46" y="87" width="15" height="5" rx="2.5" fill="#e5bf7c"/>
    </g>
    <g filter="${paint("shadow")}">
      <circle cx="114" cy="81" r="24" fill="${paint("blue")}" stroke="#17455b"/>
      <circle cx="114" cy="81" r="18" stroke="#75a5ba"/>
      <path d="m103 81 7 7 15-16" stroke="#fffaf3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="132" cy="61" r="6" fill="${paint("gold")}" stroke="#c6a368"/>
    </g>`,
  ];
  return `<svg class="service-mini-art" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}-blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4386a4"/><stop offset=".55" stop-color="#1c6285"/><stop offset="1" stop-color="#17455b"/></linearGradient>
      <linearGradient id="${id}-cream" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fffefb"/><stop offset=".6" stop-color="#fffaf3"/><stop offset="1" stop-color="#eee7d9"/></linearGradient>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#edf7fa"/><stop offset="1" stop-color="#bfdbe6"/></linearGradient>
      <linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8e4b9"/><stop offset=".55" stop-color="#e5bf7c"/><stop offset="1" stop-color="#cda365"/></linearGradient>
      <filter id="${id}-shadow" x="-30%" y="-30%" width="160%" height="170%" color-interpolation-filters="sRGB"><feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="#17455b" flood-opacity=".14"/></filter>
    </defs>
    <path d="M23 97V61a55 55 0 0 1 110 0v36Z" fill="#d6e9f0" opacity=".42"/>
    <ellipse cx="80" cy="103" rx="57" ry="6" fill="#17455b" opacity=".07"/>
    <g stroke-width="1.2">${scenes[scene]}</g>
  </svg>`;
}
