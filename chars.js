// Characters and map buildings, drawn as SVG so the site needs no image files.
(function(){
const HAIR={
  short:c=>`<path d="M56 104 Q50 50 100 48 Q150 50 144 104 Q140 76 112 70 Q100 82 84 72 Q62 78 56 104Z" fill="${c}"/>`,
  bob:c=>`<path d="M52 136 Q44 52 100 50 Q156 52 148 136 L136 136 Q140 86 116 76 Q96 88 76 78 Q60 88 64 136Z" fill="${c}"/>`,
  perm:c=>[[62,78,16],[78,60,17],[100,54,18],[122,60,17],[138,78,16],[56,98,12],[144,98,12],[70,66,12],[130,66,12]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join(""),
  bun:c=>`<circle cx="100" cy="44" r="17" fill="${c}"/><path d="M56 104 Q50 52 100 52 Q150 52 144 104 Q138 80 100 76 Q62 80 56 104Z" fill="${c}"/>`
};
const ACC={
  vest:(t)=>`<path d="M48 240 Q50 182 84 170 L94 240Z M152 240 Q150 182 116 170 L106 240Z" fill="rgba(0,0,0,.18)"/><rect x="116" y="196" width="22" height="12" rx="3" fill="#fff" opacity=".9"/>`,
  apron:()=>`<path d="M70 178 L130 178 L136 240 L64 240Z" fill="#F4EDE2"/><path d="M78 178 Q100 160 122 178" stroke="#F4EDE2" stroke-width="5" fill="none"/>`,
  scarf:()=>`<path d="M84 160 L116 160 L108 182 L100 172 L92 182Z" fill="#E7B04B"/>`,
  lanyard:()=>`<path d="M86 168 L100 206 L114 168" stroke="#E7B04B" stroke-width="3" fill="none"/><rect x="91" y="204" width="18" height="24" rx="3" fill="#fff"/><rect x="94" y="208" width="12" height="6" fill="#3E7CC9"/>`, cap:()=>``, glasses:()=>``, nursecap:()=>``
};
function head(s){
  let extra="";
  if(s.acc==="glasses") extra+=`<g fill="none" stroke="#2B2B2B" stroke-width="3"><circle cx="84" cy="108" r="11"/><circle cx="116" cy="108" r="11"/><path d="M95 107 Q100 103 105 107"/></g>`;
  if(s.acc==="cap") extra+=`<path d="M54 92 Q56 46 100 46 Q144 46 146 92Z" fill="#33445E"/><path d="M96 88 Q130 82 168 92 Q132 98 96 94Z" fill="#26344A"/><circle cx="100" cy="66" r="7" fill="#E7B04B"/>`;
  if(s.acc==="nursecap") extra+=`<path d="M74 62 L126 62 L120 42 L80 42Z" fill="#FFFFFF" stroke="#CFDCE0" stroke-width="2"/><path d="M97 46h6v5h5v6h-5v5h-6v-5h-5v-6h5z" fill="#2E9C8F"/>`;
  return `<circle cx="56" cy="110" r="8" fill="${s.skin}"/><circle cx="144" cy="110" r="8" fill="${s.skin}"/>
    <ellipse cx="100" cy="106" rx="44" ry="48" fill="${s.skin}"/>
    ${s.acc==="cap"?"":HAIR[s.style](s.hair)}
    <path d="M76 94 Q84 89 92 94 M108 94 Q116 89 124 94" stroke="${s.hair}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <g class="ch-eyes"><ellipse cx="84" cy="108" rx="4.5" ry="5.5" fill="#1F1A17"/><ellipse cx="116" cy="108" rx="4.5" ry="5.5" fill="#1F1A17"/></g>
    <circle cx="74" cy="124" r="7" fill="#F08A7E" opacity=".35"/><circle cx="126" cy="124" r="7" fill="#F08A7E" opacity=".35"/>
    <path class="ch-mouth-closed" d="M90 130 Q100 138 110 130" stroke="#7A3B33" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse class="ch-mouth-open" cx="100" cy="133" rx="8" ry="6" fill="#7A3B33"/>
    ${extra}`;
}
window.charSVG=function(s){
  return `<svg class="ch" viewBox="0 0 200 240" role="img" aria-label="character">
    <g class="ch-body">
      <path d="M38 240 Q38 172 100 164 Q162 172 162 240Z" fill="${s.top}"/>
      ${(ACC[s.acc]||ACC.lanyard)(s.top)}
      <rect x="89" y="140" width="22" height="30" rx="8" fill="${s.skin}"/>
      <g class="ch-head">${head(s)}</g>
    </g></svg>`;
};

// ---------- map buildings (local coords, ground at y=40) ----------
const B={
  store:`<rect x="-48" y="-30" width="96" height="70" rx="4" fill="#FBFBF7" stroke="#2C3A33" stroke-width="2.5"/>
    <rect x="-54" y="-42" width="108" height="16" rx="3" fill="#3C8D5A"/><path d="M-54 -26h108" stroke="#2C3A33" stroke-width="2.5"/>
    <g fill="#fff" opacity=".85"><rect x="-40" y="-40" width="10" height="12"/><rect x="-16" y="-40" width="10" height="12"/><rect x="8" y="-40" width="10" height="12"/><rect x="32" y="-40" width="10" height="12"/></g>
    <rect x="-38" y="-14" width="42" height="34" fill="#BFE0EF" stroke="#2C3A33" stroke-width="2"/><rect x="12" y="-14" width="26" height="54" fill="#8FC6DE" stroke="#2C3A33" stroke-width="2"/>`,
  restaurant:`<rect x="-46" y="-22" width="92" height="62" fill="#F3E2C6" stroke="#3A2A24" stroke-width="2.5"/>
    <path d="M-62 -20 Q0 -44 62 -20 L54 -32 Q0 -60 -54 -32Z" fill="#4A3B36" stroke="#2A201C" stroke-width="2"/>
    <rect x="-14" y="2" width="28" height="38" fill="#8A4B32" stroke="#3A2A24" stroke-width="2"/>
    <rect x="-40" y="-8" width="20" height="18" fill="#FFF6E2" stroke="#3A2A24" stroke-width="2"/><rect x="20" y="-8" width="20" height="18" fill="#FFF6E2" stroke="#3A2A24" stroke-width="2"/>
    <circle cx="-30" cy="22" r="6" fill="#D2463A"/><circle cx="30" cy="22" r="6" fill="#D2463A"/>`,
  office:`<rect x="-52" y="-18" width="104" height="58" fill="#EFE7D6" stroke="#36342F" stroke-width="2.5"/>
    <path d="M-60 -18 L0 -52 L60 -18Z" fill="#A23A3A" stroke="#36342F" stroke-width="2.5"/>
    <g fill="#D9CDB5" stroke="#36342F" stroke-width="2"><rect x="-44" y="-12" width="10" height="52"/><rect x="-22" y="-12" width="10" height="52"/><rect x="12" y="-12" width="10" height="52"/><rect x="34" y="-12" width="10" height="52"/></g>
    <rect x="-8" y="8" width="16" height="32" fill="#6B4A36"/><circle cx="0" cy="-30" r="7" fill="#F3D27A" stroke="#36342F" stroke-width="2"/>`,
  bus:`<rect x="-56" y="-8" width="62" height="40" rx="8" fill="#3E7CC9" stroke="#22344F" stroke-width="2.5"/>
    <g fill="#CFE6F7"><rect x="-50" y="-2" width="14" height="14" rx="2"/><rect x="-32" y="-2" width="14" height="14" rx="2"/><rect x="-14" y="-2" width="14" height="14" rx="2"/></g>
    <circle cx="-40" cy="34" r="7" fill="#22344F"/><circle cx="-6" cy="34" r="7" fill="#22344F"/>
    <rect x="14" y="-30" width="44" height="6" fill="#5B6F8A"/><rect x="18" y="-24" width="36" height="40" fill="#CFE6F7" opacity=".7" stroke="#22344F" stroke-width="2"/>
    <rect x="50" y="-46" width="4" height="86" fill="#22344F"/><circle cx="52" cy="-50" r="11" fill="#2E9C8F" stroke="#22344F" stroke-width="2"/><text x="52" y="-46" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">B</text>`,
  hospital:`<rect x="-40" y="-52" width="80" height="92" fill="#F6FBFB" stroke="#2C4A4F" stroke-width="2.5"/>
    <rect x="-14" y="-46" width="28" height="22" rx="3" fill="#2E9C8F"/><path d="M-3 -43h6v5h5v6h-5v5h-6v-5h-5v-6h5z" fill="#fff"/>
    <g fill="#BFE3E6" stroke="#2C4A4F" stroke-width="1.5"><rect x="-32" y="-18" width="14" height="12"/><rect x="-7" y="-18" width="14" height="12"/><rect x="18" y="-18" width="14" height="12"/><rect x="-32" y="0" width="14" height="12"/><rect x="18" y="0" width="14" height="12"/></g>
    <rect x="-9" y="16" width="18" height="24" fill="#8FC6DE" stroke="#2C4A4F" stroke-width="2"/>`,
  airport:`<rect x="-58" y="-6" width="104" height="46" rx="6" fill="#E7EEF6" stroke="#2D3E57" stroke-width="2.5"/>
    <rect x="-52" y="2" width="92" height="18" fill="#A9CBEA"/><rect x="34" y="-56" width="12" height="52" fill="#E7EEF6" stroke="#2D3E57" stroke-width="2"/>
    <rect x="26" y="-68" width="28" height="14" rx="3" fill="#A9CBEA" stroke="#2D3E57" stroke-width="2"/>
    <g transform="translate(-30 -36) rotate(-14)"><path d="M-22 0 L22 -2 Q30 0 22 3 L-22 4Z" fill="#fff" stroke="#2D3E57" stroke-width="2"/><path d="M-2 0 L-12 -14 L-6 -14 L8 0Z M-2 2 L-12 14 L-6 14 L8 2Z M-20 0 L-26 -8 L-22 -8 L-14 0Z" fill="#fff" stroke="#2D3E57" stroke-width="1.5"/></g>`
};
B.school=`<rect x="-54" y="-24" width="108" height="64" fill="#F5EBDD" stroke="#3B3346" stroke-width="2.5"/>
    <path d="M-62 -24 L0 -54 L62 -24Z" fill="#7A5C9E" stroke="#3B3346" stroke-width="2.5"/>
    <rect x="-40" y="-16" width="80" height="18" rx="3" fill="#FFFFFF" stroke="#3B3346" stroke-width="1.5"/>
    <text x="0" y="-2" text-anchor="middle" font-size="12" font-weight="700" fill="#3B3346">가 나 다</text>
    <g fill="#BFE0EF" stroke="#3B3346" stroke-width="1.5"><rect x="-44" y="8" width="20" height="16"/><rect x="24" y="8" width="20" height="16"/></g>
    <rect x="-10" y="10" width="20" height="30" fill="#8A5A3A" stroke="#3B3346" stroke-width="2"/>
    <rect x="-1" y="-74" width="2" height="22" fill="#3B3346"/><path d="M1 -74 h16 l-4 5 l4 5 h-16z" fill="#C0473A"/>`;
B.bank=`<rect x="-50" y="-26" width="100" height="66" fill="#E9EEF4" stroke="#24364F" stroke-width="2.5"/>
    <rect x="-56" y="-38" width="112" height="14" fill="#2D4F7C"/><text x="0" y="-27" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">은행 BANK</text>
    <g fill="#B9CFE6" stroke="#24364F" stroke-width="1.5"><rect x="-42" y="-14" width="22" height="20"/><rect x="20" y="-14" width="22" height="20"/></g>
    <rect x="-12" y="4" width="24" height="36" fill="#8FC6DE" stroke="#24364F" stroke-width="2"/><text x="-31" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="#2D4F7C">₩</text>`;
B.phone=`<rect x="-46" y="-28" width="92" height="68" rx="4" fill="#F4F4F6" stroke="#23272E" stroke-width="2.5"/>
    <rect x="-52" y="-40" width="104" height="14" rx="3" fill="#23272E"/><text x="0" y="-29" text-anchor="middle" font-size="9.5" font-weight="700" fill="#fff">휴대폰 · 유심</text>
    <rect x="-38" y="-16" width="44" height="40" fill="#CFE6F7" stroke="#23272E" stroke-width="2"/>
    <rect x="-28" y="-10" width="12" height="22" rx="2" fill="#23272E"/><rect x="-12" y="-8" width="12" height="20" rx="2" fill="#3E7CC9"/>
    <rect x="14" y="0" width="24" height="40" fill="#8FC6DE" stroke="#23272E" stroke-width="2"/>`;
B.realestate=`<rect x="-44" y="-22" width="88" height="62" fill="#F3EAD9" stroke="#4A3D30" stroke-width="2.5"/>
    <rect x="-50" y="-36" width="100" height="16" rx="3" fill="#B5462F"/><text x="0" y="-24" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">부동산</text>
    <rect x="-36" y="-12" width="44" height="34" fill="#FFFFFF" stroke="#4A3D30" stroke-width="1.5"/>
    <g fill="#E3D6BE"><rect x="-32" y="-8" width="10" height="7"/><rect x="-19" y="-8" width="10" height="7"/><rect x="-6" y="-8" width="10" height="7"/><rect x="-32" y="3" width="10" height="7"/><rect x="-19" y="3" width="10" height="7"/></g>
    <rect x="14" y="4" width="22" height="36" fill="#7A5A3C" stroke="#4A3D30" stroke-width="2"/>`;
B.market=`<path d="M-62 -12 L-50 -38 L50 -38 L62 -12Z" fill="#2F6E8F" stroke="#1E3F52" stroke-width="2.5"/>
    <g fill="#fff" opacity=".85"><path d="M-46 -36 L-40 -14 L-30 -14 L-34 -36Z"/><path d="M-14 -36 L-12 -14 L-2 -14 L-4 -36Z"/><path d="M18 -36 L20 -14 L30 -14 L26 -36Z"/></g>
    <rect x="-56" y="-12" width="112" height="52" fill="#EAF2F5" stroke="#1E3F52" stroke-width="2.5"/>
    <rect x="-50" y="10" width="100" height="16" rx="3" fill="#9FC9DA" stroke="#1E3F52" stroke-width="1.5"/>
    <g fill="#E58A5C" stroke="#1E3F52" stroke-width="1"><ellipse cx="-30" cy="18" rx="12" ry="5"/><ellipse cx="0" cy="18" rx="12" ry="5"/><ellipse cx="30" cy="18" rx="12" ry="5"/></g>
    <text x="0" y="0" text-anchor="middle" font-size="11" font-weight="700" fill="#1E3F52">자갈치</text>`;
B.jjimjil=`<rect x="-50" y="-30" width="100" height="70" fill="#FBEFF1" stroke="#7A3446" stroke-width="2.5"/>
    <path d="M-56 -30 Q0 -58 56 -30Z" fill="#D97A8A" stroke="#7A3446" stroke-width="2.5"/>
    <g stroke="#D97A8A" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-10 -66 q4 6 0 12 q-4 6 0 12"/><path d="M0 -70 q4 6 0 12 q-4 6 0 12"/><path d="M10 -66 q4 6 0 12 q-4 6 0 12"/></g>
    <text x="0" y="-8" text-anchor="middle" font-size="11" font-weight="700" fill="#7A3446">찜질방</text>
    <rect x="-12" y="6" width="24" height="34" fill="#8A5A3A" stroke="#7A3446" stroke-width="2"/>
    <g fill="#F7D9DE" stroke="#7A3446" stroke-width="1.5"><rect x="-42" y="6" width="20" height="16"/><rect x="22" y="6" width="20" height="16"/></g>`;
B.taxi=`<path d="M-58 20 L-52 -2 Q-48 -14 -34 -16 L30 -16 Q44 -14 50 -2 L58 20 L58 32 L-58 32Z" fill="#E8A33A" stroke="#5A3E14" stroke-width="2.5"/>
    <path d="M-40 -2 L-32 -12 L-4 -12 L-4 -2Z M4 -2 L4 -12 L28 -12 L38 -2Z" fill="#CFE6F7" stroke="#5A3E14" stroke-width="1.5"/>
    <rect x="-14" y="-30" width="28" height="12" rx="3" fill="#FFF3D6" stroke="#5A3E14" stroke-width="1.5"/><text x="0" y="-21" text-anchor="middle" font-size="8" font-weight="700" fill="#5A3E14">TAXI</text>
    <circle cx="-34" cy="34" r="9" fill="#2A2A2A"/><circle cx="34" cy="34" r="9" fill="#2A2A2A"/>
    <text x="0" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="#5A3E14">부산</text>`;
window.buildingSVG=t=>B[t]||B.store;
})();
