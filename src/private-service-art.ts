// Original decorative vignettes, in the same order as the FR/EN service catalogue.
export function privateServiceArt(index: number): string {
  const id = `private-service-${index}`;
  const paint = (name: string): string => `url(#${id}-${name})`;
  const scenes = [
    // Chef: toque, copper pan and an olive sprig.
    `<g filter="${paint("shadow")}">
      <path d="M100 99C74 95 76 63 96 58C93 32 123 23 138 41C153 20 188 32 184 55C210 58 214 91 190 98L186 124H105Z" fill="${paint("ivory")}"/>
      <path d="M107 98H188M125 75L129 99M167 70L163 99" stroke="#c6c9bd"/>
      <path d="M105 109H188V126H105Z" fill="#dce5df"/>
      <path d="M88 143H215L208 173Q204 185 188 185H115Q100 185 97 173Z" fill="${paint("copper")}" stroke="#997151"/>
      <path d="M215 147H251Q260 147 260 153T251 160H213" fill="none" stroke="#344e50" stroke-width="7"/>
      <path d="M88 142Q150 126 215 142M109 157L114 173" fill="none" stroke="#f8dbc0" stroke-width="3"/>
      <path d="M93 146H83Q71 146 74 157Q76 163 91 161" fill="none" stroke="#344e50" stroke-width="5"/>
    </g>
    <path d="M222 128Q233 91 259 72" stroke="#687b64" fill="none"/>
    <g fill="#82917b"><ellipse cx="235" cy="107" rx="6" ry="14" transform="rotate(-40 235 107)"/><ellipse cx="250" cy="92" rx="6" ry="14" transform="rotate(35 250 92)"/><ellipse cx="227" cy="122" rx="5" ry="12" transform="rotate(-48 227 122)"/></g>`,
    // Groceries: market basket, bread, fruit and a breakfast bottle.
    `<g filter="${paint("shadow")}">
      <path d="M97 125Q92 83 121 75Q151 68 160 111" fill="none" stroke="#a98555" stroke-width="9"/>
      <path d="M150 113L177 41Q182 28 193 32Q205 36 201 49L181 122Z" fill="${paint("gold")}" stroke="#b49362"/>
      <path d="m180 53 13 7m-20 10 13 7m-20 10 13 7" stroke="#fff0d0" stroke-width="4"/>
      <path d="M105 113V69L113 56H132L140 69V116Z" fill="${paint("ivory")}" stroke="#9eb3ae"/><path d="M113 55V47H132V55" fill="#6e8b81"/><path d="M109 80H136V100H109" fill="#dce6dc"/>
      <circle cx="213" cy="116" r="22" fill="#c78164"/><path d="M210 95Q208 85 218 81M213 96Q226 85 233 96" stroke="#657c61" fill="none" stroke-width="4"/>
      <ellipse cx="159" cy="118" rx="22" ry="17" fill="#e5c76e" transform="rotate(-22 159 118)"/>
      <path d="M74 117H244L230 182Q228 190 218 190H101Q91 190 89 182Z" fill="${paint("gold")}" stroke="#b29260"/>
      <path d="M91 139H233M94 154H230M98 170H227M110 130L119 185M134 130L139 186M159 130V186M184 130L179 186M209 130L200 185" stroke="#ad8b58" opacity=".45"/>
      <path d="M77 119H242" stroke="#f1dab1" stroke-width="10"/>
      <path d="M96 120Q115 104 133 120" fill="none" stroke="#b29260" stroke-width="4"/>
    </g>`,
    // Babysitting: a teddy bear and an open storybook.
    `<g filter="${paint("shadow")}">
      <circle cx="120" cy="66" r="17" fill="#c49c70"/><circle cx="179" cy="66" r="17" fill="#c49c70"/>
      <circle cx="120" cy="66" r="9" fill="#ebd6b8"/><circle cx="179" cy="66" r="9" fill="#ebd6b8"/>
      <ellipse cx="150" cy="139" rx="43" ry="45" fill="${paint("gold")}"/>
      <circle cx="150" cy="91" r="39" fill="${paint("gold")}"/>
      <ellipse cx="150" cy="106" rx="22" ry="17" fill="#f5e8cf"/><ellipse cx="150" cy="101" rx="7" ry="5" fill="#66533f"/>
      <path d="M150 106V113M143 114Q150 120 157 114" fill="none" stroke="#66533f" stroke-width="1.7"/>
      <circle cx="134" cy="88" r="3" fill="#66533f"/><circle cx="166" cy="88" r="3" fill="#66533f"/>
      <ellipse cx="108" cy="146" rx="16" ry="25" fill="#d8b785" transform="rotate(24 108 146)"/><ellipse cx="191" cy="146" rx="16" ry="25" fill="#d8b785" transform="rotate(-24 191 146)"/>
      <path d="M82 151Q118 143 151 159Q184 143 221 151V191Q185 184 151 199Q115 184 82 191Z" fill="${paint("blue")}" stroke="#416875"/>
      <path d="M88 148Q121 142 151 156Q182 142 215 148V184Q181 180 151 193Q118 180 88 184Z" fill="${paint("ivory")}"/>
      <path d="M151 158V188M100 160L136 166M99 170L128 175M169 165L200 159M169 175L201 169" stroke="#acbdb5"/>
    </g>
    <path d="m221 64 3-10 4 10 10 3-10 4-4 10-3-10-10-4Z" fill="#d6b474"/><circle cx="94" cy="104" r="3" fill="#d6b474"/>`,
    // Baby equipment: a pram, muslin blanket and a small hanging toy.
    `<g filter="${paint("shadow")}">
      <path d="M109 123Q110 47 179 46V123Z" fill="${paint("sage")}" stroke="#697f73"/>
      <path d="M128 121Q130 68 179 61M150 122Q151 88 179 84" stroke="#b4c4b1" fill="none"/>
      <path d="M100 120H239Q234 166 194 166H143Q108 166 100 120Z" fill="${paint("ivory")}" stroke="#99b1a8"/>
      <path d="M170 122H214V154Q208 160 201 154Q194 160 186 154Q179 160 172 154Z" fill="#d4e4e7"/>
      <path d="M105 121L86 76H68M130 165L204 194M207 164L139 194" stroke="#426271" stroke-width="5" fill="none"/>
      <path d="M67 75H82" stroke="#aa8157" stroke-width="9"/>
      <circle cx="135" cy="187" r="17" fill="#436471"/><circle cx="135" cy="187" r="10" fill="#eee8d9"/><circle cx="209" cy="187" r="17" fill="#436471"/><circle cx="209" cy="187" r="10" fill="#eee8d9"/>
      <path d="M182 49Q210 45 213 76" stroke="#a58255" fill="none"/><path d="m213 75 4 8 9 1-7 7 2 9-8-4-8 4 2-9-7-7 9-1Z" fill="#d8b679"/>
    </g>`,
    // Wellbeing: a rolled yoga mat, massage oil, stones and leaves.
    `<g filter="${paint("shadow")}">
      <path d="M85 151H211Q230 151 230 171T211 192H88Z" fill="${paint("sage")}" stroke="#758e80"/>
      <ellipse cx="88" cy="172" rx="22" ry="21" fill="#c9d8c6" stroke="#758e80"/><path d="M88 183C65 181 76 156 92 165C104 172 89 183 85 174" stroke="#758e80" fill="none"/>
      <path d="M120 156V181M202 156V184" stroke="#b3c7b0" stroke-width="5"/>
      <rect x="121" y="102" width="41" height="54" rx="9" fill="${paint("gold")}" stroke="#a98a5f"/>
      <rect x="131" y="90" width="21" height="15" rx="3" fill="#5d796f"/><path d="M141 90V77H156" stroke="#48695f" stroke-width="5" fill="none"/>
      <rect x="129" y="116" width="26" height="24" rx="3" fill="#f7efdc"/>
      <path d="M139 134Q132 122 146 121Q149 131 139 134Z" fill="#84957a"/>
      <ellipse cx="221" cy="141" rx="29" ry="13" fill="#9faaa0"/><ellipse cx="219" cy="123" rx="24" ry="11" fill="#bec5b8"/><ellipse cx="220" cy="107" rx="19" ry="9" fill="#dddcc9"/>
    </g>
    <path d="M87 143Q92 88 75 52" stroke="#7c8d6c" fill="none"/>
    <g fill="#94a18a"><ellipse cx="77" cy="64" rx="7" ry="17" transform="rotate(-25 77 64)"/><ellipse cx="93" cy="83" rx="7" ry="17" transform="rotate(37 93 83)"/><ellipse cx="74" cy="105" rx="8" ry="18" transform="rotate(-48 74 105)"/></g>`,
    // Boat: an ivory sailing boat over layered Mediterranean water.
    `<path d="M42 153Q77 140 113 151T186 151T274 151V196H42Z" fill="#cee1e3"/>
    <g filter="${paint("shadow")}">
      <path d="M85 151H250L229 177H112Q96 177 85 151Z" fill="${paint("blue")}" stroke="#456c7b"/>
      <path d="M96 150H238" stroke="#fffdf4" stroke-width="6"/>
      <path d="M163 149V35" stroke="#a9855f" stroke-width="4"/>
      <path d="M157 44L157 136H93Z" fill="${paint("ivory")}" stroke="#bdc7bd"/>
      <path d="M174 62L175 136H233Z" fill="#e6d7b9" stroke="#baa987"/>
      <path d="M104 123L149 60M183 80L222 129" stroke="#d8d8c7" fill="none"/>
      <path d="M163 37L191 45 163 53Z" fill="#b8765b"/>
    </g>
    <path d="M56 177Q72 185 88 177M142 190Q158 198 174 190M234 191Q250 199 266 191M182 178Q197 183 208 178" stroke="#77a2af" fill="none" stroke-width="2.5"/>
    <path d="M54 107Q64 98 74 107Q82 97 92 103" fill="none" stroke="#91a4a2"/>`,
    // Transport: a touring car and a suitcase ready for departure.
    `<path d="M47 185H278" stroke="#bac9c2"/><path d="M66 195H106M131 195H171M196 195H236" stroke="#d0c3a8"/>
    <g filter="${paint("shadow")}">
      <rect x="212" y="96" width="46" height="75" rx="8" fill="${paint("gold")}" stroke="#aa8b60"/>
      <path d="M224 96V82H246V96M224 110V154M245 110V154" stroke="#947951" fill="none" stroke-width="3"/><circle cx="221" cy="174" r="5" fill="#45616a"/><circle cx="251" cy="174" r="5" fill="#45616a"/>
      <path d="M68 123L87 89Q94 79 108 79H162Q176 79 186 94L205 122L220 133V162H54V137Q54 126 68 123Z" fill="${paint("blue")}" stroke="#416572"/>
      <path d="M83 120L99 93H123V120ZM133 93H161Q168 93 174 103L185 120Z" fill="#d6e8e8"/>
      <path d="M135 127V153M65 137H81M195 137H210" stroke="#c6dce0" stroke-width="3"/>
      <path d="M57 155H217" stroke="#acc4ca" stroke-width="3"/>
      <circle cx="89" cy="163" r="21" fill="#36515c"/><circle cx="89" cy="163" r="11" fill="#e8e7d9"/><circle cx="183" cy="163" r="21" fill="#36515c"/><circle cx="183" cy="163" r="11" fill="#e8e7d9"/>
    </g>
    <path d="M72 66Q103 41 126 55M189 56H231" stroke="#b7c8bd" fill="none"/>`,
    // Linen: a generous stack of folded linen, spray bottle and laundry leaf.
    `<g filter="${paint("shadow")}">
      <rect x="68" y="149" width="140" height="37" rx="12" fill="${paint("blue")}" stroke="#6b8f99"/>
      <path d="M80 160H197M82 176H194M94 152V184" stroke="#acc8ce"/>
      <rect x="77" y="119" width="127" height="35" rx="12" fill="${paint("ivory")}" stroke="#bdc7bc"/>
      <path d="M88 130H192M90 143H190M107 122V150" stroke="#d0cdb9"/>
      <path d="M94 91H179Q195 91 195 107Q195 124 179 124H94Q78 124 78 107Q78 91 94 91Z" fill="#d7e1d0" stroke="#99af98"/>
      <path d="M98 100H178Q187 100 187 108T178 116H164" fill="none" stroke="#a9bba3"/>
      <path d="M225 97H243V112L253 126V178Q253 187 244 187H220Q211 187 211 178V126L225 112Z" fill="${paint("ivory")}" stroke="#a9bdb6"/>
      <path d="M224 98V87H255V96H240V102" fill="${paint("blue")}"/><path d="M243 89H266V96H257" fill="#406c7d"/>
      <rect x="218" y="137" width="28" height="31" rx="5" fill="#dce6d7"/>
      <path d="M230 161Q220 145 237 145Q242 156 230 161Z" fill="#83957c"/>
    </g>`,
    // Flowers and gifts: a loose bouquet and a ribboned gift.
    `<g stroke="#7d9176" stroke-width="3" fill="none"><path d="M131 164L107 71M131 164L141 53M131 164L174 79M131 164L92 111M131 164L163 114"/></g>
    <g fill="#93a187"><ellipse cx="110" cy="107" rx="7" ry="18" transform="rotate(-44 110 107)"/><ellipse cx="148" cy="122" rx="7" ry="19" transform="rotate(46 148 122)"/><ellipse cx="158" cy="70" rx="6" ry="17" transform="rotate(38 158 70)"/></g>
    <g fill="#fffaf0" stroke="#ddcdb4"><path d="M107 55C100 40 87 55 95 64C76 65 84 83 98 78C98 96 117 94 117 80C133 87 141 69 125 65C135 51 116 41 107 55Z"/><path d="M168 69C161 55 148 66 155 77C139 81 149 95 160 89C163 105 181 99 178 87C194 90 197 73 181 75C188 62 173 57 168 69Z"/></g>
    <g fill="#d39b80"><circle cx="142" cy="48" r="13"/><circle cx="91" cy="112" r="11"/><circle cx="172" cy="111" r="13"/></g>
    <g fill="#dab778"><circle cx="108" cy="69" r="7"/><circle cx="168" cy="81" r="6"/></g>
    <g filter="${paint("shadow")}"><path d="M82 124L130 189 180 125 135 148Z" fill="${paint("ivory")}" stroke="#c9c2ac"/><path d="M88 124L130 189 134 147Z" fill="#e6ddc7"/><path d="m115 166 33-2m-16-1 12 29m-13-28-12 25" stroke="#a77e58" fill="none" stroke-width="3"/>
      <rect x="193" y="139" width="67" height="47" rx="3" fill="${paint("sage")}"/><rect x="189" y="132" width="75" height="13" rx="3" fill="#9eb19a"/><path d="M227 134V185" stroke="#f3e3c6" stroke-width="10"/><path d="M226 132C200 136 201 109 216 116L227 131C249 104 263 139 226 132Z" fill="none" stroke="#e0c99e" stroke-width="4"/>
    </g>`,
    // Restaurants: a place setting, linen napkin, menu and wine glass.
    `<g filter="${paint("shadow")}">
      <rect x="84" y="66" width="113" height="117" rx="9" transform="rotate(-8 140 124)" fill="#dce4d5"/>
      <circle cx="143" cy="128" r="51" fill="${paint("ivory")}" stroke="#d4ceb8"/><circle cx="143" cy="128" r="39" stroke="#a7bdba" fill="none"/>
      <path d="m119 109 40 10-21 45Z" fill="${paint("blue")}"/><path d="m119 109 19 55 9-39Z" fill="#7096a0"/>
      <path d="M72 94V181M61 86V107Q61 118 72 118Q83 118 83 107V86M72 86V107M211 87Q198 121 210 133V179" stroke="#9aabac" fill="none" stroke-width="3"/>
      <path d="M238 116V166M227 168H249M226 84H250L248 105Q247 117 238 117Q229 117 228 105Z" stroke="#91aeb2" fill="none"/>
      <path d="M230 99H246L245 106Q243 114 238 114Q232 113 231 106Z" fill="#dfc18e"/>
      <path d="m203 38 46 6-5 37-46-6Z" fill="${paint("ivory")}" stroke="#c4bcaa"/><path d="m210 50 29 4m-30 5 22 3m-23 5 27 4" stroke="#9fae9a"/>
    </g>
    <path d="m125 132 37 9" stroke="#d6b579" stroke-width="5"/>`,
    // Rental search: a Corsican house, cypress and a magnifying glass.
    `<g filter="${paint("shadow")}">
      <path d="M86 176V92L148 50 210 92V176Z" fill="${paint("ivory")}" stroke="#c6bda7"/>
      <path d="m78 96 70-49 72 49-10 9-62-42-61 42Z" fill="#be9271"/>
      <path d="M93 91L148 54 204 91" stroke="#dbb898" fill="none"/>
      <path d="M128 176V136Q128 113 148 113Q168 113 168 136V176Z" fill="${paint("blue")}"/>
      <path d="M102 112H120V138H102ZM180 112H198V138H180Z" fill="#92a28a"/><path d="M111 114V137M189 114V137" stroke="#d7e0cf"/>
      <circle cx="160" cy="148" r="3" fill="#d9b678"/>
      <path d="M62 172V132M62 73C36 107 43 147 62 147C81 147 87 108 62 73Z" fill="#7c927b" stroke="#6f846e"/>
      <circle cx="227" cy="140" r="28" fill="#e1efed" fill-opacity=".83" stroke="#476d78" stroke-width="7"/><path d="m248 162 24 24" stroke="#b49164" stroke-width="12"/>
      <path d="M218 128Q224 122 232 125" stroke="#fffef5" stroke-width="3" fill="none"/>
      <path d="M89 178H198" stroke="#c5c5ad" stroke-width="5"/>
    </g>`,
    // Private events: a celebration cake, candles, balloons and festoon lights.
    `<path d="M58 42Q160 91 265 39" stroke="#b9a989" fill="none"/>
    <g fill="#ddbe80"><circle cx="89" cy="56" r="5"/><circle cx="124" cy="66" r="5"/><circle cx="159" cy="70" r="5"/><circle cx="195" cy="64" r="5"/><circle cx="231" cy="54" r="5"/></g>
    <g filter="${paint("shadow")}">
      <ellipse cx="95" cy="101" rx="23" ry="29" fill="${paint("sage")}"/><ellipse cx="235" cy="99" rx="21" ry="27" fill="${paint("gold")}"/>
      <path d="M93 128Q115 151 93 177M235 125Q219 146 237 174" stroke="#a9b4a2" fill="none"/>
      <path d="m91 127-3 7h12l-4-7m136-3-3 7h11l-3-7" fill="#9cab91"/>
      <rect x="119" y="124" width="83" height="54" rx="7" fill="${paint("ivory")}" stroke="#d2bfa0"/>
      <path d="M119 131Q124 139 130 132Q137 147 144 134Q151 143 157 133Q165 148 172 133Q180 142 185 132Q195 141 202 131V126Q202 121 194 121H127Q119 121 119 126Z" fill="#d9ae8e"/>
      <path d="M121 163H200" stroke="#d9ae8e" stroke-width="4"/>
      <path d="M108 179H214M160 182V194M142 197H180" stroke="#7395a0" stroke-width="5"/>
      <path d="M143 120V106M160 120V100M178 120V106" stroke="#77988a" stroke-width="5"/>
      <path d="M143 101Q133 95 143 85Q152 95 143 101ZM160 95Q150 89 160 79Q170 89 160 95ZM178 101Q168 95 178 85Q188 95 178 101Z" fill="#dfba6f"/>
    </g>`,
  ];
  return `<svg class="private-service-art" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}-blue" x2=".7" y2="1"><stop stop-color="#7b9eaa"/><stop offset="1" stop-color="#365f70"/></linearGradient>
      <linearGradient id="${id}-ivory" x2=".7" y2="1"><stop stop-color="#fffef6"/><stop offset="1" stop-color="#ece5d4"/></linearGradient>
      <linearGradient id="${id}-gold" x2=".7" y2="1"><stop stop-color="#ead8b2"/><stop offset="1" stop-color="#c2a16d"/></linearGradient>
      <linearGradient id="${id}-sage" x2=".7" y2="1"><stop stop-color="#b5c4aa"/><stop offset="1" stop-color="#7c947d"/></linearGradient>
      <linearGradient id="${id}-copper" x2=".7" y2="1"><stop stop-color="#d9b28c"/><stop offset="1" stop-color="#ae795b"/></linearGradient>
      <filter id="${id}-shadow" x="-20%" y="-20%" width="150%" height="150%" color-interpolation-filters="sRGB"><feDropShadow dy="3" stdDeviation="3" flood-color="#405e5a" flood-opacity=".12"/></filter>
    </defs>
    <path d="M60 181V105a100 100 0 0 1 200 0v76Z" fill="${index % 3 === 0 ? "#e6e9dc" : index % 3 === 1 ? "#e6e2d4" : "#e0e9e5"}" opacity=".72"/>
    <circle cx="${index % 2 === 0 ? 238 : 80}" cy="57" r="22" fill="#f0dfba" opacity=".7"/>
    <ellipse cx="160" cy="194" rx="107" ry="7" fill="#50665c" opacity=".07"/>
    <g stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${scenes[index] ?? scenes[0]}</g>
  </svg>`;
}
