(function(){
const S=window.SSK, store=S.store, CITIES=window.CITIES, BASICS=window.BASICS;
const app=document.getElementById("app");
const el=h=>{const t=document.createElement("template");t.innerHTML=h.trim();return t.content.firstElementChild;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const reduced=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function speak(t){try{const u=new SpeechSynthesisUtterance(String(t).replace(/○○/g,""));u.lang="ko-KR";u.rate=.9;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}

// ---------- romanization (Revised Romanization with the common sound-change rules) ----------
const RI=["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
const RV=["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
const TJ=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const IJ="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const SPLIT={"ㄳ":["ㄱ","ㅅ"],"ㄵ":["ㄴ","ㅈ"],"ㄶ":["ㄴ","ㅎ"],"ㄺ":["ㄹ","ㄱ"],"ㄻ":["ㄹ","ㅁ"],"ㄼ":["ㄹ","ㅂ"],"ㄽ":["ㄹ","ㅅ"],"ㄾ":["ㄹ","ㅌ"],"ㄿ":["ㄹ","ㅍ"],"ㅀ":["ㄹ","ㅎ"],"ㅄ":["ㅂ","ㅅ"]};
const FINAL_SOUND=f=>({"ㄱ":"k","ㄲ":"k","ㅋ":"k","ㄳ":"k","ㄺ":"k","ㄴ":"n","ㄵ":"n","ㄶ":"n","ㄷ":"t","ㅅ":"t","ㅆ":"t","ㅈ":"t","ㅊ":"t","ㅌ":"t","ㅎ":"t","ㄹ":"l","ㄼ":"l","ㄽ":"l","ㄾ":"l","ㅀ":"l","ㅁ":"m","ㄻ":"m","ㅂ":"p","ㅍ":"p","ㅄ":"p","ㄿ":"p","ㅇ":"ng"})[f]||"";
function romWord(w){
  const syl=[...w].map(ch=>{const c=ch.charCodeAt(0)-0xAC00;if(c<0||c>11171)return {raw:ch};return {i:IJ[Math.floor(c/588)],v:Math.floor((c%588)/28),f:TJ[c%28]};});
  for(let k=0;k<syl.length-1;k++){
    const a=syl[k],b=syl[k+1];if(a.raw||b.raw||!a.f)continue;
    if(b.i==="ㅇ"){ // liaison
      if(a.f==="ㅎ"){a.f="";continue;}
      if(a.f==="ㅇ")continue;
      if(SPLIT[a.f]){const [x,y]=SPLIT[a.f];a.f=x;b.i=y==="ㅎ"?"ㅇ":y;continue;}
      b.i=(b.v===20&&a.f==="ㄷ")?"ㅈ":(b.v===20&&a.f==="ㅌ")?"ㅊ":a.f;a.f="";continue;
    }
    if(a.f==="ㅎ"&&"ㄱㄷㅈ".includes(b.i)){b.i={"ㄱ":"ㅋ","ㄷ":"ㅌ","ㅈ":"ㅊ"}[b.i];a.f="";continue;}
    if(b.i==="ㅎ"&&"ㄱㄷㅂㅈㅅㅆㅊㅌ".includes(a.f)){b.i={"ㄱ":"ㅋ","ㄷ":"ㅌ","ㅂ":"ㅍ","ㅈ":"ㅊ","ㅅ":"ㅌ","ㅆ":"ㅌ","ㅊ":"ㅊ","ㅌ":"ㅌ"}[a.f];a.f="";continue;}
    if(b.i==="ㄹ"&&a.f!=="ㄹ"&&a.f!=="ㄴ")b.i="ㄴ";
    if((a.f==="ㄴ"&&b.i==="ㄹ")||(a.f==="ㄹ"&&b.i==="ㄴ")){a.f="ㄹ";b.i="ㄹ";continue;}
    if(b.i==="ㄴ"||b.i==="ㅁ"){const s=FINAL_SOUND(a.f);if(s==="k")a.f="ㅇ";else if(s==="t")a.f="ㄴ";else if(s==="p")a.f="ㅁ";}
  }
  return syl.map((x,k)=>{if(x.raw)return x.raw;
    let ini=RI[IJ.indexOf(x.i)];
    if(x.i==="ㄹ"&&k>0&&syl[k-1].f==="ㄹ")ini="l";
    return ini+RV[x.v]+FINAL_SOUND(x.f);}).join("");
}
const rom=t=>String(t).split(/(\s+)/).map(w=>/[가-힣]/.test(w)?romWord(w):w).join("");
window.HC_ROM=rom;

// ---------- saved progress ----------
let P=store.get("hc_progress",null)||{st:{},missions:[],units:[],wrong:{}};
const save=()=>store.set("hc_progress",P);
const stateOf=p=>P.st[p.code]||(p.code===BASICS.code?"open":"locked");
const setState=(p,s)=>{P.st[p.code]=s;};
const missionDone=p=>P.missions.includes(p.code);
const unitsDone=()=>new Set(P.units);

let profile=store.get("ssk_profile",null);
if(profile&&!profile.role)profile=null; // old sign-ups re-register once for the new questions
let cityId=store.get("hc_city",null);
const city=()=>CITIES.find(c=>c.id===cityId)||CITIES[0];
let PLACES=[];
function setCity(id){cityId=id;store.set("hc_city",id);PLACES=city().places;}
setCity(cityId||(profile&&profile.home==="busan"?"busan":"seoul"));

const LV=()=>(profile&&profile.tested)||"beginner";
const LEVEL={
  beginner:{name:"Beginner",rom:true,autoEn:true,opts:2,timer:0,recommend:"learn"},
  intermediate:{name:"Intermediate",rom:false,autoEn:false,opts:9,timer:0,recommend:"practice"},
  advanced:{name:"Advanced",rom:false,autoEn:false,opts:9,timer:20,recommend:"practice",noTranslate:true}
};
const cfg=()=>LEVEL[LV()];

let view=!profile?"welcome":(!profile.tested?"placeIntro":"map");
let pi=0, line=0, picked=[], bank=[], mistakes=0, lessonI=0, log=[], missionStage="ticket";
let armReset=false, toastTimer=null, turnTimer=null;
if(profile) S.track("session_start","",cityId);

function toast(msg){
  let t=document.getElementById("toast");
  if(!t){t=el(`<div id="toast" class="toast" role="status"></div>`);document.body.appendChild(t);}
  t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800);
}
function seg(name,opts){return `<div class="seg" data-k="${name}">${opts.map(([v,l])=>`<button type="button" data-v="${v}">${l}</button>`).join("")}</div>`;}

// ---------- welcome / sign-up ----------
function welcome(){
  const draft={nick:"",country:"",level:"",months:"",role:"",home:""};
  const seoul=CITIES[0].places;
  const n=el(`<div class="col">
    <div class="hero">
      <p class="label">For foreigners & exchange students in Korea</p>
      <h1>한글 시티 <span class="en-title">Hangul City</span></h1>
      <p>A map of the places you'll actually go in Korea. Talk to the people there, learn what they really say, then go do it for real.</p>
      <div class="hero-chars">${["편의점","식당","병원"].map(c=>`<div>${charSVG(seoul.find(p=>p.code===c).char)}</div>`).join("")}</div>
    </div>
    <form class="panel" id="f" novalidate>
      <div class="field"><label for="nick">Nickname</label><input id="nick" maxlength="20" autocomplete="nickname" placeholder="e.g. Minh"></div>
      <div class="field"><label for="country">Home country</label><input id="country" maxlength="30" placeholder="e.g. Vietnam"></div>
      <div class="field"><label>You are a…</label>${seg("role",[["student","Student"],["worker","Worker"],["other","Other"]])}</div>
      <div class="field"><label>City you live in</label>${seg("home",[["seoul","서울 Seoul"],["busan","부산 Busan"],["incheon","인천"],["daegu","대구"],["daejeon","대전"],["gwangju","광주"],["jeju","제주"],["other","Other"]])}</div>
      <div class="field"><label>Your Korean right now (your guess)</label>${seg("level",[["none","Almost none"],["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]])}</div>
      <div class="field"><label>Time in Korea</label>${seg("months",[["<1","Under 1 month"],["1-6","1–6 months"],["6-12","6–12 months"],["12+","Over a year"]])}</div>
      <div id="err"></div>
      <button class="act" type="submit">Continue</button>
      <p class="small">We record how you use the app (which places you finish, which answers you pick) for a university class project (영어와컴퓨터, Sejong University). Only your nickname is collected, no real name or email.</p>
    </form>
  </div>`);
  app.replaceChildren(n);
  app.querySelectorAll(".seg").forEach(sg=>sg.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    sg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");draft[sg.dataset.k]=b.dataset.v;}));
  document.getElementById("f").onsubmit=e=>{
    e.preventDefault();
    draft.nick=document.getElementById("nick").value.trim();
    draft.country=document.getElementById("country").value.trim();
    if(!draft.nick||!draft.role||!draft.home||!draft.level||!draft.months){
      document.getElementById("err").replaceChildren(el(`<div class="note bad">Fill in your nickname and pick one answer in each row.</div>`));return;}
    profile=draft;store.set("ssk_profile",profile);
    S.track("signup","",JSON.stringify({country:draft.country,role:draft.role,home:draft.home}));S.track("session_start");
    setCity(draft.home==="busan"?"busan":"seoul");
    go("placeIntro");
  };
}

// ---------- placement test ----------
const PLACEMENT=[
  {k:"read",prompt:"버스",q:"What does this word mean?",options:["bus","beer","boss","bread"]},
  {k:"read",prompt:"커피",q:"What does this word mean?",options:["coffee","copy","cup","coupon"]},
  {k:"num",prompt:"15,000원",q:"How do you say this price?",options:["만 오천 원","일만 오천 원","십오천 원","열다섯 천 원"]},
  {k:"num",prompt:"Two people (at a restaurant)",q:"Pick the natural answer.",options:["두 명이요","이 명이요","둘 명이요","두 개요"]},
  {k:"polite",prompt:"A clerk asks if you need a bag. You don't.",q:"What do you say?",options:["아뇨, 괜찮아요","봉투가 필요하지 않습니다","싫어"]},
  {k:"polite",prompt:"Ending an email to your professor.",q:"Which is right?",options:["감사합니다.","고마워!","ㅇㅋ 감사요"]},
  {k:"meaning",prompt:"어떻게 오셨어요?",q:"At an office, this means…",options:["How can I help you?","How did you get here?","How are you?","Where are you from?"]},
  {k:"listen",listen:"덜 맵게 해 주세요",prompt:"Listen.",q:"What did you hear?",options:["Less spicy, please","More spicy, please","It's too spicy","Not spicy at all?"]}
];
let pq=0, pscore=0, porder=[];
function placeIntro(){
  const v=el(`<div class="col">
    <div class="hero"><p class="label">Hi ${esc(profile.nick)}!</p><h1>Quick level check</h1>
      <p>8 short questions, about 2 minutes. Your answers decide where you start on the map and how much help you get.</p>
      <div class="hero-chars"><div>${charSVG(BASICS.char)}</div></div></div>
    <div class="panel"><button class="act" id="go">Take the test</button>
      <button class="act alt" id="beg">I'm a beginner, skip the test</button></div></div>`);
  app.replaceChildren(v);
  document.getElementById("go").onclick=()=>{pq=0;pscore=0;porder=PLACEMENT.map(q=>({...q,order:shuffle(q.options.map((_,i)=>i))}));go("placement");};
  document.getElementById("beg").onclick=()=>{S.track("placement_skip","","beginner");applyLevel("beginner",null);go("map");toast("Welcome! Start at 한글 학교, the first stop on the map.");};
}
function placement(){
  const q=porder[pq];
  const v=el(`<div class="col">
    <div class="topbar"><span class="label">Level check · ${pq+1} of ${porder.length}</span><button class="back" id="quit" style="flex:none">Skip test</button></div>
    <div class="progress"><i style="width:${100*pq/porder.length}%"></i></div>
    <div class="panel">
      ${q.listen?`<button class="act alt" id="play">▶ Play the sentence</button>`:`<div class="${q.prompt.length<10?"bigglyph":"qtext"}">${q.prompt}</div>`}
      <p class="hint">${q.q}</p>
      <div class="opts">${q.order.map(i=>`<button class="opt" data-i="${i}">${q.options[i]}</button>`).join("")}</div>
      <button class="back" id="idk" style="align-self:center">I don't know</button>
    </div></div>`);
  app.replaceChildren(v);
  if(q.listen){setTimeout(()=>speak(q.listen),400);document.getElementById("play").onclick=()=>speak(q.listen);}
  const next=ok=>{if(ok)pscore++;S.track("placement_q","",q.k+":"+(ok?1:0));pq++;if(pq>=porder.length)finishPlacement();else render();};
  v.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>next(+b.dataset.i===0));
  document.getElementById("idk").onclick=()=>next(false);
  document.getElementById("quit").onclick=()=>{S.track("placement_skip","","quit at "+pq);applyLevel("beginner",null);go("map");};
}
function finishPlacement(){
  const lvl=pscore>=7?"advanced":pscore>=4?"intermediate":"beginner";
  const txt={beginner:"You'll start at 한글 학교 with romanization and translations shown.",intermediate:"You can read Korean, so 한글 학교 is skipped. Translations are hidden until you tap.",advanced:"The first three Seoul places are open, there are no hints, and your answers are timed."}[lvl];
  const v=el(`<div class="col"><div class="hero"><p class="label">Your result</p><h1>${pscore}/8 · ${LEVEL[lvl].name}</h1><p>${txt}</p></div>
    <div class="panel"><button class="act" id="ok">Go to the map</button>
    <p class="small">Feels wrong? Pick your level yourself:</p>${seg("lv",[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]])}</div></div>`);
  app.replaceChildren(v);
  S.track("placement","",`${pscore}/8:${lvl}`);
  let chosen=lvl;
  v.querySelectorAll("[data-v]").forEach(b=>{if(b.dataset.v===lvl)b.setAttribute("aria-pressed","true");
    b.onclick=()=>{v.querySelectorAll("[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");chosen=b.dataset.v;};});
  document.getElementById("ok").onclick=()=>{if(chosen!==lvl)S.track("placement_override","",`${lvl}->${chosen}`);applyLevel(chosen,pscore);go("map");};
}
function applyLevel(lvl,score){
  profile.tested=lvl;profile.testScore=score;store.set("ssk_profile",profile);
  if(lvl!=="beginner"){
    if(stateOf(BASICS)!=="done")setState(BASICS,"done");
    CITIES.filter(c=>!c.soon).forEach(c=>{const p=c.places[1];if(p&&stateOf(p)==="locked")setState(p,"open");});
  }
  if(lvl==="advanced")CITIES[0].places.slice(1,4).forEach(p=>{if(stateOf(p)==="locked")setState(p,"open");});
  save();
}

// ---------- map ----------
function unlockNext(p){
  if(p.code===BASICS.code){CITIES.filter(c=>!c.soon).forEach(c=>{const n=c.places[1];if(n&&stateOf(n)==="locked")setState(n,"open");});return c0next();}
  const i=PLACES.indexOf(p), n=PLACES[i+1];
  if(n&&stateOf(n)==="locked"){setState(n,"open");return n;}
  return null;
  function c0next(){return PLACES[1]||null;}
}
function mapView(){
  const n=PLACES.length, W=360, H=150+n*170;
  const pts=PLACES.map((p,i)=>({x:i%2?250:110,y:110+i*170}));
  let road=`M${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];road+=` C${a.x} ${a.y+95} ${b.x} ${b.y-95} ${b.x} ${b.y}`;}
  let trees="";for(let y=40,k=0;y<H-30;y+=85,k++){const x=k%2?28+(k*7%14):332-(k*5%14);const x2=k%3?180:0;
    trees+=`<g transform="translate(${x} ${y})"><rect x="-2" y="4" width="4" height="10" fill="var(--trunk)"/><circle r="12" fill="var(--tree)"/></g>`;
    if(x2&&k%4===1)trees+=`<g transform="translate(${x2} ${y+40})"><circle r="9" fill="var(--tree)"/></g>`;}
  const cur=PLACES.findIndex(p=>stateOf(p)==="open");
  const nodes=PLACES.map((p,i)=>{
    const {x,y}=pts[i], st=stateOf(p), locked=st==="locked", isDone=st==="done";
    const prev=PLACES[i-1];
    return `<g class="bld ${st}" data-i="${i}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${p.en}${locked?", locked":""}">
      <ellipse cx="0" cy="44" rx="70" ry="12" fill="var(--plot)"/>
      ${st==="open"?`<circle class="ring" cx="0" cy="0" r="74" fill="none" stroke="var(--accent)" stroke-width="3"/>`:""}
      <g class="art">${buildingSVG(p.scene)}</g>
      <g transform="translate(0 66)"><rect x="-66" y="-14" width="132" height="${locked?40:28}" rx="8" fill="var(--sign)" stroke="var(--sign-line)" stroke-width="1.5"/>
        <text y="4" text-anchor="middle" class="sign-ko">${i+1}. ${p.ko}</text>
        ${locked?`<text y="20" text-anchor="middle" class="sign-lock">Finish ${prev.ko} first</text>`:""}</g>
      ${locked?`<g transform="translate(0 -6)" class="lock"><circle r="20" fill="var(--lock-bg)"/><path d="M-7 -2 v-5 a7 7 0 0 1 14 0 v5" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="-10" y="-2" width="20" height="15" rx="3" fill="#fff"/><circle cy="5" r="2.4" fill="var(--lock-bg)"/></g>`:""}
      ${missionDone(p)?`<g transform="translate(-52 -50)"><circle r="15" fill="var(--gold)"/><path d="M0 -9 L2.6 -3 L9 -2.8 L4 1.4 L5.6 8 L0 4.4 L-5.6 8 L-4 1.4 L-9 -2.8 L-2.6 -3Z" fill="#fff"/></g>`:""}
      ${isDone?`<g transform="translate(52 -50)"><circle r="15" fill="var(--ok)"/><path d="M-7 0 l5 5 l9 -10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`:""}
      ${i===cur?`<g class="pin" transform="translate(-56 -58)"><path d="M0 22 C-14 6 -14 -14 0 -14 C14 -14 14 6 0 22Z" fill="var(--accent)" stroke="#fff" stroke-width="2"/><text y="3" text-anchor="middle" class="pin-t">${esc((profile.nick||"?")[0].toUpperCase())}</text></g>`:""}
    </g>`;}).join("");
  const cleared=PLACES.filter(p=>stateOf(p)==="done").length, stars=PLACES.filter(missionDone).length;
  const v=el(`<div class="col">
    <div class="hud"><div><b class="hud-title">한글 시티</b><span class="hello">안녕, ${esc(profile.nick)}! · ${cfg().name}</span></div>
      <div class="hud-score"><b>${cleared}<small>/${n}</small></b><span>${city().ko} cleared · ${stars} ★</span></div></div>
    <div class="cities">${CITIES.map(c=>`<button class="city ${c.id===cityId?"on":""} ${c.soon?"soon":""}" data-c="${c.id}">${c.ko}<small>${c.soon?"soon":c.en}</small></button>`).join("")}</div>
    <button class="act compete" id="compete">대결 · Compete with friends</button>
    <div class="mapwrap"><svg class="map" viewBox="0 0 ${W} ${H}" aria-label="Map of ${city().en}">
      <rect width="${W}" height="${H}" fill="var(--grass)"/>${trees}
      <path d="${road}" fill="none" stroke="var(--road)" stroke-width="30" stroke-linecap="round"/>
      <path d="${road}" fill="none" stroke="var(--road-line)" stroke-width="3" stroke-dasharray="10 12"/>
      ${nodes}</svg></div>
    <div class="panel">${armReset?`<p style="margin:0;font-weight:700">Reset all progress in every city?</p><div class="row"><button class="act" id="resetyes">Yes, reset</button><button class="act alt" id="resetno">Cancel</button></div>`
      :`<div class="row"><button class="act alt" id="retest">Retake level check</button><button class="act alt" id="reset">Reset progress</button></div>`}</div>
    <div class="foot"><span>Hangul City · a 영어와컴퓨터 class project</span></div>
  </div>`);
  app.replaceChildren(v);
  v.querySelectorAll(".bld").forEach(g=>{
    const open=()=>{const i=+g.dataset.i,p=PLACES[i];
      if(stateOf(p)==="locked"){toast(`Locked. Finish ${PLACES[i-1].ko} first to unlock ${p.ko}.`);S.track("locked_tap",p.code);return;}
      pi=i;S.track(stateOf(p)==="done"?"place_replay":"place_start",p.code);go(p.kind==="basics"?"units":"intro");};
    g.addEventListener("click",open);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
  v.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{const c=CITIES.find(x=>x.id===b.dataset.c);
    if(c.soon){toast(`${c.ko} ${c.en} is coming later.`);S.track("city_soon_tap","",c.id);return;}
    setCity(c.id);S.track("city_switch","",c.id);render();window.scrollTo({top:0});});
  document.getElementById("compete").onclick=()=>{S.track("rooms_open");go("rooms");};
  // Hidden team door: press and hold the title for 2 s, or tap it 5 times fast.
  const ht=v.querySelector(".hud-title");
  if(ht){let t=null,taps=[];
    const openStats=()=>{try{navigator.vibrate&&navigator.vibrate(40);}catch(e){}location.href="stats.html";};
    const start=()=>{clearTimeout(t);t=setTimeout(openStats,2000);}, stop=()=>{clearTimeout(t);t=null;};
    ht.addEventListener("touchstart",start,{passive:true});ht.addEventListener("touchend",stop);ht.addEventListener("touchmove",stop,{passive:true});
    ht.addEventListener("mousedown",start);ht.addEventListener("mouseup",stop);ht.addEventListener("mouseleave",stop);
    ht.addEventListener("contextmenu",e=>e.preventDefault());
    ht.addEventListener("click",()=>{const now=Date.now();taps=taps.filter(x=>now-x<2500);taps.push(now);if(taps.length>=5){taps=[];openStats();}});}
  const q=id=>document.getElementById(id);
  if(q("reset"))q("reset").onclick=()=>{armReset=true;render();};
  if(q("retest"))q("retest").onclick=()=>{S.track("placement_retake");go("placeIntro");};
  if(q("resetno"))q("resetno").onclick=()=>{armReset=false;render();};
  if(q("resetyes"))q("resetyes").onclick=()=>{armReset=false;P={st:{},missions:[],units:[],wrong:{}};applyLevel(LV(),profile.testScore);S.track("reset");render();toast("Progress reset.");window.scrollTo({top:0});};
  if(cur>0){const target=v.querySelectorAll(".bld")[cur];setTimeout(()=>{try{target.scrollIntoView({block:"center",behavior:reduced?"auto":"smooth"});}catch(e){}},60);}
}

// ---------- scene stage with talking character ----------
function stage(p){
  return `<div class="stage s-${p.scene}"><div class="backdrop"></div>
    <div class="npc" id="npc">${charSVG(p.char)}</div><div class="counter"></div>
    <div class="nametag">${p.who}<small>${p.whoEn}</small></div><div class="bubble-npc" id="bub"></div></div>`;
}
let typeTimer=null;
function bubbleTools(ko,en,showRo){
  const c=cfg(), ro=showRo?(arguments[3]||rom(ko)):"";
  const canTr=en&&!c.noTranslate;
  return `${ro?`<div class="ro">${ro}</div>`:""}<div class="tools"><button id="rep">▶ Listen</button>${canTr&&!c.autoEn?`<button id="tr">Translate</button>`:""}</div>${canTr?`<div class="en" id="en" ${c.autoEn?"":"hidden"}>${en}</div>`:""}`;
}
function wireBubble(ko){
  const rep=document.getElementById("rep");if(rep)rep.onclick=()=>{talk(ko);S.track("listen",PLACES[pi].code,ko);};
  const tr=document.getElementById("tr");if(tr)tr.onclick=()=>{const e=document.getElementById("en");e.hidden=!e.hidden;if(!e.hidden)S.track("translate",PLACES[pi].code,ko);};
}
function say(ko,en,ro){
  const bub=document.getElementById("bub"), npc=document.querySelector("#npc .ch");
  if(!bub) return Promise.resolve();
  clearInterval(typeTimer);
  bub.innerHTML=`<div class="ko" id="ko"></div>${bubbleTools(ko,en,cfg().rom||!!ro,ro)}`;
  wireBubble(ko);speak(ko);
  const box=document.getElementById("ko");
  if(npc) npc.classList.add("talking");
  return new Promise(res=>{
    if(reduced){box.textContent=ko;setTimeout(()=>{npc&&npc.classList.remove("talking");res();},400);return;}
    let k=0;typeTimer=setInterval(()=>{k++;box.textContent=ko.slice(0,k);
      if(k>=ko.length){clearInterval(typeTimer);setTimeout(()=>{npc&&npc.classList.remove("talking");res();},450);}},55);
  });
}
function showBubbleStatic(m){
  const bub=document.getElementById("bub");if(!bub)return;
  bub.innerHTML=`<div class="ko">${m.ko}</div>${bubbleTools(m.ko,m.en,cfg().rom)}`;wireBubble(m.ko);
}
function talk(ko){const npc=document.querySelector("#npc .ch");speak(ko);if(npc){npc.classList.add("talking");setTimeout(()=>npc.classList.remove("talking"),Math.max(900,ko.length*120));}}
function react(kind){const npc=document.querySelector("#npc .ch");if(!npc||reduced)return;npc.classList.remove("happy","confused");void npc.offsetWidth;npc.classList.add(kind);}
function sceneShell(p,inner){
  return el(`<div class="col"><div class="topbar"><button class="back" id="back">← Map</button><span class="where">${p.ko} · ${p.sub}</span></div>${stage(p)}${inner}</div>`);
}
function wireBack(){document.getElementById("back").onclick=()=>{
  if(view==="practice"&&line<PLACES[pi].script.length)S.track("place_quit",PLACES[pi].code,"line "+line);go("map");};}
function photoCard(p,small){
  if(!p.photo)return "";
  return `<figure class="photo ${small?"small":""}"><img src="${p.photo}?v=1" alt="${p.en}, a real one in Korea" loading="lazy" onerror="this.closest('figure').remove()">${small?"":`<figcaption>The real place · ${p.ko}</figcaption>`}</figure>`;
}

// ---------- intro ----------
function intro(){
  const p=PLACES[pi];
  if(p.kind==="basics"){go("units");return;}
  const rec=cfg().recommend;
  const v=sceneShell(p,`${photoCard(p)}<div class="panel">
      <div class="note info"><b style="color:var(--ink)">Real talk.</b> ${p.culture}</div>
      <div class="row"><button class="act ${rec==="learn"?"":"alt"}" id="learn">Teach me first${rec==="learn"?" ★":""}</button><button class="act ${rec==="practice"?"":"alt"}" id="prac">Jump to practice${rec==="practice"?" ★":""}</button></div>
      <p class="small">★ Recommended for your level (${cfg().name})</p>
    </div>`);
  app.replaceChildren(v);wireBack();
  say("안녕하세요! 표현 먼저 배워 볼래요?","Hi! Want to learn the key phrases first?");
  document.getElementById("learn").onclick=()=>{lessonI=0;S.track("mode",p.code,"learn");go("learn");};
  document.getElementById("prac").onclick=()=>{S.track("mode",p.code,"practice");startPractice();};
}
function learn(){
  const p=PLACES[pi], L=p.lesson[lessonI], last=lessonI===p.lesson.length-1;
  const v=sceneShell(p,`<div class="panel">
      <div class="dots">${p.lesson.map((_,i)=>`<i class="${i===lessonI?"on":i<lessonI?"past":""}"></i>`).join("")}</div>
      <p class="label">Phrase ${lessonI+1} of ${p.lesson.length}</p>
      <div class="phrase-en">${L.en}</div><p class="phrase-note">${L.note}</p>
      <div class="row">${lessonI>0?`<button class="act alt" id="prev">Back</button>`:""}<button class="act" id="next">${last?"Let's practice":"Next phrase"}</button></div>
    </div>`);
  app.replaceChildren(v);wireBack();
  say(L.ko,"",L.ro);
  const pv=document.getElementById("prev");if(pv)pv.onclick=()=>{lessonI--;render();};
  document.getElementById("next").onclick=()=>{if(last){S.track("lesson_done",p.code);startPractice();}else{lessonI++;render();}};
}

// ---------- practice ----------
function startPractice(){line=0;picked=[];bank=[];mistakes=0;log=[];missionStage="ticket";go("practice");}
const myLine=m=>m.type==="build"?m.answer.join(" "):m.type==="pick"?m.options[m.answer]:m.ko;
function practice(){
  const p=PLACES[pi], cur=p.script[line];
  const v=sceneShell(p,`<div class="you" id="you" ${log.length&&log[log.length-1].who==="me"?"":"hidden"}><span>You</span><div>${log.length?esc(log[log.length-1].ko):""}</div></div>
    <div id="turn"></div>
    <details class="history"><summary>Conversation so far (${log.length})</summary><div class="hist">${log.map(m=>`<p class="${m.who}"><b>${m.who==="me"?"You":p.who}</b> ${esc(m.ko)}</p>`).join("")}</div></details>
    <div class="progress"><i style="width:${100*line/p.script.length}%"></i></div>`);
  app.replaceChildren(v);wireBack();
  const turn=document.getElementById("turn");
  const prevThem=[...p.script.slice(0,line)].reverse().find(m=>m.who==="them");
  if(!cur){S.track("practice_done",p.code,mistakes);react("happy");startReview();return;}
  if(cur.who==="them"){
    say(cur.ko,cur.en).then(()=>{
      if(view!=="practice"||PLACES[pi]!==p)return;
      log.push({who:"them",ko:cur.ko});line++;
      const nx=p.script[line];
      if(nx&&nx.who==="me")renderTurn(nx,turn);
      else{const b=el(`<button class="act" id="cont">${nx?"Continue ▸":"Finish ▸"}</button>`);b.onclick=()=>render();turn.replaceChildren(b);b.focus({preventScroll:true});}
    });
    return;
  }
  if(prevThem)showBubbleStatic(prevThem);
  renderTurn(cur,turn);
}
function advanceMe(c){clearInterval(turnTimer);log.push({who:"me",ko:myLine(c)});line++;picked=[];bank=[];react("happy");setTimeout(render,reduced?0:550);}
function renderTurn(c,turn){
  turn.replaceChildren(c.type==="build"?buildTurn(c):c.type==="pick"?pickTurn(c):sayTurn(c));
  startTimer(turn);
}
function startTimer(turn){
  clearInterval(turnTimer);const secs=cfg().timer;if(!secs)return;
  const bar=el(`<div class="timer"><i></i></div>`);turn.prepend(bar);
  const t0=Date.now();
  turnTimer=setInterval(()=>{const left=1-(Date.now()-t0)/(secs*1000);
    if(!document.body.contains(bar)){clearInterval(turnTimer);return;}
    bar.firstChild.style.width=Math.max(0,left*100)+"%";
    if(left<=0){clearInterval(turnTimer);mistakes++;S.track("answer_wrong",PLACES[pi].code,"timeout");react("confused");toast("Time's up! That counts as a slip. Try again.");startTimer(turn);bar.remove();}
  },200);
}
function buildTurn(c){
  const extra=cfg().opts<3?c.extra.slice(0,1):c.extra;
  if(!bank.length) bank=shuffle([...c.answer,...extra]);
  const n=el(`<div class="turn"><p class="hint">Your turn · ${c.en}</p><div class="slot" id="slot"></div><div class="bank" id="bk"></div><div id="nt"></div><button class="act" id="send">Say it</button></div>`);
  const draw=()=>{
    const slot=n.querySelector("#slot"),bk=n.querySelector("#bk");slot.innerHTML="";bk.innerHTML="";slot.classList.remove("bad");
    picked.forEach((idx,k)=>{const t=el(`<button class="tile">${bank[idx]}</button>`);t.onclick=()=>{picked.splice(k,1);draw();};slot.appendChild(t);});
    bank.forEach((w,idx)=>{const t=el(`<button class="tile">${w}${cfg().rom?`<small>${rom(w)}</small>`:""}</button>`);if(picked.includes(idx))t.disabled=true;t.onclick=()=>{picked.push(idx);draw();};bk.appendChild(t);});
    n.querySelector("#send").disabled=!picked.length;
  };
  draw();
  n.querySelector("#send").onclick=()=>{
    const got=picked.map(i=>bank[i]);
    if(got.join(" ")===c.answer.join(" ")){S.track("answer_right",PLACES[pi].code,"build");speak(c.answer.join(" "));advanceMe(c);}
    else{mistakes++;const kind=got.some(w=>c.extra.includes(w))?"wrong_word":"word_order";
      S.track("answer_wrong",PLACES[pi].code,kind);react("confused");n.querySelector("#slot").classList.add("bad");
      n.querySelector("#nt").replaceChildren(el(`<div class="note bad">${kind==="word_order"?"Right words, wrong order. In Korean the verb comes last.":"One of those words doesn't belong here."} Tap a word to take it back.</div>`));}
  };
  return n;
}
function pickTurn(c){
  const n=el(`<div class="turn"><p class="hint">Your turn · ${c.en}</p><div class="opts" id="op"></div><div id="nt"></div></div>`);
  let idx=c.options.map((o,i)=>i);
  if(cfg().opts<idx.length){const wrongs=shuffle(idx.filter(i=>i!==c.answer)).slice(0,cfg().opts-1);idx=[c.answer,...wrongs];}
  shuffle(idx).forEach(i=>{const o=c.options[i];const b=el(`<button class="opt">${o}${cfg().rom?`<small>${rom(o)}</small>`:""}</button>`);b.onclick=()=>{
    if(i===c.answer){S.track("answer_right",PLACES[pi].code,"pick");speak(o);advanceMe(c);}
    else{mistakes++;S.track("answer_wrong",PLACES[pi].code,(c.kinds&&c.kinds[i])||"meaning");react("confused");
      b.classList.add("wrong");n.querySelector("#nt").replaceChildren(el(`<div class="note bad">${(c.notes&&c.notes[i])||"That doesn't fit here. Try another."}</div>`));}
  };n.querySelector("#op").appendChild(b);});
  return n;
}
function sayTurn(c){
  const n=el(`<div class="turn"><p class="hint">Your turn · ${c.en} Say it out loud.</p>
    <div class="sayit"><div>${c.ko}</div><small>${c.ro||rom(c.ko)}</small></div>
    <div class="row"><button class="act alt" id="ls">▶ Hear it</button><button class="act alt" id="sp">● Speak</button></div><div id="nt"></div></div>`);
  n.querySelector("#ls").onclick=()=>speak(c.ko);
  const finish=how=>{S.track("speak_done",PLACES[pi].code,how);advanceMe(c);};
  const fallback=msg=>{const nt=n.querySelector("#nt");nt.replaceChildren(el(`<div class="note info">${msg}</div>`));const b=el(`<button class="act" style="margin-top:8px;display:block;width:100%">I said it</button>`);b.onclick=()=>finish("self");nt.appendChild(b);};
  n.querySelector("#sp").onclick=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){fallback("Your browser can't check speech. Say it out loud, then confirm. (Chrome on Android or a laptop can check it.)");return;}
    try{const r=new SR();r.lang="ko-KR";
      r.onresult=e=>{const h=e.results[0][0].transcript;const norm=s=>s.replace(/[\s~.!?,]/g,"");
        if(norm(h).includes(norm(c.ko)))finish("recognized");
        else{S.track("speak_miss",PLACES[pi].code,h);n.querySelector("#nt").replaceChildren(el(`<div class="note bad">Heard “${esc(h)}”. Try once more, slower.</div>`));
          const b=el(`<button class="back" style="margin-top:6px">Skip, I said it</button>`);b.onclick=()=>finish("self_after_miss");n.querySelector("#nt").appendChild(b);}};
      r.onerror=()=>fallback("Couldn't use the microphone. Say it out loud, then confirm.");
      r.start();n.querySelector("#nt").replaceChildren(el(`<div class="note info">Listening…</div>`));
    }catch(e){fallback("Couldn't use the microphone. Say it out loud, then confirm.");}
  };
  return n;
}

// ---------- review quiz ----------
function itemsOf(p){
  const out=[];
  (p.lesson||[]).forEach((L,i)=>{if(!/○○/.test(L.ko+L.en))out.push({id:`${p.code}:L${i}`,place:p.code,ko:L.ko,en:L.en});});
  (p.script||[]).forEach((m,i)=>{
    if(m.who==="them"&&!/\(Busan/.test(m.en))out.push({id:`${p.code}:T${i}`,place:p.code,ko:m.ko,en:m.en});
    if(m.type==="pick")out.push({id:`${p.code}:P${i}`,place:p.code,en:m.en,options:m.options,answer:m.answer,notes:m.notes});
  });
  return out;
}
window.HC_ITEMS=()=>CITIES.filter(c=>!c.soon).flatMap(c=>c.places.filter(p=>p.kind!=="basics").flatMap(itemsOf));
function makeQuestion(item,pool,nopts){
  if(item.options){
    let idx=item.options.map((_,i)=>i);
    if(nopts<idx.length)idx=[item.answer,...shuffle(idx.filter(i=>i!==item.answer)).slice(0,nopts-1)];
    return {item,qtype:"polite",prompt:item.en,ask:"Which is the natural thing to say?",options:shuffle(idx).map(i=>({t:item.options[i],ok:i===item.answer,note:item.notes&&item.notes[i]}))};
  }
  const types=["meaning","listen","say"];const qtype=types[Math.floor(Math.random()*3)];
  const field=qtype==="say"?"ko":"en";
  const others=shuffle(pool.filter(x=>!x.options&&x[field]&&x[field]!==item[field]&&!/○○/.test(x[field]))).map(x=>x[field]);
  const uniq=[...new Set(others)].slice(0,nopts-1);
  const options=shuffle([{t:item[field],ok:true},...uniq.map(t=>({t,ok:false}))]);
  if(qtype==="say")return {item,qtype,prompt:item.en,ask:"How do you say this in Korean?",options};
  if(qtype==="listen")return {item,qtype,prompt:"",listen:item.ko,ask:"What does it mean?",options};
  return {item,qtype,prompt:item.ko,ask:"What does it mean?",options};
}
let RQ=[], rqi=0, rscore=0, ranswered=false;
function startReview(){
  const p=PLACES[pi];
  const pool=window.HC_ITEMS();
  const weight=x=>(P.wrong[x.id]||0)*2+Math.random();
  const curItems=itemsOf(p).sort((a,b)=>weight(b)-weight(a));
  const earlier=PLACES.slice(0,pi).filter(x=>x.kind!=="basics"&&stateOf(x)==="done").flatMap(itemsOf).sort((a,b)=>weight(b)-weight(a));
  const pickN=Math.min(4,earlier.length);
  const chosen=[...curItems.slice(0,8-pickN),...earlier.slice(0,pickN)];
  const nopts=cfg().opts<3?3:4;
  RQ=shuffle(chosen).map(it=>makeQuestion(it,pool,nopts));rqi=0;rscore=0;ranswered=false;
  S.track("quiz_start",p.code,`${RQ.length}:${pickN} earlier`);
  go("review");
}
window.HC_TEST={answers:()=>RQ.map(q=>q.options.findIndex(o=>o.ok))};
function review(){
  const p=PLACES[pi];
  if(rqi>=RQ.length){reviewResult();return;}
  const q=RQ[rqi];
  const v=sceneShell(p,`<div class="turn">
      <div class="dots">${RQ.map((_,i)=>`<i class="${i===rqi?"on":i<rqi?"past":""}"></i>`).join("")}</div>
      <p class="label">Review quiz · ${rqi+1} of ${RQ.length}${q.item.place!==p.code?` · from ${PLACES.find(x=>x.code===q.item.place)?.ko||q.item.place}`:""}</p>
      ${q.listen?`<button class="act alt" id="play">▶ Play again</button>`:`<div class="qtext">${q.prompt}</div>`}
      <p class="hint">${q.ask}</p>
      <div class="opts" id="op"></div><div id="nt"></div></div>`);
  app.replaceChildren(v);wireBack();
  say(rqi===0?"복습 퀴즈! 할 수 있어요!":"다음 문제!",rqi===0?"Review quiz! You can do it!":"Next question!");
  if(q.listen){setTimeout(()=>speak(q.listen),900);document.getElementById("play").onclick=()=>speak(q.listen);}
  ranswered=false;
  q.options.forEach(o=>{const b=el(`<button class="opt">${o.t}${cfg().rom&&/[가-힣]/.test(o.t)?`<small>${rom(o.t)}</small>`:""}</button>`);
    b.onclick=()=>{if(ranswered)return;ranswered=true;
      const ok=o.ok, id=q.item.id;
      P.wrong[id]=Math.max(0,(P.wrong[id]||0)+(ok?-1:1));save();
      S.track("quiz_answer",p.code,`${q.item.place}:${ok?1:0}:${q.qtype}`);
      v.querySelectorAll(".opt").forEach((x,k)=>{if(q.options[k].ok)x.classList.add("right");});
      if(ok){rscore++;react("happy");if(/[가-힣]/.test(o.t))speak(o.t);}
      else{b.classList.add("wrong");react("confused");}
      const nt=document.getElementById("nt");
      nt.replaceChildren(el(`<div class="note ${ok?"info":"bad"}">${ok?"Correct!":(o.note||"Not this one. The right answer is highlighted. It'll come back in a later quiz.")}</div>`));
      const nb=el(`<button class="act" style="display:block;width:100%;margin-top:8px">${rqi===RQ.length-1?"See result":"Next"}</button>`);nb.onclick=()=>{rqi++;render();};nt.appendChild(nb);
    };
    document.getElementById("op").appendChild(b);});
}
function reviewResult(){
  const p=PLACES[pi], need=Math.ceil(RQ.length*0.7), pass=rscore>=need;
  S.track("quiz_done",p.code,`${rscore}/${RQ.length}:${pass?"pass":"fail"}`);
  let next=null;
  if(pass){const fresh=stateOf(p)!=="done";setState(p,"done");next=unlockNext(p);save();if(fresh&&next)setTimeout(()=>toast(`${p.ko} cleared! ${next.ko} is now unlocked.`),400);}
  const v=sceneShell(p,`<div class="ticket ${pass?"stamped":""}"><div class="stub"><span>REVIEW QUIZ · ${p.ko}</span><span>${pass?"PASSED":"TRY AGAIN"}</span></div>
    <div class="body"><h2>${rscore} / ${RQ.length} correct</h2>
    <p>${pass?"Great memory. Now try it in real life.":`You need ${need} to pass. Questions you missed come back more often.`}</p>
    <div class="row">${pass?`<button class="act" id="tomission">Real-life mission</button>`:`<button class="act" id="retry">New quiz</button><button class="act alt" id="repr">Practice again</button>`}</div></div></div>`);
  app.replaceChildren(v);wireBack();
  say(pass?"잘했어요!":"괜찮아요, 다시 해 봐요!",pass?"Well done!":"It's okay, let's try again!");
  const q=id=>document.getElementById(id);
  if(q("tomission"))q("tomission").onclick=()=>{missionStage="ticket";go("missionView");};
  if(q("retry"))q("retry").onclick=()=>startReview();
  if(q("repr"))q("repr").onclick=()=>startPractice();
}

// ---------- real-life mission ----------
function missionView(){
  const p=PLACES[pi], next=PLACES[pi+1];
  const away=p.travel&&profile.home!==cityId;
  const isDone=missionDone(p)&&missionStage!=="ask";
  let body;
  if(missionStage==="ask"){
    body=`<h2>How did it go?</h2><p>Did the person understand you?</p>
      <div class="opts"><button class="opt" data-r="yes">Yes, first try</button><button class="opt" data-r="partly">Mostly, I had to repeat or point</button><button class="opt" data-r="no">No, I switched to English</button></div>`;
  }else if(isDone){
    body=`<h2>${next?`Mission complete! Next stop: ${next.ko}.`:"Every mission here done. 수고했어요!"}</h2><button class="act" id="home">Back to the map</button>`;
  }else{
    body=`${photoCard(p,true)}<h2>${p.mission.title}</h2><p>Say this:</p><div class="say">${p.mission.say}</div>${cfg().rom?`<p class="ro">${rom(p.mission.say)}</p>`:""}<p>${p.mission.tip}</p>
      <div class="row"><button class="act" id="did">I did it</button><button class="act alt" id="later">${away?"Save for my trip":"Not yet, back to map"}</button></div>
      <button class="back" id="again" style="align-self:center">↺ Practice again</button>`;
  }
  const v=sceneShell(p,`<div class="ticket${isDone?" stamped":""}"><div class="stub"><span>${away?"TRAVEL MISSION":"REAL-LIFE MISSION"} · ${p.ko}</span><span>${isDone?"DONE":away?"NEXT TRIP":"TODAY"}</span></div><div class="body">${body}</div></div>`);
  app.replaceChildren(v);wireBack();
  const q=id=>document.getElementById(id);
  if(q("did")){q("did").onclick=()=>{missionStage="ask";render();};
    q("later").onclick=()=>{S.track("mission_later",p.code,away?"away":"");go("map");};
    q("again").onclick=()=>startPractice();}
  v.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{
    S.track("mission_done",p.code,b.dataset.r+(away?":away":""));missionStage="ticket";if(!P.missions.includes(p.code))P.missions.push(p.code);save();render();});
  if(q("home"))q("home").onclick=()=>go("map");
}

// ---------- 한글 학교 (basics) ----------
let ui=0, uphase="cards", uk=0, uq=0, umiss=0, built={L:null,V:null};
const LJ="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ", VJ="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const compose=(l,v)=>String.fromCharCode(0xAC00+(LJ.indexOf(l)*21+VJ.indexOf(v))*28);
const decompose=ch=>{const c=ch.charCodeAt(0)-0xAC00;return {L:LJ[Math.floor(c/588)],V:VJ[Math.floor((c%588)/28)]};};
function finishBasics(how){
  const fresh=stateOf(BASICS)!=="done";setState(BASICS,"done");const next=unlockNext(BASICS);save();
  S.track("basics_done",BASICS.code,how);
  if(fresh&&next)setTimeout(()=>toast(`${BASICS.ko} cleared! ${next.ko} is now unlocked.`),300);
}
function unitsView(){
  const p=BASICS, U=p.units, ud=unitsDone();
  const v=sceneShell(p,`<div class="panel">
      <p class="label">${ud.size} of ${U.length} units done</p>
      <div class="units">${U.map((u,i)=>`<button class="unit ${ud.has(u.id)?"done":""}" data-u="${i}">
        <span class="unum">${i+1}</span><span class="uname"><b>${u.ko}</b><span>${u.en}</span></span>
        <span class="ustate">${ud.has(u.id)?"✓ Done":"Start"}</span></button>`).join("")}</div>
      <div class="note info">${p.culture}</div>
      ${stateOf(p)!=="done"?`<button class="act alt" id="skip">I can already read Korean. Skip to the map</button>`:""}
    </div>`);
  app.replaceChildren(v);wireBack();
  say(ud.size?"잘하고 있어요! 계속해 봐요.":"안녕하세요! 저는 한글 선생님이에요.",ud.size?"You're doing great! Let's keep going.":"Hello! I'm your Hangul teacher.");
  v.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{ui=+b.dataset.u;uphase="cards";uk=0;uq=0;umiss=0;built={L:null,V:null};S.track("unit_start",p.code,U[ui].id);go("unit");});
  const sk=document.getElementById("skip");
  if(sk) sk.onclick=()=>{finishBasics("skipped");go("map");};
}
function unitView(){
  const p=BASICS, u=p.units[ui];
  if(uphase==="cards"){
    const c=u.cards[uk], last=uk===u.cards.length-1;
    const v=sceneShell(p,`<div class="panel">
        <div class="dots">${u.cards.map((_,i)=>`<i class="${i===uk?"on":i<uk?"past":""}"></i>`).join("")}</div>
        <p class="label">${u.ko} · ${u.en} · ${uk+1} of ${u.cards.length}</p>
        <div class="bigglyph">${c.big}</div><div class="gsound">${c.sound}</div>
        <p class="phrase-note">${c.note}</p>${c.ex?`<p class="gex">${c.ex}</p>`:""}
        <div class="row">${uk>0?`<button class="act alt" id="prev">Back</button>`:""}<button class="act alt" id="hear">▶ Hear it</button><button class="act" id="next">${last?"Quiz time":"Next"}</button></div>
      </div>`);
    app.replaceChildren(v);wireBack();
    say(uk===0?u.intro:c.say,uk===0?u.introEn:"",uk===0?"":c.sound);
    if(uk===0)setTimeout(()=>{if(view==="unit"&&uphase==="cards"&&uk===0)talk(c.say);},1600);
    document.getElementById("hear").onclick=()=>talk(c.say);
    const pv=document.getElementById("prev");if(pv)pv.onclick=()=>{uk--;render();};
    document.getElementById("next").onclick=()=>{if(last){uphase="quiz";uq=0;}else uk++;render();};
    return;
  }
  if(uphase==="done"){
    const v=sceneShell(p,`<div class="ticket stamped"><div class="stub"><span>${u.ko} · ${u.en}</span><span>DONE</span></div>
      <div class="body"><h2>Unit complete${umiss?` · ${umiss} slip${umiss>1?"s":""}`:" · perfect"}</h2>
      <div class="row"><button class="act" id="back2">Back to 한글 학교</button></div></div></div>`);
    app.replaceChildren(v);wireBack();react("happy");
    say(umiss?"잘했어요!":"완벽해요!",umiss?"Well done!":"Perfect!");
    document.getElementById("back2").onclick=()=>go("units");
    return;
  }
  const q=u.quiz[uq];
  const v=sceneShell(p,`<div class="turn"><div class="dots">${u.quiz.map((_,i)=>`<i class="${i===uq?"on":i<uq?"past":""}"></i>`).join("")}</div><div id="qbox"></div><div id="nt"></div></div>`);
  app.replaceChildren(v);wireBack();
  const box=document.getElementById("qbox"), nt=document.getElementById("nt");
  const right=()=>{S.track("basics_right",p.code,u.id);react("happy");
    setTimeout(()=>{uq++;built={L:null,V:null};if(uq>=u.quiz.length){uphase="done";if(!P.units.includes(u.id))P.units.push(u.id);save();S.track("unit_done",p.code,u.id+":"+umiss);
      if(P.units.length>=p.units.length&&stateOf(p)!=="done")finishBasics("completed");}render();},reduced?0:600);};
  const wrong=msg=>{umiss++;S.track("basics_wrong",p.code,u.id);react("confused");nt.replaceChildren(el(`<div class="note bad">${msg}</div>`));};
  if(q.type==="pick"){
    box.innerHTML=`${q.speak?`<p class="hint">${q.prompt}</p><button class="act alt" id="play" style="display:block">▶ Play again</button>`:`<p class="hint">${/[가-힣ㄱ-ㅣ0-9]/.test(q.prompt)&&q.prompt.length<12?"What is this?":"Which one fits?"}</p><div class="${q.prompt.length<12?"bigglyph":"qtext"}">${q.prompt}</div>`}<div class="opts grid2opts" id="op"></div>`;
    say(q.speak?"잘 들어 보세요.":"이거 뭐예요?",q.speak?"Listen carefully.":"What's this?");
    if(q.speak){setTimeout(()=>speak(q.speak),900);document.getElementById("play").onclick=()=>speak(q.speak);}
    shuffle(q.options.map((o,i)=>i)).forEach(i=>{const b=el(`<button class="opt">${q.options[i]}</button>`);
      b.onclick=()=>{if(i===q.answer){b.classList.add("right");if(/[가-힣]/.test(q.options[i]))speak(q.options[i]);right();}else{b.classList.add("wrong");wrong("Not quite. Try another.");}};
      document.getElementById("op").appendChild(b);});
  }else{
    const t=decompose(q.target), Ls=["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅎ"], Vs=["ㅏ","ㅓ","ㅗ","ㅜ","ㅡ","ㅣ"];
    const draw=()=>{
      const shown=built.L&&built.V?compose(built.L,built.V):(built.L||"")+(built.V||"");
      box.innerHTML=`<p class="hint">${q.prompt}</p><div class="bigglyph builtg">${shown||"&nbsp;"}</div>
        <p class="label">Consonant</p><div class="bank">${Ls.map(l=>`<button class="tile ${built.L===l?"sel":""}" data-l="${l}">${l}</button>`).join("")}</div>
        <p class="label">Vowel</p><div class="bank">${Vs.map(x=>`<button class="tile ${built.V===x?"sel":""}" data-v="${x}">${x}</button>`).join("")}</div>
        <button class="act" id="chk" ${built.L&&built.V?"":"disabled"}>Check</button>`;
      box.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{built.L=b.dataset.l;draw();});
      box.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{built.V=b.dataset.v;draw();if(built.L)speak(compose(built.L,built.V));});
      document.getElementById("chk").onclick=()=>{
        if(built.L===t.L&&built.V===t.V){speak(q.target);right();}
        else wrong(built.L!==t.L?"Check the consonant. Listen to the sound again.":"Close! The vowel is off.");
      };
    };
    say("만들어 보세요!","Build it!");draw();
  }
}

// ---------- competition rooms ----------
function rooms(){
  if(!window.HCRooms){app.replaceChildren(el(`<div class="col"><div class="note bad">Rooms failed to load. Refresh the page.</div></div>`));return;}
  window.HCRooms.render(app,{el,esc,shuffle,speak,toast,track:S.track,profile,uid:S.uid(),
    questions:n=>{const pool=window.HC_ITEMS();const sel=shuffle(pool.filter(x=>CITIES.find(c=>c.id===cityId).places.some(p=>p.code===x.place))).slice(0,n);
      return sel.map(it=>{const q=makeQuestion(it,pool,4);return {prompt:q.listen||q.prompt,ask:q.ask,listen:!!q.listen,qtype:q.qtype,options:q.options.map(o=>o.t),answer:q.options.findIndex(o=>o.ok)};});},
    back:()=>go("map")});
}

function go(v){view=v;render();window.scrollTo({top:0});}
function render(){
  clearInterval(typeTimer);clearInterval(turnTimer);
  ({welcome,placeIntro,placement,map:mapView,intro,learn,practice,review,missionView,units:unitsView,unit:unitView,rooms})[view]();
}
render();
})();
