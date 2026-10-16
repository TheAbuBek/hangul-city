// Competition rooms (Kahoot-style). Host creates a room, players join with a 4-digit code.
// Live data goes through Firebase Realtime Database (config in config.js: window.HC_FIREBASE).
// Add ?localrooms to the URL to test on one computer with several tabs (no Firebase needed).
(function(){
const FB_VER="10.12.2", QTIME=15000, QCOUNT=10;

function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("Couldn't load "+src));document.head.appendChild(s);});}
async function firebaseAdapter(cfg){
  if(!window.firebase||!firebase.database){
    await loadScript(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-app-compat.js`);
    await loadScript(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-database-compat.js`);
  }
  const fbApp=firebase.apps.length?firebase.app():firebase.initializeApp(cfg);
  const db=firebase.database(fbApp);
  let offset=0;db.ref(".info/serverTimeOffset").on("value",s=>offset=s.val()||0);
  return {
    get:async p=>(await db.ref(p).get()).val(),
    set:(p,v)=>db.ref(p).set(v),
    update:(p,o)=>db.ref(p).update(o),
    watch:(p,cb)=>{const r=db.ref(p);const f=s=>cb(s.val());r.on("value",f);return ()=>r.off("value",f);},
    now:()=>Date.now()+offset,
    onDisconnectRemove:p=>{try{db.ref(p).onDisconnect().remove();}catch(e){}}
  };
}
function localAdapter(){
  const K="hc_localrooms", listeners=new Set();
  const read=()=>{try{return JSON.parse(localStorage.getItem(K))||{};}catch(e){return {};}};
  const write=o=>{localStorage.setItem(K,JSON.stringify(o));listeners.forEach(l=>l());};
  const getAt=(o,p)=>p.split("/").reduce((a,k)=>a==null?a:a[k],o);
  const setAt=(o,p,v)=>{const ks=p.split("/");let a=o;for(let i=0;i<ks.length-1;i++){if(typeof a[ks[i]]!=="object"||a[ks[i]]===null)a[ks[i]]={};a=a[ks[i]];}
    if(v===null)delete a[ks[ks.length-1]];else a[ks[ks.length-1]]=v;};
  window.addEventListener("storage",e=>{if(e.key===K)listeners.forEach(l=>l());});
  return {
    get:async p=>{const v=getAt(read(),p);return v===undefined?null:v;},
    set:async(p,v)=>{const o=read();setAt(o,p,v===null?null:JSON.parse(JSON.stringify(v)));write(o);},
    update:async(p,obj)=>{const o=read();for(const k in obj)setAt(o,p+"/"+k,obj[k]===null?null:JSON.parse(JSON.stringify(obj[k])));write(o);},
    watch:(p,cb)=>{const l=()=>{const v=getAt(read(),p);cb(v===undefined?null:v);};listeners.add(l);setTimeout(l,0);return ()=>listeners.delete(l);},
    now:()=>Date.now(),
    onDisconnectRemove:()=>{}
  };
}

let db=null, unsub=null, code=null, room=null, isHost=false, tick=null, revealing=-1, lastPlayed=-1, ended=false;
let A=null, root=null;

function leave(){
  if(unsub)unsub();unsub=null;clearInterval(tick);tick=null;
  if(db&&code&&room&&room.state==="lobby"&&!isHost)db.set(`rooms/${code}/players/${A.uid}`,null);
  code=null;room=null;isHost=false;revealing=-1;lastPlayed=-1;ended=false;
}
async function getDB(){
  if(db)return db;
  if(/localrooms/.test(location.search)){db=localAdapter();return db;}
  if(!window.HC_FIREBASE)throw new Error("not-configured");
  db=await firebaseAdapter(window.HC_FIREBASE);return db;
}

function render(appEl,api){
  A=api;root=appEl;
  const as=/localrooms/.test(location.search)&&new URLSearchParams(location.search).get("as");
  if(as)A={...api,uid:"test_"+as,profile:{...api.profile,nick:as}}; // test-only: pretend to be another player
  if(!code)home();else draw();
}
function shell(inner){
  return A.el(`<div class="col rooms">
    <div class="topbar"><button class="back" id="rback">← Map</button><span class="where">대결 · Compete</span></div>
    ${inner}</div>`);
}
function wireBack(){document.getElementById("rback").onclick=()=>{leave();A.back();};}

function home(){
  const v=shell(`<div class="hero"><p class="label">Live game</p><h1>대결 Compete</h1>
      <p>Everyone answers the same questions at the same time. Faster correct answers score more points. Best with 3 or more people, in class or with friends.</p></div>
    <div class="panel"><button class="act" id="host">Host a room</button></div>
    <form class="panel" id="jf"><div class="field"><label for="jcode">Join with a code</label>
      <input id="jcode" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="4-digit code" autocomplete="off"></div>
      <div id="jerr"></div><button class="act alt" type="submit">Join</button></form>`);
  root.replaceChildren(v);wireBack();
  document.getElementById("host").onclick=hostRoom;
  document.getElementById("jf").onsubmit=e=>{e.preventDefault();joinRoom(document.getElementById("jcode").value.trim());};
}
function errorBox(msg){const b=document.getElementById("jerr")||document.querySelector(".rooms .panel");if(b)b.replaceChildren(A.el(`<div class="note bad">${msg}</div>`));}
function setupMsg(e){return e&&e.message==="not-configured"?"Rooms aren't switched on yet. The team still needs to connect the live database.":"Couldn't connect. Check your internet and try again.";}

async function hostRoom(){
  let d;try{d=await getDB();}catch(e){errorBox(setupMsg(e));return;}
  let c=null;
  for(let k=0;k<8;k++){const t=String(1000+Math.floor(Math.random()*9000));const ex=await d.get(`rooms/${t}`);
    if(!ex||ex.state==="end"||(d.now()-(ex.created||0))>3*3600e3){c=t;break;}}
  if(!c){errorBox("Couldn't find a free room code. Try again.");return;}
  const qs=A.questions(QCOUNT);
  await d.set(`rooms/${c}`,{host:A.uid,created:d.now(),state:"lobby",qi:-1,qStart:0,questions:qs,
    players:{[A.uid]:{nick:A.profile.nick,score:0}}});
  isHost=true;A.track("room_host","",c);attach(c);
}
async function joinRoom(c){
  if(!/^\d{4}$/.test(c)){errorBox("Enter the 4-digit code from the host's screen.");return;}
  let d;try{d=await getDB();}catch(e){errorBox(setupMsg(e));return;}
  const r=await d.get(`rooms/${c}`);
  if(!r){errorBox("No room with that code. Check the number with the host.");return;}
  if(r.state!=="lobby"&&!(r.players&&r.players[A.uid])){errorBox("That game already started. Ask the host to make a new room.");return;}
  await d.update(`rooms/${c}/players/${A.uid}`,{nick:A.profile.nick,score:(r.players&&r.players[A.uid]&&r.players[A.uid].score)||0});
  d.onDisconnectRemove(`rooms/${c}/players/${A.uid}`);
  isHost=r.host===A.uid;A.track("room_join","",c);attach(c);
}
function attach(c){
  code=c;
  unsub=db.watch(`rooms/${c}`,r=>{room=r;if(!r){A.toast("The room was closed.");leave();home();return;}if(isHost)hostLogic();draw();});
  clearInterval(tick);tick=setInterval(()=>{if(!room)return;if(isHost)hostLogic();const bar=document.getElementById("rtime");
    if(bar&&room.state==="question"){const left=1-(db.now()-room.qStart)/QTIME;bar.style.width=Math.max(0,left*100)+"%";}},250);
}
const playersOf=r=>Object.entries((r&&r.players)||{}).map(([id,p])=>({id,...p}));
const ranked=r=>playersOf(r).sort((a,b)=>(b.score||0)-(a.score||0));

async function hostLogic(){
  const r=room;if(!r||!isHost)return;
  if(r.state==="question"&&revealing!==r.qi){
    const ans=(r.answers&&r.answers[r.qi])||{}, n=playersOf(r).length;
    if(Object.keys(ans).length>=n||db.now()-r.qStart>QTIME+500){
      revealing=r.qi;const q=r.questions[r.qi], upd={state:"reveal"};
      playersOf(r).forEach(p=>{const a=ans[p.id];let pts=0;
        if(a&&a.c===q.answer)pts=Math.round(500+500*Math.max(0,1-a.ms/QTIME));
        upd[`results/${r.qi}/${p.id}`]=pts;upd[`players/${p.id}/score`]=(p.score||0)+pts;});
      await db.update(`rooms/${code}`,upd);
    }
  }
}
async function hostStart(){await db.update(`rooms/${code}`,{state:"question",qi:0,qStart:db.now()});A.track("room_start","",code+":"+playersOf(room).length);}
async function hostNext(){
  const nq=room.qi+1;
  if(nq>=room.questions.length)await db.update(`rooms/${code}`,{state:"end"});
  else await db.update(`rooms/${code}`,{state:"question",qi:nq,qStart:db.now()});
}

function board(r,n,hiId){
  return `<ol class="lb">${ranked(r).slice(0,n).map((p,i)=>`<li class="${p.id===hiId?"me":""}"><span class="rk">${i+1}</span><span class="nm">${A.esc(p.nick)}${p.id===r.host?" · host":""}</span><b>${p.score||0}</b></li>`).join("")}</ol>`;
}
function draw(){
  const r=room;if(!r)return;
  const me=A.uid, qs=r.questions||[];
  if(r.state==="lobby"){
    const ps=playersOf(r);
    const v=shell(`<div class="panel center"><p class="label">Room code</p><div class="roomcode">${code}</div>
        <p class="small">Others open Hangul City → Compete → Join, and type this code.</p></div>
      <div class="panel"><p class="label">${ps.length} player${ps.length===1?"":"s"} in the room</p>
        <div class="chips">${ps.map(p=>`<span class="chip ${p.id===me?"mine":""}">${A.esc(p.nick)}</span>`).join("")}</div>
        ${isHost?`<button class="act" id="start" ${ps.length<1?"disabled":""}>Start game · ${qs.length} questions</button>${ps.length<2?`<p class="small">Waiting for others to join. You can also start alone to try it.</p>`:""}`
          :`<div class="note info">Waiting for the host to start…</div>`}</div>`);
    root.replaceChildren(v);wireBack();
    if(isHost)document.getElementById("start").onclick=hostStart;
    return;
  }
  if(r.state==="question"){
    const q=qs[r.qi], mine=r.answers&&r.answers[r.qi]&&r.answers[r.qi][me];
    const answered=Object.keys((r.answers&&r.answers[r.qi])||{}).length, n=playersOf(r).length;
    const v=shell(`<div class="panel">
        <p class="label">Question ${r.qi+1} of ${qs.length} · ${answered}/${n} answered</p>
        <div class="timer"><i id="rtime" style="width:100%"></i></div>
        ${q.listen?`<button class="act alt" id="rplay">▶ Play</button>`:`<div class="qtext">${q.prompt}</div>`}
        <p class="hint">${q.ask}</p>
        <div class="opts">${q.options.map((o,i)=>`<button class="opt ${mine&&mine.c===i?"picked":""}" data-i="${i}" ${mine?"disabled":""}>${o}</button>`).join("")}</div>
        ${mine?`<div class="note info">Answer locked in. Waiting for the others…</div>`:""}
      </div>`);
    root.replaceChildren(v);wireBack();
    if(q.listen){const play=()=>A.speak(q.prompt);document.getElementById("rplay").onclick=play;if(lastPlayed!==r.qi){lastPlayed=r.qi;setTimeout(play,300);}}
    if(!mine)v.querySelectorAll("[data-i]").forEach(b=>b.onclick=async()=>{
      const ms=Math.max(0,db.now()-r.qStart);
      v.querySelectorAll("[data-i]").forEach(x=>x.disabled=true);b.classList.add("picked");
      await db.set(`rooms/${code}/answers/${r.qi}/${me}`,{c:+b.dataset.i,ms});
      A.track("room_answer","",`${code}:${+b.dataset.i===q.answer?1:0}:${q.qtype}`);
    });
    return;
  }
  if(r.state==="reveal"){
    const q=qs[r.qi], mine=r.answers&&r.answers[r.qi]&&r.answers[r.qi][me], pts=(r.results&&r.results[r.qi]&&r.results[r.qi][me])||0;
    const v=shell(`<div class="panel">
        <p class="label">Question ${r.qi+1} of ${qs.length}</p>
        <div class="bigresult ${pts?"ok":"no"}">${pts?`+${pts}`:mine?"Not this time":"Too slow!"}</div>
        <p class="hint">Answer: <b>${q.options[q.answer]}</b></p>
        ${board(r,5,me)}
        ${isHost?`<button class="act" id="next">${r.qi+1>=qs.length?"Show final results":"Next question"}</button>`:`<div class="note info">Waiting for the host…</div>`}
      </div>`);
    root.replaceChildren(v);wireBack();
    if(isHost)document.getElementById("next").onclick=hostNext;
    return;
  }
  if(r.state==="end"){
    const rk=ranked(r), myRank=rk.findIndex(p=>p.id===me)+1;
    if(!ended){ended=true;A.track("room_end","",`${code}:${myRank}/${rk.length}:${(rk[myRank-1]||{}).score||0}`);}
    const v=shell(`<div class="hero center"><p class="label">Final results</p><h1>${myRank===1?"1등! 🏆":`You're #${myRank}`}</h1></div>
      <div class="podium">${[1,0,2].map(i=>rk[i]?`<div class="pod p${i+1}"><span>${A.esc(rk[i].nick)}</span><b>${rk[i].score||0}</b><i>${i+1}</i></div>`:"").join("")}</div>
      <div class="panel">${board(r,20,me)}<button class="act" id="done">Back to the map</button></div>`);
    root.replaceChildren(v);wireBack();
    document.getElementById("done").onclick=()=>{leave();A.back();};
  }
}

window.HCRooms={render};
})();
