(function(){
const PLACES=window.PLACES, S=window.SSK, store=S.store;
const INITIAL=PLACES.map(p=>p.state);
const app=document.getElementById("app");
const el=h=>{const t=document.createElement("template");t.innerHTML=h.trim();return t.content.firstElementChild;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const reduced=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function speak(t){try{const u=new SpeechSynthesisUtterance(t.replace(/○○/g,""));u.lang="ko-KR";u.rate=.9;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}

// ---------- saved progress ----------
let done=new Set(), unitsDone=new Set();
(function(){const s=store.get("ssk_progress3",null);
  if(s&&s.states&&s.states.length===PLACES.length){PLACES.forEach((p,i)=>p.state=s.states[i]);done=new Set(s.done||[]);unitsDone=new Set(s.units||[]);}})();
function save(){store.set("ssk_progress3",{states:PLACES.map(p=>p.state),done:[...done],units:[...unitsDone]});}

let profile=store.get("ssk_profile",null);
let view=profile?"map":"welcome";
let pi=0, line=0, picked=[], bank=[], mistakes=0, lessonI=0, log=[], missionStage="ticket", practiceLogged=false;
let armReset=false, toastTimer=null;
if(profile) S.track("session_start");

// ---------- shared: toast ----------
function toast(msg){
  let t=document.getElementById("toast");
  if(!t){t=el(`<div id="toast" class="toast" role="status"></div>`);document.body.appendChild(t);}
  t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600);
}

// ---------- welcome ----------
function welcome(){
  const draft={nick:"",country:"",level:"",months:""};
  const n=el(`<div class="col">
    <div class="hero">
      <p class="label">For exchange & international students at Sejong</p>
      <h1>세종 생존 한국어</h1>
      <p>A map of the places you'll actually go in Korea. Talk to the people there, learn what they really say, then go do it for real.</p>
      <div class="hero-chars">${["편의점","식당","병원"].map(c=>`<div>${charSVG(PLACES.find(p=>p.code===c).char)}</div>`).join("")}</div>
    </div>
    <form class="panel" id="f" novalidate>
      <div class="field"><label for="nick">Nickname</label><input id="nick" maxlength="20" autocomplete="nickname" placeholder="e.g. Minh"></div>
      <div class="field"><label for="country">Home country</label><input id="country" maxlength="30" placeholder="e.g. Vietnam"></div>
      <div class="field"><label>Your Korean right now</label><div class="seg" data-k="level">
        <button type="button" data-v="none">Almost none</button><button type="button" data-v="beginner">Beginner</button><button type="button" data-v="intermediate">Intermediate</button><button type="button" data-v="advanced">Advanced</button></div></div>
      <div class="field"><label>Time in Korea</label><div class="seg" data-k="months">
        <button type="button" data-v="<1">Under 1 month</button><button type="button" data-v="1-6">1–6 months</button><button type="button" data-v="6-12">6–12 months</button><button type="button" data-v="12+">Over a year</button></div></div>
      <div id="err"></div>
      <button class="act" type="submit">Start the game</button>
      <p class="small">We record how you use the app (which places you finish, which answers you pick) for a class project in 영어와컴퓨터. Only your nickname is collected, no real name or email.</p>
    </form>
  </div>`);
  app.replaceChildren(n);
  app.querySelectorAll(".seg").forEach(seg=>seg.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    seg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");draft[seg.dataset.k]=b.dataset.v;}));
  document.getElementById("f").onsubmit=e=>{
    e.preventDefault();
    draft.nick=document.getElementById("nick").value.trim();
    draft.country=document.getElementById("country").value.trim();
    if(!draft.nick||!draft.level||!draft.months){
      document.getElementById("err").replaceChildren(el(`<div class="note bad">Add a nickname and pick your Korean level and time in Korea.</div>`));return;}
    profile=draft;store.set("ssk_profile",profile);
    S.track("signup","",draft.country);S.track("session_start");
    go("map");
  };
}

// ---------- map ----------
function mapView(){
  const n=PLACES.length, W=360, H=150+n*170;
  const pts=PLACES.map((p,i)=>({x:i%2?250:110,y:110+i*170}));
  let road=`M${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];road+=` C${a.x} ${a.y+95} ${b.x} ${b.y-95} ${b.x} ${b.y}`;}
  const trees=[[30,40],[330,60],[30,250],[330,330],[40,420],[320,520],[34,600],[330,690],[30,790],[330,860],[40,960],[320,1010],[180,40],[180,980]].filter(t=>t[1]<H-20)
    .map(([x,y])=>`<g transform="translate(${x} ${y})"><rect x="-2" y="4" width="4" height="10" fill="var(--trunk)"/><circle r="12" fill="var(--tree)"/></g>`).join("");
  const cur=PLACES.findIndex(p=>p.state==="open");
  const nodes=PLACES.map((p,i)=>{
    const {x,y}=pts[i], locked=p.state==="locked", isDone=p.state==="done";
    const prev=PLACES[i-1];
    return `<g class="bld ${p.state}" data-i="${i}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${p.en}${locked?", locked":""}">
      <ellipse cx="0" cy="44" rx="70" ry="12" fill="var(--plot)"/>
      ${p.state==="open"?`<circle class="ring" cx="0" cy="0" r="74" fill="none" stroke="var(--accent)" stroke-width="3"/>`:""}
      <g class="art">${buildingSVG(p.scene)}</g>
      <g transform="translate(0 66)"><rect x="-62" y="-14" width="124" height="${locked?40:28}" rx="8" fill="var(--sign)" stroke="var(--sign-line)" stroke-width="1.5"/>
        <text y="4" text-anchor="middle" class="sign-ko">${i+1}. ${p.ko}</text>
        ${locked?`<text y="20" text-anchor="middle" class="sign-lock">Finish ${prev.ko} first</text>`:""}</g>
      ${locked?`<g transform="translate(0 -6)" class="lock"><circle r="20" fill="var(--lock-bg)"/><path d="M-7 -2 v-5 a7 7 0 0 1 14 0 v5" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="-10" y="-2" width="20" height="15" rx="3" fill="#fff"/><circle cy="5" r="2.4" fill="var(--lock-bg)"/></g>`:""}
      ${done.has(i)?`<g transform="translate(-52 -50)"><circle r="15" fill="var(--gold)"/><path d="M0 -9 L2.6 -3 L9 -2.8 L4 1.4 L5.6 8 L0 4.4 L-5.6 8 L-4 1.4 L-9 -2.8 L-2.6 -3Z" fill="#fff"/></g>`:""}
      ${isDone?`<g transform="translate(52 -50)"><circle r="15" fill="var(--ok)"/><path d="M-7 0 l5 5 l9 -10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`:""}
      ${i===cur?`<g class="pin" transform="translate(-56 -58)"><path d="M0 22 C-14 6 -14 -14 0 -14 C14 -14 14 6 0 22Z" fill="var(--accent)" stroke="#fff" stroke-width="2"/><text y="3" text-anchor="middle" class="pin-t">${esc((profile.nick||"?")[0].toUpperCase())}</text></g>`:""}
    </g>`;}).join("");
  const cleared=PLACES.filter(p=>p.state==="done").length;
  const v=el(`<div class="col">
    <div class="hud"><div><b class="hud-title">세종 생존 한국어</b><span class="hello">안녕, ${esc(profile.nick)}!</span></div>
      <div class="hud-score"><b>${cleared}<small>/${n}</small></b><span>lessons cleared · ${done.size} real mission${done.size===1?"":"s"}</span></div></div>
    <div class="mapwrap"><svg class="map" viewBox="0 0 ${W} ${H}" aria-label="Map of places">
      <rect width="${W}" height="${H}" fill="var(--grass)"/>
      ${trees}
      <path d="${road}" fill="none" stroke="var(--road)" stroke-width="30" stroke-linecap="round"/>
      <path d="${road}" fill="none" stroke="var(--road-line)" stroke-width="3" stroke-dasharray="10 12"/>
      ${nodes}
    </svg></div>
    <div class="panel">${armReset?`<p style="margin:0;font-weight:700">Reset all ${n} places?</p><div class="row"><button class="act" id="resetyes">Yes, reset</button><button class="act alt" id="resetno">Cancel</button></div>`:`<button class="act alt" id="reset">Reset progress</button>`}</div>
    <div class="foot"><span>A 영어와컴퓨터 class project · Sejong University</span></div>
  </div>`);
  app.replaceChildren(v);
  v.querySelectorAll(".bld").forEach(g=>{
    const open=()=>{const i=+g.dataset.i,p=PLACES[i];
      if(p.state==="locked"){toast(`Locked. Finish ${PLACES[i-1].ko} first to unlock ${p.ko}.`);S.track("locked_tap",p.code);return;}
      pi=i;S.track(p.state==="done"?"place_replay":"place_start",p.code);go(p.kind==="basics"?"units":"intro");};
    g.addEventListener("click",open);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
  const rb=document.getElementById("reset"),ry=document.getElementById("resetyes"),rn=document.getElementById("resetno");
  if(rb) rb.onclick=()=>{armReset=true;render();};
  if(rn) rn.onclick=()=>{armReset=false;render();};
  if(ry) ry.onclick=()=>{armReset=false;done=new Set();unitsDone=new Set();PLACES.forEach((p,i)=>p.state=INITIAL[i]);save();S.track("reset");render();toast("Progress reset. Back to the start.");window.scrollTo({top:0});};
  if(cur>0){const target=v.querySelectorAll(".bld")[cur];setTimeout(()=>{try{target.scrollIntoView({block:"center",behavior:reduced?"auto":"smooth"});}catch(e){}},60);}
}

// ---------- scene stage with talking character ----------
function stage(p,bubbleHTML){
  return `<div class="stage s-${p.scene}">
    <div class="backdrop"></div>
    <div class="npc" id="npc">${charSVG(p.char)}</div>
    <div class="counter"></div>
    <div class="nametag">${p.who}<small>${p.whoEn}</small></div>
    <div class="bubble-npc" id="bub">${bubbleHTML}</div>
  </div>`;
}
let typeTimer=null;
function say(ko,en,ro){
  const bub=document.getElementById("bub"), npc=document.querySelector("#npc .ch");
  if(!bub) return Promise.resolve();
  clearInterval(typeTimer);
  bub.innerHTML=`<div class="ko" id="ko"></div>${ro?`<div class="ro">${ro}</div>`:""}<div class="tools"><button id="rep">▶ Listen</button>${en?`<button id="tr">Translate</button>`:""}</div><div class="en" id="en" hidden>${en||""}</div>`;
  document.getElementById("rep").onclick=()=>{talk(ko);S.track("listen",PLACES[pi].code,ko);};
  const tr=document.getElementById("tr");
  if(tr) tr.onclick=()=>{const e=document.getElementById("en");e.hidden=!e.hidden;if(!e.hidden)S.track("translate",PLACES[pi].code,ko);};
  speak(ko);
  const box=document.getElementById("ko");
  if(npc) npc.classList.add("talking");
  return new Promise(res=>{
    if(reduced){box.textContent=ko;setTimeout(()=>{npc&&npc.classList.remove("talking");res();},400);return;}
    let k=0;typeTimer=setInterval(()=>{k++;box.textContent=ko.slice(0,k);
      if(k>=ko.length){clearInterval(typeTimer);setTimeout(()=>{npc&&npc.classList.remove("talking");res();},450);}},55);
  });
}
function talk(ko){const npc=document.querySelector("#npc .ch");speak(ko);if(npc){npc.classList.add("talking");setTimeout(()=>npc.classList.remove("talking"),Math.max(900,ko.length*120));}}
function react(kind){const npc=document.querySelector("#npc .ch");if(!npc||reduced)return;npc.classList.remove("happy","confused");void npc.offsetWidth;npc.classList.add(kind);}

function sceneShell(p,inner){
  return el(`<div class="col">
    <div class="topbar"><button class="back" id="back">← Map</button><span class="where">${p.ko} · ${p.sub}</span></div>
    ${stage(p,"")}
    ${inner}
  </div>`);
}
function wireBack(){document.getElementById("back").onclick=()=>{
  if(view==="practice"&&line<PLACES[pi].script.length)S.track("place_quit",PLACES[pi].code,"line "+line);go("map");};}

// ---------- intro: teach or practice ----------
function intro(){
  const p=PLACES[pi];
  const v=sceneShell(p,`<div class="panel">
      <div class="note info"><b style="color:var(--ink)">Real talk.</b> ${p.culture}</div>
      <div class="row"><button class="act" id="learn">Teach me first</button><button class="act alt" id="prac">Jump to practice</button></div>
    </div>`);
  app.replaceChildren(v);wireBack();
  say(p.code==="공항"?"안녕하세요! 처음이세요? 먼저 표현 배워 볼까요?":"안녕하세요! 표현 먼저 배워 볼래요?","Hi! Want to learn the key phrases first?");
  document.getElementById("learn").onclick=()=>{lessonI=0;S.track("mode","" + p.code,"learn");go("learn");};
  document.getElementById("prac").onclick=()=>{S.track("mode",p.code,"practice");startPractice();};
}

// ---------- learn ----------
function learn(){
  const p=PLACES[pi], L=p.lesson[lessonI], last=lessonI===p.lesson.length-1;
  const v=sceneShell(p,`<div class="panel">
      <div class="dots">${p.lesson.map((_,i)=>`<i class="${i===lessonI?"on":i<lessonI?"past":""}"></i>`).join("")}</div>
      <p class="label">Phrase ${lessonI+1} of ${p.lesson.length}</p>
      <div class="phrase-en">${L.en}</div>
      <p class="phrase-note">${L.note}</p>
      <div class="row">${lessonI>0?`<button class="act alt" id="prev">Back</button>`:""}<button class="act" id="next">${last?"Let's practice":"Next phrase"}</button></div>
    </div>`);
  app.replaceChildren(v);wireBack();
  say(L.ko,"",L.ro);
  const pv=document.getElementById("prev");if(pv)pv.onclick=()=>{lessonI--;render();};
  document.getElementById("next").onclick=()=>{if(last){S.track("lesson_done",p.code);startPractice();}else{lessonI++;render();}};
}

// ---------- practice ----------
function startPractice(){line=0;picked=[];bank=[];mistakes=0;log=[];practiceLogged=false;missionStage="ticket";go("practice");}
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
  if(!cur){if(prevThem)showBubbleStatic(prevThem);mission();return;}
  if(cur.who==="them"){
    say(cur.ko,cur.en).then(()=>{
      log.push({who:"them",ko:cur.ko});line++;
      const nx=p.script[line];
      if(nx&&nx.who==="me"){renderTurn(nx,turn,true);}
      else{const b=el(`<button class="act" id="cont">${nx?"Continue ▸":"Finish ▸"}</button>`);b.onclick=()=>render();turn.replaceChildren(b);b.focus({preventScroll:true});}
    });
    return;
  }
  if(prevThem)showBubbleStatic(prevThem); else say(p.code==="버스"?"...":"","");
  renderTurn(cur,turn,false);
}
function showBubbleStatic(m){
  const bub=document.getElementById("bub");if(!bub)return;
  bub.innerHTML=`<div class="ko">${m.ko}</div><div class="tools"><button id="rep">▶ Listen</button><button id="tr">Translate</button></div><div class="en" id="en" hidden>${m.en}</div>`;
  document.getElementById("rep").onclick=()=>talk(m.ko);
  document.getElementById("tr").onclick=()=>{const e=document.getElementById("en");e.hidden=!e.hidden;if(!e.hidden)S.track("translate",PLACES[pi].code,m.ko);};
}
function advanceMe(c){log.push({who:"me",ko:myLine(c)});line++;picked=[];bank=[];react("happy");setTimeout(render,reduced?0:550);}

function renderTurn(c,turn){
  turn.replaceChildren(c.type==="build"?buildTurn(c):c.type==="pick"?pickTurn(c):sayTurn(c));
}
function buildTurn(c){
  if(!bank.length) bank=shuffle([...c.answer,...c.extra]);
  const n=el(`<div class="turn"><p class="hint">Your turn · ${c.en}</p><div class="slot" id="slot"></div><div class="bank" id="bk"></div><div id="nt"></div><button class="act" id="send">Say it</button></div>`);
  const draw=()=>{
    const slot=n.querySelector("#slot"),bk=n.querySelector("#bk");slot.innerHTML="";bk.innerHTML="";slot.classList.remove("bad");
    picked.forEach((idx,k)=>{const t=el(`<button class="tile">${bank[idx]}</button>`);t.onclick=()=>{picked.splice(k,1);draw();};slot.appendChild(t);});
    bank.forEach((w,idx)=>{const t=el(`<button class="tile">${w}</button>`);if(picked.includes(idx))t.disabled=true;t.onclick=()=>{picked.push(idx);draw();};bk.appendChild(t);});
    n.querySelector("#send").disabled=!picked.length;
  };
  draw();
  n.querySelector("#send").onclick=()=>{
    const got=picked.map(i=>bank[i]);
    if(got.join(" ")===c.answer.join(" ")){S.track("answer_right",PLACES[pi].code,"build");speak(c.answer.join(" "));advanceMe(c);}
    else{
      mistakes++;const kind=got.some(w=>c.extra.includes(w))?"wrong_word":"word_order";
      S.track("answer_wrong",PLACES[pi].code,kind);react("confused");
      n.querySelector("#slot").classList.add("bad");
      n.querySelector("#nt").replaceChildren(el(`<div class="note bad">${kind==="word_order"?"Right words, wrong order. In Korean the verb comes last.":"One of those words doesn't belong here."} Tap a word to take it back.</div>`));}
  };
  return n;
}
function pickTurn(c){
  const n=el(`<div class="turn"><p class="hint">Your turn · ${c.en}</p><div class="opts" id="op"></div><div id="nt"></div></div>`);
  shuffle(c.options.map((o,i)=>i)).forEach(i=>{const o=c.options[i];const b=el(`<button class="opt">${o}</button>`);b.onclick=()=>{
    if(i===c.answer){S.track("answer_right",PLACES[pi].code,"pick");speak(o);advanceMe(c);}
    else{mistakes++;S.track("answer_wrong",PLACES[pi].code,(c.kinds&&c.kinds[i])||"meaning");react("confused");
      b.classList.add("wrong");n.querySelector("#nt").replaceChildren(el(`<div class="note bad">${(c.notes&&c.notes[i])||"That doesn't fit here. Try another."}</div>`));}
  };n.querySelector("#op").appendChild(b);});
  return n;
}
function sayTurn(c){
  const n=el(`<div class="turn"><p class="hint">Your turn · ${c.en} Say it out loud.</p>
    <div class="sayit"><div>${c.ko}</div><small>${c.ro}</small></div>
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
        else{S.track("speak_miss",PLACES[pi].code,h);n.querySelector("#nt").replaceChildren(el(`<div class="note bad">Heard “${esc(h)}”. Try once more, slower.</div>`));}};
      r.onerror=()=>fallback("Couldn't use the microphone. Say it out loud, then confirm.");
      r.start();n.querySelector("#nt").replaceChildren(el(`<div class="note info">Listening…</div>`));
    }catch(e){fallback("Couldn't use the microphone. Say it out loud, then confirm.");}
  };
  return n;
}

// ---------- real-life mission ----------
function mission(){
  const p=PLACES[pi], next=PLACES[pi+1];
  if(!practiceLogged){S.track("practice_done",p.code,mistakes);practiceLogged=true;react("happy");
    const fresh=p.state!=="done";p.state="done";if(next&&next.state==="locked")next.state="open";save();
    if(fresh&&next)setTimeout(()=>toast(`Lesson cleared! ${next.ko} is now unlocked.`),400);}
  const isDone=done.has(pi)&&missionStage!=="ask";
  let body;
  if(missionStage==="ask"){
    body=`<h2>How did it go?</h2><p>Did the person understand you?</p>
      <div class="opts"><button class="opt" data-r="yes">Yes, first try</button><button class="opt" data-r="partly">Mostly, I had to repeat or point</button><button class="opt" data-r="no">No, I switched to English</button></div>`;
  }else if(isDone){
    body=`<h2>${next?`Mission complete! Next stop: ${next.ko}.`:"Every mission done. 수고했어요!"}</h2><button class="act" id="home">Back to the map</button>`;
  }else{
    body=`<p class="label">Practice done · ${mistakes?`${mistakes} slip${mistakes>1?"s":""}`:"no slips"}</p><h2>${p.mission.title}</h2><p>Say this:</p><div class="say">${p.mission.say}</div><p>${p.mission.tip}</p>
      <div class="row"><button class="act" id="did">I did it</button><button class="act alt" id="later">Not yet, back to map</button></div>
      <button class="back" id="again" style="align-self:center">↺ Practice again</button>`;
  }
  const t=el(`<div class="ticket${isDone?" stamped":""}">
    <div class="stub"><span>REAL-LIFE MISSION · ${p.ko}</span><span>${isDone?"DONE":"TODAY"}</span></div>
    <div class="body">${body}</div></div>`);
  document.getElementById("turn").replaceChildren(t);
  const q=id=>document.getElementById(id);
  if(q("did")){q("did").onclick=()=>{missionStage="ask";mission();};
    q("later").onclick=()=>{S.track("mission_later",p.code);go("map");};
    q("again").onclick=()=>startPractice();}
  t.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{
    S.track("mission_done",p.code,b.dataset.r);missionStage="ticket";done.add(pi);save();mission();});
  if(q("home"))q("home").onclick=()=>go("map");
}


// ---------- 한글 학교 (basics) ----------
let ui=0, uphase="cards", uk=0, uq=0, umiss=0, built={L:null,V:null};
const LJ="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ", VJ="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const compose=(l,v)=>String.fromCharCode(0xAC00+(LJ.indexOf(l)*21+VJ.indexOf(v))*28);
const decompose=ch=>{const c=ch.charCodeAt(0)-0xAC00;return {L:LJ[Math.floor(c/588)],V:VJ[Math.floor((c%588)/28)]};};
function finishBasics(how){
  const p=PLACES[pi], next=PLACES[pi+1], fresh=p.state!=="done";
  p.state="done";if(next&&next.state==="locked")next.state="open";save();
  S.track("basics_done",p.code,how);
  if(fresh&&next)setTimeout(()=>toast(`${p.ko} cleared! ${next.ko} is now unlocked.`),300);
}
function unitsView(){
  const p=PLACES[pi], U=p.units;
  const v=sceneShell(p,`<div class="panel">
      <p class="label">${unitsDone.size} of ${U.length} units done</p>
      <div class="units">${U.map((u,i)=>`<button class="unit ${unitsDone.has(u.id)?"done":""}" data-u="${i}">
        <span class="unum">${i+1}</span><span class="uname"><b>${u.ko}</b><span>${u.en}</span></span>
        <span class="ustate">${unitsDone.has(u.id)?"✓ Done":"Start"}</span></button>`).join("")}</div>
      <div class="note info">${p.culture}</div>
      ${p.state!=="done"?`<button class="act alt" id="skip">I can already read Korean. Skip to the map</button>`:""}
    </div>`);
  app.replaceChildren(v);wireBack();
  say(unitsDone.size?"잘하고 있어요! 계속해 봐요.":"안녕하세요! 저는 한글 선생님이에요.",unitsDone.size?"You're doing great! Let's keep going.":"Hello! I'm your Hangul teacher.");
  v.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{ui=+b.dataset.u;uphase="cards";uk=0;uq=0;umiss=0;built={L:null,V:null};S.track("unit_start",p.code,U[ui].id);go("unit");});
  const sk=document.getElementById("skip");
  if(sk) sk.onclick=()=>{finishBasics("skipped");go("map");};
}
function unitView(){
  const p=PLACES[pi], u=p.units[ui];
  if(uphase==="cards"){
    const c=u.cards[uk], last=uk===u.cards.length-1;
    const v=sceneShell(p,`<div class="panel">
        <div class="dots">${u.cards.map((_,i)=>`<i class="${i===uk?"on":i<uk?"past":""}"></i>`).join("")}</div>
        <p class="label">${u.ko} · ${u.en} · ${uk+1} of ${u.cards.length}</p>
        <div class="bigglyph">${c.big}</div>
        <div class="gsound">${c.sound}</div>
        <p class="phrase-note">${c.note}</p>
        ${c.ex?`<p class="gex">${c.ex}</p>`:""}
        <div class="row">${uk>0?`<button class="act alt" id="prev">Back</button>`:""}<button class="act alt" id="hear">▶ Hear it</button><button class="act" id="next">${last?"Quiz time":"Next"}</button></div>
      </div>`);
    app.replaceChildren(v);wireBack();
    say(uk===0?u.intro:c.say,uk===0?u.introEn:"");
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
    setTimeout(()=>{uq++;built={L:null,V:null};if(uq>=u.quiz.length){uphase="done";unitsDone.add(u.id);save();S.track("unit_done",p.code,u.id+":"+umiss);
      if(unitsDone.size===p.units.length&&p.state!=="done")finishBasics("completed");}render();},reduced?0:600);};
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

function go(v){view=v;render();window.scrollTo({top:0});}
function render(){
  clearInterval(typeTimer);
  ({welcome,map:mapView,intro,learn,practice,units:unitsView,unit:unitView})[view]();
}
render();
})();
