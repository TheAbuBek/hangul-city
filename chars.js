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
  lanyard:()=>``, cap:()=>``, glasses:()=>``, nursecap:()=>``
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
window.buildingSVG=t=>B[t]||B.store;
})();
