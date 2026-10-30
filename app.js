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
// Stations added later: learners who already got past one keep their progress.
function syncStations(){Object.values(SEQ).forEach(seq=>seq.forEach((x,i)=>{if(x.kind!=="review"||stateOf(x)!=="locked")return;
  const nx=seq[i+1];
  if(nx&&stateOf(nx)!=="locked")setState(x,"done");
  else if(x.covers.every(p=>stateOf(p)==="done"))setState(x,"open");}));save();}
const missionDone=p=>P.missions.includes(p.code);
const unitsDone=()=>new Set(P.units);

let profile=store.get("ssk_profile",null);
if(profile&&!profile.role)profile=null;
if(profile&&!profile.form){profile.form="A";profile.signupAt=profile.signupAt||Date.now();} // old sign-ups re-register once for the new questions
let cityId=store.get("hc_city",null);
const city=()=>CITIES.find(c=>c.id===cityId)||CITIES[0];
// ---------- review stations: one after every 2 places ----------
const STATIONS={};
function stationFor(c,k,covers){const code=`R:${c.id}:${k}`;
  return STATIONS[code]||(STATIONS[code]={code,kind:"review",k,city:c.id,covers,ko:`복습 정류장 ${k}`,en:`Review station ${k}`,scene:"station",
    sub:`Review · ${covers.map(x=>x.ko).join(" + ")}`,who:"한글이",whoEn:"your Hangul City guide",mascot:true,photo:""});}
function seqOf(c){const out=[];let run=[],k=0;
  c.places.forEach(p=>{out.push(p);if(p.kind==="basics")return;run.push(p);if(run.length===2){out.push(stationFor(c,++k,run));run=[];}});
  if(run.length)out.push(stationFor(c,++k,run));return out;}
const SEQ={};CITIES.filter(c=>!c.soon).forEach(c=>SEQ[c.id]=seqOf(c));
const rankOf=p=>{const c=CITIES.find(c=>!c.soon&&c.places.includes(p));return c?c.places.filter(x=>x.kind!=="basics").indexOf(p):0;};
let PLACES=[];
function setCity(id){cityId=id;store.set("hc_city",id);PLACES=SEQ[id]||city().places;}
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
syncStations();

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
      <h1 class="logo"><img src="img/logo.png" alt="한글 시티 Hangul City" width="720" height="327"></h1>
      <p>A map of the places you'll actually go in Korea. Talk to the people there, learn what they really say, then go do it for real.</p>
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
    draft.signupAt=Date.now();draft.form=Math.random()<0.5?"A":"B";
    profile=draft;store.set("ssk_profile",profile);
    S.track("signup","",JSON.stringify({country:draft.country,role:draft.role,home:draft.home}));S.track("session_start");
    setCity(draft.home==="busan"?"busan":"seoul");
    go("placeIntro");
  };
}

// ---------- placement test ----------
// Two matched forms of the level check. Each learner gets one as the pre-test and the other as the post-test
// (counterbalanced), so the post-test is not the same questions a second time. Correct option is always index 0.
const TEST_FORMS={
 A:[
  {k:"read",prompt:"버스",q:"What does this word mean?",options:["bus","beer","boss","bread"]},
  {k:"read",prompt:"커피",q:"What does this word mean?",options:["coffee","copy","cup","coupon"]},
  {k:"num",prompt:"15,000원",q:"How do you say this price?",options:["만 오천 원","일만 오천 원","십오천 원","열다섯 천 원"]},
  {k:"num",prompt:"Two people (at a restaurant)",q:"Pick the natural answer.",options:["두 명이요","이 명이요","둘 명이요","두 개요"]},
  {k:"polite",prompt:"A clerk asks if you need a bag. You don't.",q:"What do you say?",options:["아뇨, 괜찮아요","봉투가 필요하지 않습니다","싫어"]},
  {k:"polite",prompt:"Ending an email to your professor.",q:"Which is right?",options:["감사합니다.","고마워!","ㅇㅋ 감사요"]},
  {k:"meaning",prompt:"어떻게 오셨어요?",q:"At an office, this means…",options:["How can I help you?","How did you get here?","How are you?","Where are you from?"]},
  {k:"listen",listen:"덜 맵게 해 주세요",prompt:"Listen.",q:"What did you hear?",options:["Less spicy, please","More spicy, please","It's too spicy","Not spicy at all?"]}],
 B:[
  {k:"read",prompt:"택시",q:"What does this word mean?",options:["taxi","tax","text","ticket"]},
  {k:"read",prompt:"카드",q:"What does this word mean?",options:["card","cart","code","guard"]},
  {k:"num",prompt:"25,000원",q:"How do you say this price?",options:["이만 오천 원","이십오천 원","스물다섯 천 원","이만 오백 원"]},
  {k:"num",prompt:"Three people (at a restaurant)",q:"Pick the natural answer.",options:["세 명이요","삼 명이요","셋 명이요","세 개요"]},
  {k:"polite",prompt:"A clerk asks if you want a receipt. You don't.",q:"What do you say?",options:["아뇨, 괜찮아요","영수증이 필요하지 않습니다","싫어"]},
  {k:"polite",prompt:"Asking a bus driver if the bus goes to 강남역.",q:"Which is right?",options:["기사님, 이거 강남역 가요?","야, 강남역 가?","본 버스는 강남역으로 운행합니까?"]},
  {k:"meaning",prompt:"몇 분이세요?",q:"At a restaurant door, this means…",options:["How many people?","How many minutes?","What time is it?","Who are you?"]},
  {k:"listen",listen:"수건 하나 더 주세요",prompt:"Listen.",q:"What did you hear?",options:["One more towel, please","Two towels, please","Where is the towel?","No towel, thanks"]}]
};
const preForm=()=>(profile&&profile.form)||"A", postForm=()=>preForm()==="A"?"B":"A";
let testMode="pre";
let pq=0, pscore=0, porder=[];
function placeIntro(){
  const v=el(`<div class="col">
    <div class="hero"><p class="label">Hi ${esc(profile.nick)}!</p><h1>Quick level check</h1>
      <p>8 short questions, about 2 minutes. Your answers decide where you start on the map and how much help you get.</p>
      <div class="hero-chars"><div><img class="mascot" src="img/mascot.png" alt=""></div></div></div>
    <div class="panel"><button class="act" id="go">Take the test</button>
      <button class="act alt" id="beg">I'm a beginner, skip the test</button></div></div>`);
  app.replaceChildren(v);
  document.getElementById("go").onclick=()=>{testMode="pre";pq=0;pscore=0;porder=TEST_FORMS[preForm()].map(q=>({...q,order:shuffle(q.options.map((_,i)=>i))}));go("placement");};
  document.getElementById("beg").onclick=()=>{S.track("placement_skip","","beginner");applyLevel("beginner",null);go("map");toast("Welcome! Start at 한글 학교, the first stop on the map.");};
}
function placement(){
  const q=porder[pq];
  const v=el(`<div class="col">
    <div class="topbar"><span class="label">${testMode==="post"?"Progress check":"Level check"} · ${pq+1} of ${porder.length}</span><button class="back" id="quit" style="flex:none">${testMode==="post"?"Later":"Skip test"}</button></div>
    <div class="progress"><i style="width:${100*pq/porder.length}%"></i></div>
    <div class="panel">
      ${q.listen?`<button class="act alt" id="play">▶ Play the sentence</button>`:`<div class="${q.prompt.length<10?"bigglyph":"qtext"}">${q.prompt}</div>`}
      <p class="hint">${q.q}</p>
      <div class="opts">${q.order.map(i=>`<button class="opt" data-i="${i}">${q.options[i]}</button>`).join("")}</div>
      <button class="back" id="idk" style="align-self:center">I don't know</button>
    </div></div>`);
  app.replaceChildren(v);
  if(q.listen){setTimeout(()=>speak(q.listen),400);document.getElementById("play").onclick=()=>speak(q.listen);}
  const next=(ok,chosen)=>{q.chosen=chosen;q.ok=ok;if(ok)pscore++;S.track(testMode==="post"?"posttest_q":"placement_q","",q.k+":"+(ok?1:0));pq++;if(pq>=porder.length)(testMode==="post"?finishPost():finishPlacement());else render();};
  v.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>next(+b.dataset.i===0,q.options[+b.dataset.i]));
  document.getElementById("idk").onclick=()=>next(false,null);
  document.getElementById("quit").onclick=()=>{if(testMode==="post"){S.track("posttest_later","","at "+pq);postSnooze=true;go("map");return;}S.track("placement_skip","","quit at "+pq);applyLevel("beginner",null);go("map");};
}
function mistakesReview(){
  const miss=porder.filter(q=>!q.ok);
  if(!miss.length)return `<p class="small">No mistakes. Great job!</p>`;
  return `<details class="history"><summary>Review your mistakes (${miss.length})</summary><div class="hist">${miss.map(q=>`<div class="revq">
    <p><b>${q.listen?`(audio) ${q.listen}`:q.prompt}</b><br><span class="small">${q.q}</span></p>
    <p>Your answer: ${q.chosen?esc(q.chosen):"I don't know"}<br>Correct: <b>${q.options[0]}</b>${/[가-힣]/.test(q.options[0])?` <span class="small">(${rom(q.options[0])})</span>`:""}</p>
    <p class="small">${q.k==="num"?"Sino numbers (일, 이, 삼) for money and floors; native numbers (하나, 둘, 셋) for people and hours.":q.k==="polite"?"With staff, short polite -요 forms sound natural. Textbook forms sound stiff, and 반말 sounds rude.":q.k==="read"?"Read block by block; many words come from English.":q.k==="listen"?"Listen for the first word of the sentence.":"Some everyday phrases don't translate word for word."}</p></div>`).join("")}</div></details>`;
}
function finishPlacement(){
  const lvl=pscore>=7?"advanced":pscore>=4?"intermediate":"beginner";
  const txt={beginner:"You'll start at 한글 학교 with romanization and translations shown.",intermediate:"You can read Korean, so 한글 학교 is skipped. Translations are hidden until you tap.",advanced:"The first three Seoul places are open, there are no hints, and your answers are timed."}[lvl];
  const v=el(`<div class="col"><div class="hero"><p class="label">Your result</p><h1>${pscore}/8 · ${LEVEL[lvl].name}</h1><p>${txt}</p></div>
    <div class="panel">${mistakesReview()}<button class="act" id="ok">Go to the map</button>
    <p class="small">Feels wrong? Pick your level yourself:</p>${seg("lv",[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]])}</div></div>`);
  app.replaceChildren(v);
  S.track("placement","",`${pscore}/8:${lvl}:${preForm()}`);
  let chosen=lvl;
  v.querySelectorAll("[data-v]").forEach(b=>{if(b.dataset.v===lvl)b.setAttribute("aria-pressed","true");
    b.onclick=()=>{v.querySelectorAll("[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");chosen=b.dataset.v;};});
  document.getElementById("ok").onclick=()=>{if(chosen!==lvl)S.track("placement_override","",`${lvl}->${chosen}`);applyLevel(chosen,pscore);go("map");};
}
// ---------- post-test (learning gain) ----------
let postSnooze=false, surveySnooze=false;
const clearedCount=()=>CITIES.filter(c=>!c.soon).flatMap(c=>c.places).filter((p,i,a)=>p.kind!=="basics"&&a.indexOf(p)===i&&stateOf(p)==="done").length;
const daysSince=t=>t?(Date.now()-t)/864e5:0;
function postDue(){
  if(!profile||profile.postDone)return false;
  if(/posttest/.test(location.search))return true;
  return daysSince(profile.signupAt)>=7||clearedCount()>=5;
}
function surveyDue(){
  if(!profile||profile.surveyDone)return false;
  if(/survey/.test(location.search))return true;
  return clearedCount()>=2;
}
function startPost(){testMode="post";pq=0;pscore=0;porder=TEST_FORMS[postForm()].map(q=>({...q,order:shuffle(q.options.map((_,i)=>i))}));S.track("posttest_start","",postForm());go("placement");}
function finishPost(){
  const pre=(profile.testScore==null)?null:profile.testScore;
  profile.postDone=true;profile.postScore=pscore;store.set("ssk_profile",profile);
  S.track("posttest","",`${pscore}/8:pre=${pre==null?"none":pre}:${postForm()}`);
  const diff=pre==null?null:pscore-pre;
  const v=el(`<div class="col"><div class="hero"><p class="label">Progress check</p>
      <h1>${pscore}/8</h1>
      <p>${pre==null?"You skipped the first level check, so there's nothing to compare with. Thanks, this still helps.":diff>0?`Up ${diff} from your first check (${pre}/8). Your practice is working.`:diff===0?`Same as your first check (${pre}/8). Keep going, the review quizzes help most.`:`Your first check was ${pre}/8. A different set of questions can be harder, keep practising.`}</p>
      <div class="hero-chars"><div><img class="mascot" src="img/mascot.png" alt=""></div></div></div>
    <div class="panel">${mistakesReview()}<button class="act" id="ok">Back to the map</button></div></div>`);
  app.replaceChildren(v);document.getElementById("ok").onclick=()=>go("map");
}
// ---------- feedback survey ----------
const SURVEY=[
  {k:"easy",q:"The app was easy to use."},
  {k:"real",q:"The conversations felt like real Korean."},
  {k:"confident",q:"I feel more confident going to these places now."},
  {k:"recommend",q:"I would recommend Hangul City to a friend."}
];
function survey(){
  const ans={};
  const v=el(`<div class="col">
    <div class="topbar"><span class="label">Quick feedback · 1 minute</span><button class="back" id="later" style="flex:none">Later</button></div>
    <div class="panel">${SURVEY.map(s=>`<div class="field"><label>${s.q}</label>
        <div class="likert" data-k="${s.k}">${[1,2,3,4,5].map(n=>`<button type="button" data-v="${n}" aria-label="${n} of 5">${n}</button>`).join("")}</div>
        <div class="likert-ends"><span>Disagree</span><span>Agree</span></div></div>`).join("")}
      <div class="field"><label for="fb">What should we change or add? (optional)</label>
        <textarea id="fb" maxlength="180" rows="3" placeholder="Don't include your name or contact details"></textarea></div>
      <div id="err"></div><button class="act" id="send">Send feedback</button></div></div>`);
  app.replaceChildren(v);
  v.querySelectorAll(".likert").forEach(g=>g.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");ans[g.dataset.k]=+b.dataset.v;}));
  document.getElementById("later").onclick=()=>{S.track("survey_later");surveySnooze=true;go("map");};
  document.getElementById("send").onclick=()=>{
    if(SURVEY.some(s=>!ans[s.k])){document.getElementById("err").replaceChildren(el(`<div class="note bad">Pick a number for each of the 4 statements.</div>`));return;}
    S.track("survey","",SURVEY.map(s=>`${s.k}=${ans[s.k]}`).join("|"));
    const t=document.getElementById("fb").value.trim();if(t)S.track("survey_text","",t.slice(0,180));
    profile.surveyDone=true;store.set("ssk_profile",profile);go("map");toast("Thank you! 감사합니다.");
  };
}
function applyLevel(lvl,score){
  profile.tested=lvl;profile.testScore=score;store.set("ssk_profile",profile);
  if(lvl!=="beginner"){
    if(stateOf(BASICS)!=="done")setState(BASICS,"done");
    CITIES.filter(c=>!c.soon).forEach(c=>{const p=c.places[1];if(p&&stateOf(p)==="locked")setState(p,"open");});
  }
  if(lvl==="advanced")CITIES[0].places.slice(1,4).forEach(p=>{if(stateOf(p)==="locked")setState(p,"open");});
  save();syncStations();
}

// ---------- city scenery (what each city is known for) ----------
const ART={
  mountains:W=>`<path d="M0 64 L34 26 L58 44 L96 8 L132 46 L168 22 L206 52 L244 14 L286 46 L320 24 L${W} 50 L${W} 0 L0 0Z" fill="var(--mtn)"/><path d="M96 8 L108 20 L100 22 L90 15Z M244 14 L256 26 L246 27 L238 20Z" fill="var(--mtn-top)"/>`,
  namsan:(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cx="0" cy="34" rx="62" ry="30" fill="var(--hill)"/><rect x="-2.5" y="-46" width="5" height="62" fill="#C9CED6"/><rect x="-11" y="-30" width="22" height="9" rx="3" fill="#E9ECF0" stroke="#9AA3AF"/><rect x="-7" y="-40" width="14" height="8" rx="2" fill="#E9ECF0" stroke="#9AA3AF"/><rect x="-1.2" y="-70" width="2.4" height="26" fill="#D9473B"/><rect x="-1.2" y="-62" width="2.4" height="5" fill="#fff"/><text y="62" text-anchor="middle" class="lm">N서울타워</text></g>`,
  palace:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-38" y="6" width="76" height="20" fill="#B9AE98"/><rect x="-10" y="12" width="20" height="14" rx="9" fill="#5B4636"/><rect x="-30" y="-10" width="60" height="16" fill="#B73A2E"/><rect x="-26" y="-6" width="52" height="4" fill="#3E8E6E"/><path d="M-46 -10 Q-30 -16 0 -18 Q30 -16 46 -10 Q36 -24 0 -28 Q-36 -24 -46 -10Z" fill="#3B4A44"/><path d="M-30 -22 Q0 -40 30 -22Z" fill="#3B4A44"/><text y="42" text-anchor="middle" class="lm">경복궁</text></g>`,
  lotte:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-12 26 L-3 -66 L3 -66 L12 26Z" fill="#B7C7D8" stroke="#8EA2B8"/><path d="M-3 -66 L0 -78 L3 -66Z" fill="#8EA2B8"/><path d="M-7 0 L7 0 M-8.5 10 L8.5 10 M-5.5 -20 L5.5 -20 M-4.2 -40 L4.2 -40" stroke="#E6EEF6" stroke-width="2"/><rect x="-34" y="4" width="16" height="22" fill="#D5DCE4"/><rect x="20" y="-2" width="14" height="28" fill="#C9D2DC"/><text y="42" text-anchor="middle" class="lm">롯데타워</text></g>`,
  apartments:(x,y)=>`<g transform="translate(${x} ${y})">${[-30,0,30].map((dx,k)=>`<rect x="${dx-13}" y="${-34+k%2*8}" width="26" height="${60-k%2*8}" fill="#EDEAE2" stroke="#B9B3A6"/><text x="${dx}" y="${-24+k%2*8}" text-anchor="middle" class="apt">${101+k}동</text>${[0,1,2,3].map(r=>`<rect x="${dx-9}" y="${-16+k%2*8+r*10}" width="18" height="4" fill="#9FB9D4"/>`).join("")}`).join("")}<text y="42" text-anchor="middle" class="lm">아파트</text></g>`,
  hanok:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-30" y="0" width="60" height="22" fill="#EFE6D2" stroke="#A88F6A"/><rect x="-8" y="6" width="16" height="16" fill="#8A6A45"/><path d="M-40 2 Q-20 -4 0 -6 Q20 -4 40 2 Q30 -16 0 -20 Q-30 -16 -40 2Z" fill="#4A4F55"/><text y="40" text-anchor="middle" class="lm">한옥</text></g>`,
  river:(y,W)=>`<g><path d="M0 ${y-20} C90 ${y-34} 200 ${y-4} ${W} ${y-24} L${W} ${y+22} C220 ${y+4} 110 ${y+34} 0 ${y+20}Z" fill="var(--water)"/><path d="M20 ${y} q14 -5 28 0 M230 ${y-6} q14 -5 28 0 M120 ${y+8} q14 -5 28 0" stroke="var(--wave)" stroke-width="2" fill="none"/><text x="${W-14}" y="${y+40}" text-anchor="end" class="lm">한강 Han River</text></g>`,
  sea:W=>`<rect width="${W}" height="58" fill="var(--water)"/><path d="M0 58 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="var(--sand)"/>${[30,110,200,290].map(x=>`<path d="M${x} 20 q8 -4 16 0" stroke="var(--wave)" stroke-width="2" fill="none"/>`).join("")}`,
  gwangan:W=>`<g><rect x="30" y="34" width="${W-60}" height="4" fill="#E8ECF2"/>${[110,250].map(x=>`<rect x="${x-3}" y="6" width="6" height="34" fill="#E8ECF2"/>`).join("")}<path d="M30 34 Q70 30 110 8 Q180 34 250 8 Q290 30 ${W-30} 34" stroke="#F2C94C" stroke-width="1.6" fill="none"/><text x="${W-12}" y="52" text-anchor="end" class="lm lm-l">광안대교 Gwangan Bridge</text></g>`,
  gamcheon:(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cx="0" cy="30" rx="56" ry="22" fill="var(--hill)"/>${[["#F6C85F",-36,4],["#7FB8D6",-18,-6],["#E57A5C",0,2],["#9BCB7A",18,-8],["#C9A0DC",34,4],["#F29CB3",-26,-18],["#7FD1C4",8,-20]].map(([c,dx,dy])=>`<rect x="${dx-8}" y="${dy}" width="16" height="13" fill="${c}" stroke="rgba(0,0,0,.15)"/>`).join("")}<text y="56" text-anchor="middle" class="lm">감천문화마을</text></g>`,
  haeundae:(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-44" y="18" width="88" height="10" fill="var(--sand)"/><path d="M-30 18 L-26 -54 L-18 -54 L-14 18Z M-6 18 L-3 -68 L5 -68 L8 18Z M16 18 L19 -48 L26 -48 L30 18Z" fill="#AFC3D6" stroke="#8399AF"/><text y="44" text-anchor="middle" class="lm">해운대</text></g>`,
  lighthouse:(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-9 22 L-6 -24 L6 -24 L9 22Z" fill="#D9473B"/><rect x="-7" y="-10" width="14" height="5" fill="#fff"/><rect x="-6" y="-32" width="12" height="9" fill="#FFE9A8" stroke="#D9473B"/><path d="M-8 -32 L0 -40 L8 -32Z" fill="#D9473B"/><path d="M-30 22 L30 22" stroke="var(--water)" stroke-width="6"/><text y="40" text-anchor="middle" class="lm">등대</text></g>`,
  boat:(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cx="0" cy="12" rx="44" ry="12" fill="var(--water)"/><path d="M-24 4 L24 4 L18 14 L-18 14Z" fill="#2F6E8F"/><rect x="-6" y="-12" width="14" height="16" fill="#F4F1E6"/><path d="M-2 -12 L-2 -26" stroke="#555" stroke-width="2"/><text y="40" text-anchor="middle" class="lm">고깃배</text></g>`,
  gulls:(x,y)=>`<path d="M${x} ${y} q5 -5 10 0 q5 -5 10 0 M${x+30} ${y-10} q4 -4 8 0 q4 -4 8 0" stroke="var(--gull)" stroke-width="1.8" fill="none"/>`,
  beach:(y,W)=>`<g><rect y="${y}" width="${W}" height="60" fill="var(--sand)"/><path d="M0 ${y+30} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L${W} ${y+60} L0 ${y+60}Z" fill="var(--water)"/>${[60,150,240].map((x,k)=>`<g transform="translate(${x} ${y+16})"><path d="M-12 0 Q0 -12 12 0Z" fill="${["#E57A5C","#F6C85F","#7FB8D6"][k]}"/><path d="M0 -2 L0 14" stroke="#7A5A3C" stroke-width="1.5"/></g>`).join("")}</g>`
};
const CITY_INFO={
  seoul:{line:"🗼 N Seoul Tower · 🏯 Gyeongbokgung · 🌉 Han River",side:["palace","lotte","river","hanok","apartments"]},
  busan:{line:"🌉 Gwangan Bridge · 🏖️ Haeundae · 🎨 Gamcheon Village · 🐟 Jagalchi",side:["gamcheon","haeundae","lighthouse","boat"]}
};
function cityScenery(id,W,H,stationYs){
  const A=ART;let back="",front="";
  if(id==="seoul"){back+=A.mountains(W)+A.namsan(300,80);
    const pieces=CITY_INFO.seoul.side;
    stationYs.forEach((y,k)=>{const name=pieces[k%pieces.length];
      if(name==="river")back+=A.river(y-92,W);
      else back+=A[name](k%2?298:62,y-6);});}
  else if(id==="busan"){back+=A.sea(W)+A.gwangan(W)+A.gulls(40,80)+A.gulls(270,96);
    stationYs.forEach((y,k)=>{const L=CITY_INFO.busan.side;back+=A[L[(k*2)%L.length]](58,y-6)+A[L[(k*2+1)%L.length]](302,y-6);});
    back+=A.beach(H-60,W);}
  return back+front;
}

// ---------- map ----------
function unlockNext(p){
  if(p.code===BASICS.code){CITIES.filter(c=>!c.soon).forEach(c=>{const n=c.places[1];if(n&&stateOf(n)==="locked")setState(n,"open");});return PLACES[1]||null;}
  const i=PLACES.indexOf(p), n=PLACES[i+1];
  if(n&&stateOf(n)==="locked"){setState(n,"open");return n;}
  return null;
}
function mapView(){
  const realPlaces=PLACES.filter(p=>p.kind!=="review");
  const n=realPlaces.length, W=360;
  const pts=[];let y=110,side=0;
  PLACES.forEach((p,i)=>{if(i>0)y+=(p.kind==="review"||PLACES[i-1].kind==="review")?180:170;
    if(p.kind==="review")pts.push({x:180,y});else{pts.push({x:side%2?250:110,y});side++;}});
  const H=y+(cityId==="busan"?210:150);
  let road=`M${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<PLACES.length;i++){const a=pts[i-1],b=pts[i],d=(b.y-a.y)*.56;road+=` C${a.x} ${a.y+d} ${b.x} ${b.y-d} ${b.x} ${b.y}`;}
  const stationYs=pts.filter((_,i)=>PLACES[i].kind==="review").map(p=>p.y);
  let trees="";for(let ty=150,k=0;ty<H-80;ty+=85,k++){const x=k%2?22+(k*7%10):338-(k*5%10);
    if(stationYs.some(sy=>Math.abs(sy-ty)<90))continue;
    trees+=`<g transform="translate(${x} ${ty})"><rect x="-2" y="4" width="4" height="10" fill="var(--trunk)"/><circle r="11" fill="var(--tree)"/></g>`;}
  const cur=PLACES.findIndex(p=>stateOf(p)==="open");
  const lockIcon=`<g transform="translate(0 -6)" class="lock"><circle r="20" fill="var(--lock-bg)"/><path d="M-7 -2 v-5 a7 7 0 0 1 14 0 v5" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="-10" y="-2" width="20" height="15" rx="3" fill="#fff"/><circle cy="5" r="2.4" fill="var(--lock-bg)"/></g>`;
  const check=(x,y)=>`<g transform="translate(${x} ${y})"><circle r="15" fill="var(--ok)"/><path d="M-7 0 l5 5 l9 -10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
  const pin=(x,y)=>`<g class="pin" transform="translate(${x} ${y})"><path d="M0 22 C-14 6 -14 -14 0 -14 C14 -14 14 6 0 22Z" fill="var(--accent)" stroke="#fff" stroke-width="2"/><text y="3" text-anchor="middle" class="pin-t">${esc((profile.nick||"?")[0].toUpperCase())}</text></g>`;
  let num=0;
  const nodes=PLACES.map((p,i)=>{
    const {x,y}=pts[i], st=stateOf(p), locked=st==="locked", isDone=st==="done";
    const prev=PLACES[i-1];
    if(p.kind==="review"){
      return `<g class="bld station ${st}" data-i="${i}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${p.en}${locked?", locked":""}">
        ${st==="open"?`<circle class="ring" cx="0" cy="-20" r="40" fill="none" stroke="var(--accent)" stroke-width="3"/>`:""}
        <g class="art"><ellipse cx="0" cy="30" rx="34" ry="8" fill="var(--plot)"/><rect x="-3" y="-30" width="6" height="60" rx="2" fill="#5B6472"/>
          <circle cy="-30" r="24" fill="${locked?"#8B93A1":"var(--accent)"}" stroke="#fff" stroke-width="4"/><text y="-25" text-anchor="middle" class="st-t">복습</text></g>
        <g transform="translate(0 50)"><rect x="-78" y="-14" width="156" height="${locked?56:42}" rx="8" fill="var(--sign)" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="${locked?"4 3":"0"}"/>
          <text y="4" text-anchor="middle" class="sign-ko">🚏 ${p.ko}</text>
          <text y="20" text-anchor="middle" class="sign-en">${p.covers.map(c=>c.ko).join(" + ")}</text>
          ${locked?`<text y="36" text-anchor="middle" class="sign-lock">Finish ${prev.ko} first</text>`:""}</g>
        ${locked?`<g transform="translate(0 -24)">${lockIcon}</g>`:""}${isDone?check(32,-46):""}${i===cur?pin(-40,-50):""}</g>`;
    }
    num++;
    return `<g class="bld ${st}" data-i="${i}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${p.en}${locked?", locked":""}">
      <ellipse cx="0" cy="44" rx="70" ry="12" fill="var(--plot)"/>
      ${st==="open"?`<circle class="ring" cx="0" cy="0" r="74" fill="none" stroke="var(--accent)" stroke-width="3"/>`:""}
      <g class="art">${buildingSVG(p.scene)}</g>
      <g transform="translate(0 66)"><rect x="-72" y="-14" width="144" height="${locked?56:42}" rx="8" fill="var(--sign)" stroke="var(--sign-line)" stroke-width="1.5"/>
        <text y="4" text-anchor="middle" class="sign-ko">${num}. ${p.ko}</text>
        <text y="20" text-anchor="middle" class="sign-en">${p.en}</text>
        ${locked?`<text y="36" text-anchor="middle" class="sign-lock">Finish ${prev.kind==="review"?"the review station":prev.ko} first</text>`:""}</g>
      ${locked?lockIcon:""}
      ${missionDone(p)?`<g transform="translate(-52 -50)"><circle r="15" fill="var(--gold)"/><path d="M0 -9 L2.6 -3 L9 -2.8 L4 1.4 L5.6 8 L0 4.4 L-5.6 8 L-4 1.4 L-9 -2.8 L-2.6 -3Z" fill="#fff"/></g>`:""}
      ${isDone?check(52,-50):""}
      ${i===cur?pin(-56,-58):""}
    </g>`;}).join("");
  const cleared=realPlaces.filter(p=>stateOf(p)==="done").length, stars=realPlaces.filter(missionDone).length;
  const openStation=PLACES.find(p=>p.kind==="review"&&stateOf(p)==="open");
  const nWords=myWords().length;
  const v=el(`<div class="col">
    <div class="hud"><div><b class="hud-title"><img class="hud-face" src="img/face.png" alt="" width="26" height="23">한글 시티</b><span class="hello">안녕, ${esc(profile.nick)}! · ${cfg().name}</span></div>
      <div class="hud-score"><b>${cleared}<small>/${n}</small></b><span>${city().ko} cleared · ${stars} ★</span></div></div>
    ${postDue()&&!postSnooze?`<div class="banner"><div><b>Progress check</b><span>8 questions, 2 minutes. See how much you've improved.</span></div><div class="row"><button class="act" id="post">Start</button><button class="act alt" id="postlater">Later</button></div></div>`
      :surveyDue()&&!surveySnooze?`<div class="banner"><div><b>Quick feedback</b><span>4 questions, 1 minute. It helps us make the app better.</span></div><div class="row"><button class="act" id="surv">Give feedback</button><button class="act alt" id="survlater">Later</button></div></div>`
      :openStation?`<div class="banner"><div><b>🚏 ${openStation.ko} is open</b><span>8 questions on ${openStation.covers.map(c=>c.ko).join(" + ")}. Pass it to unlock the next place.</span></div><div class="row"><button class="act" id="station">Start review</button></div></div>`:""}
    <div class="cities">${CITIES.map(c=>`<button class="city ${c.id===cityId?"on":""} ${c.soon?"soon":""}" data-c="${c.id}">${c.ko}<small>${c.soon?"soon":c.en}</small></button>`).join("")}</div>
    ${CITY_INFO[cityId]?`<p class="cityline">${CITY_INFO[cityId].line}</p>`:""}
    <button class="act compete" id="compete">대결 · Compete with friends</button>
    <button class="act alt wordsbtn" id="words">🃏 단어 카드 · Word cards <span class="badge">${nWords}</span></button>
    <div class="mapwrap"><svg class="map" viewBox="0 0 ${W} ${H}" aria-label="Map of ${city().en}">
      <rect width="${W}" height="${H}" fill="var(--grass)"/>${cityScenery(cityId,W,H,stationYs)}${trees}
      <path d="${road}" fill="none" stroke="var(--road)" stroke-width="30" stroke-linecap="round"/>
      <path d="${road}" fill="none" stroke="var(--road-line)" stroke-width="3" stroke-dasharray="10 12"/>
      ${nodes}</svg></div>
    <div class="panel">${armReset?`<p style="margin:0;font-weight:700">Reset all progress in every city?</p><div class="row"><button class="act" id="resetyes">Yes, reset</button><button class="act alt" id="resetno">Cancel</button></div>`
      :`<div class="row"><button class="act alt" id="retest">Retake level check</button><button class="act alt" id="reset">Reset progress</button></div>`}</div>
    <div class="foot"><span>Hangul City · a 영어와컴퓨터 class project</span>${store.get("hc_team",false)?`<span>Team device · not recorded</span>`:""}</div>
  </div>`);
  app.replaceChildren(v);
  v.querySelectorAll(".bld").forEach(g=>{
    const open=()=>{const i=+g.dataset.i,p=PLACES[i];
      if(stateOf(p)==="locked"){const pv=PLACES[i-1];toast(p.kind==="review"?`${p.ko} opens after you finish ${pv.ko} (${pv.en}).`:pv.kind==="review"?`Locked. Pass ${pv.ko} first to unlock ${p.ko} (${p.en}).`:`Locked. Finish ${pv.ko} (${pv.en}) first to unlock ${p.ko} (${p.en}).`);S.track("locked_tap",p.code);return;}
      pi=i;
      if(p.kind==="review"){S.track("station_start",p.code);startReview();return;}
      S.track(stateOf(p)==="done"?"place_replay":"place_start",p.code);go(p.kind==="basics"?"units":"intro");};
    g.addEventListener("click",open);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
  v.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{const c=CITIES.find(x=>x.id===b.dataset.c);
    if(c.soon){toast(`${c.ko} ${c.en} is coming later.`);S.track("city_soon_tap","",c.id);return;}
    setCity(c.id);S.track("city_switch","",c.id);render();window.scrollTo({top:0});});
  const qq=id=>document.getElementById(id);
  if(qq("post")){qq("post").onclick=startPost;qq("postlater").onclick=()=>{S.track("posttest_later","","banner");postSnooze=true;render();};}
  if(qq("surv")){qq("surv").onclick=()=>{S.track("survey_open");go("survey");};qq("survlater").onclick=()=>{S.track("survey_later","","banner");surveySnooze=true;render();};}
  if(qq("station")){qq("station").onclick=()=>{pi=PLACES.indexOf(openStation);S.track("station_start",openStation.code,"banner");startReview();};}
  document.getElementById("compete").onclick=()=>{S.track("rooms_open");go("rooms");};
  document.getElementById("words").onclick=()=>{S.track("words_open","",nWords);go("words");};
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
  setTimeout(maybeInstall,1200);
  if(cur>0){const target=v.querySelectorAll(".bld")[cur];setTimeout(()=>{try{target.scrollIntoView({block:"center",behavior:reduced?"auto":"smooth"});}catch(e){}},60);}
}

// ---------- scene stage with talking character ----------
function stage(p){
  return `<div class="scene"><div class="stage s-${p.scene}"><div class="backdrop"></div>
    <div class="npc" id="npc">${p.mascot?`<img class="ch mascot" src="img/mascot.png" alt="">`:charSVG(p.char)}</div><div class="counter"></div>
    <div class="nametag">${p.who}<small>${p.whoEn}</small></div></div><div class="bubble-npc" id="bub" aria-live="polite"></div></div>`;
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
  return el(`<div class="col"><div class="topbar"><button class="back" id="back">← Map</button><span class="where">${p.ko} (${p.en}) · ${p.sub}</span></div>${stage(p)}${inner}</div>`);
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
  if(p.kind==="review"){startReview();return;}
  const rec=cfg().recommend;
  const nx=PLACES[PLACES.indexOf(p)+1];
  const v=sceneShell(p,`${photoCard(p)}<div class="panel">
      <div class="note info"><b style="color:var(--ink)">Real talk.</b> ${p.culture}</div>
      <div class="row"><button class="act ${rec==="learn"?"":"alt"}" id="learn">Teach me first${rec==="learn"?" ★":""}</button><button class="act ${rec==="practice"?"":"alt"}" id="prac">Jump to practice${rec==="practice"?" ★":""}</button></div>
      <p class="small">★ Recommended for your level (${cfg().name})</p>
      ${nx&&nx.kind==="review"&&stateOf(nx)!=="done"?`<div class="note heads">🚏 <b>Heads-up:</b> after this place comes ${nx.ko}, a short quiz on ${nx.covers.map(c=>c.ko).join(" and ")}. Pay attention to the phrases!</div>`:""}
    </div>`);
  app.replaceChildren(v);wireBack();
  say("안녕하세요! 표현 먼저 배워 볼까요?","Hi! Shall we learn the key phrases first?");
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

// ---------- feedback on mistakes ----------
const KIND_TIP={
  formal:"Use the short everyday form. A simple -요 ending is polite enough with staff.",
  casual:"That's 반말. With staff and strangers, use the polite -요 form.",
  rude:"Choose the softer option. Korean avoids blunt refusals and commands.",
  meaning:"Re-read what they asked, then pick the reply that answers it."
};
function fbNote(why,tip){return el(`<div class="note bad fb"><b>Why it's wrong:</b> ${why}${tip?`<span class="fb-tip"><b>How to fix it:</b> ${tip}</span>`:""}</div>`);}
let LOOK=null;
function lookup(){if(LOOK)return LOOK;const byEn={},byKo={};window.HC_ITEMS().forEach(x=>{if(x.ko&&x.en){byEn[x.en]=x;byKo[x.ko]=x;}});return LOOK={byEn,byKo};}

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
  if(!cur){S.track("practice_done",p.code,mistakes);go("cleared");return;}
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
  let tries=0;
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
    if(got.join(" ")===c.answer.join(" ")){const code=PLACES[pi].code, sent=c.answer.join(" ");S.track("answer_right",code,"build");speak(sent);
      if(rankOf(PLACES[pi])>=2){react("happy");clearInterval(turnTimer);
        n.innerHTML=`<div class="note ok">✓ Right order!</div>`+sayBlock("Now say the sentence out loud.",sent,cfg().noTranslate?"":rom(sent))+`<button class="back" data-skip style="align-self:center">Skip speaking</button>`;
        speakBox(n,sent,how=>{S.track("speak_done",code,"build:"+how);advanceMe(c);},code);
        n.querySelector("[data-skip]").onclick=()=>{S.track("speak_skip",code,"build");advanceMe(c);};}
      else advanceMe(c);}
    else{mistakes++;tries++;const ans=c.answer;
      const extraW=got.find(w=>!ans.includes(w));
      const k=got.findIndex((w,j)=>w!==ans[j]);
      let kind,why,tip;
      if(extraW){kind="wrong_word";why=`“${extraW}” isn't part of this sentence.`;tip="Tap it to take it back, then build the sentence from the other words.";}
      else if(k===-1){kind="incomplete";why="Good start, but the sentence isn't finished.";tip=`Add the ${ans.length-got.length===1?"last word":`remaining ${ans.length-got.length} words`}.`;}
      else{kind="word_order";why=k===0?`A sentence like this doesn't start with “${got[0]}”.`:`It's right up to “${ans.slice(0,k).join(" ")}”, then the order changes.`;
        tip="Korean puts the action at the end (주세요, 가요?, 있어요). Tap words to take them back and reorder.";}
      if(tries>=2){const nx=ans[k===-1?got.length:Math.max(0,extraW?got.indexOf(extraW):k)];tip+=` Hint: the next word should be “${nx}”.`;}
      S.track("answer_wrong",PLACES[pi].code,kind);react("confused");n.querySelector("#slot").classList.add("bad");
      n.querySelector("#nt").replaceChildren(fbNote(why,tip));}
  };
  return n;
}
function pickTurn(c){
  let tries=0;
  const n=el(`<div class="turn"><p class="hint">Your turn · ${c.en}</p><div class="opts" id="op"></div><div id="nt"></div></div>`);
  let idx=c.options.map((o,i)=>i);
  if(cfg().opts<idx.length){const wrongs=shuffle(idx.filter(i=>i!==c.answer)).slice(0,cfg().opts-1);idx=[c.answer,...wrongs];}
  shuffle(idx).forEach(i=>{const o=c.options[i];const b=el(`<button class="opt">${o}${cfg().rom?`<small>${rom(o)}</small>`:""}</button>`);b.onclick=()=>{
    if(i===c.answer){S.track("answer_right",PLACES[pi].code,"pick");speak(o);advanceMe(c);}
    else{mistakes++;tries++;const kind=(c.kinds&&c.kinds[i])||"meaning";S.track("answer_wrong",PLACES[pi].code,kind);react("confused");
      const asked=[...PLACES[pi].script.slice(0,line)].reverse().find(m=>m.who==="them");
      let why=(c.notes&&c.notes[i])||"That doesn't answer what they said.";
      let tip=KIND_TIP[kind]||KIND_TIP.meaning;
      if(kind==="meaning"&&asked&&!cfg().noTranslate)tip=`They said “${asked.ko}” (${asked.en}). ${tip}`;
      if(tries>=2){const right=c.options[c.answer];tip+=` Hint: the answer starts with “${right.split(" ")[0]}”.`;}
      b.classList.add("wrong");b.disabled=true;n.querySelector("#nt").replaceChildren(fbNote(why,tip));}
  };n.querySelector("#op").appendChild(b);});
  return n;
}
// ---------- speaking: hear, speak, check ----------
const hangulOnly=t=>String(t).replace(/[^가-힣]/g,"");
function lcs(a,b){let prev=new Array(b.length+1).fill(0);for(let i=1;i<=a.length;i++){const cur=[0];for(let j=1;j<=b.length;j++)cur[j]=a[i-1]===b[j-1]?prev[j-1]+1:Math.max(prev[j],cur[j-1]);prev=cur;}return prev[b.length];}
function speechScore(heard,target){const t=hangulOnly(target),h=hangulOnly(heard);if(!t)return 1;if(!h)return 0;return lcs(t,h)/Math.max(t.length,h.length*0.85);}
window.HC_SCORE=speechScore;
function sayBlock(hint,ko,ro){return `<p class="hint">${hint}</p><div class="sayit"><div>${esc(ko)}</div>${ro?`<small>${esc(ro)}</small>`:""}</div>
  <div class="row"><button class="act alt" data-ls>▶ Hear it</button><button class="act" data-sp>● Speak</button></div><div data-nt></div>`;}
function speakBox(n,ko,done,code){
  n.querySelector("[data-ls]").onclick=()=>speak(ko);
  const nt=n.querySelector("[data-nt]");
  const fallback=msg=>{nt.replaceChildren(el(`<div class="note info">${msg}</div>`));const b=el(`<button class="act" style="margin-top:8px;display:block;width:100%">I said it</button>`);b.onclick=()=>done("self");nt.appendChild(b);};
  n.querySelector("[data-sp]").onclick=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){fallback("Your browser can't check speech. Say it out loud, then confirm. (Chrome on Android or a laptop can check it.)");return;}
    try{const r=new SR();r.lang="ko-KR";r.maxAlternatives=3;
      r.onresult=e=>{const alts=[...e.results[0]].map(x=>x.transcript);let best=-1,h=alts[0];alts.forEach(t=>{const sc=speechScore(t,ko);if(sc>best){best=sc;h=t;}});
        if(best>=0.75){S.track("speak_score",code,Math.round(best*100));done("recognized");}
        else{S.track("speak_miss",code,h);
          nt.replaceChildren(el(`<div class="note bad fb"><b>Heard:</b> “${esc(h)}”<span class="fb-tip"><b>How to fix it:</b> ${best>=.4?"Close! Say the whole sentence in one go, a little slower.":"Tap ▶ Hear it, then copy it piece by piece using the romanization."}</span></div>`));
          const b=el(`<button class="back" style="margin-top:6px">Skip, I said it</button>`);b.onclick=()=>done("self_after_miss");nt.appendChild(b);}};
      r.onerror=()=>fallback("Couldn't use the microphone. Say it out loud, then confirm.");
      r.start();nt.replaceChildren(el(`<div class="note info">Listening… say the whole sentence.</div>`));
    }catch(e){fallback("Couldn't use the microphone. Say it out loud, then confirm.");}
  };
}
function sayTurn(c){
  const long=hangulOnly(c.ko).length>13, code=PLACES[pi].code;
  const n=el(`<div class="turn">${sayBlock(`Your turn · ${c.en}${long?" It's a longer one, so listen first.":" Say it out loud."}`,c.ko,cfg().noTranslate?"":(c.ro||rom(c.ko)))}</div>`);
  speakBox(n,c.ko,how=>{S.track("speak_done",code,how);advanceMe(c);},code);
  return n;
}

// ---------- review quiz ----------
function itemsOf(p){
  const out=[];
  (p.lesson||[]).forEach((L,i)=>{if(!/○○/.test(L.ko+L.en))out.push({id:`${p.code}:L${i}`,place:p.code,ko:L.ko,en:L.en});});
  (p.script||[]).forEach((m,i)=>{
    if(m.who==="them"&&!/\(Busan/.test(m.en))out.push({id:`${p.code}:T${i}`,place:p.code,ko:m.ko,en:m.en});
    if(m.type==="pick")out.push({id:`${p.code}:P${i}`,place:p.code,en:m.en,options:m.options,answer:m.answer,notes:m.notes,kinds:m.kinds});
  });
  return out;
}
window.HC_ITEMS=()=>CITIES.filter(c=>!c.soon).flatMap(c=>c.places.filter(p=>p.kind!=="basics").flatMap(itemsOf));
function makeQuestion(item,pool,nopts){
  if(item.options){
    let idx=item.options.map((_,i)=>i);
    if(nopts<idx.length)idx=[item.answer,...shuffle(idx.filter(i=>i!==item.answer)).slice(0,nopts-1)];
    return {item,qtype:"polite",prompt:item.en,ask:"Which is the natural thing to say?",options:shuffle(idx).map(i=>({t:item.options[i],ok:i===item.answer,note:item.notes&&item.notes[i],kind:(item.kinds&&item.kinds[i])||"meaning"}))};
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
  const covers=p.kind==="review"?p.covers:[p];
  const earlier=PLACES.slice(0,pi).filter(x=>x.kind!=="basics"&&x.kind!=="review"&&!covers.includes(x)&&stateOf(x)==="done").flatMap(itemsOf).sort((a,b)=>weight(b)-weight(a));
  const pickN=Math.min(2,earlier.length), per=Math.ceil((8-pickN)/covers.length);
  const curItems=covers.flatMap(c=>itemsOf(c).sort((a,b)=>weight(b)-weight(a)).slice(0,per)).slice(0,8-pickN);
  const chosen=[...curItems,...earlier.slice(0,pickN)];
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
      if(ok)nt.replaceChildren(el(`<div class="note info">Correct!</div>`));
      else{
        const L=lookup(), it=q.item, rightT=q.options.find(x=>x.ok).t;
        let why,tip;
        if(q.qtype==="polite"){why=o.note||"That doesn't fit this situation.";tip=`${KIND_TIP[o.kind]||KIND_TIP.meaning} The natural answer is “${rightT}”.`;}
        else if(q.qtype==="say"){const m=L.byKo[o.t];why=m?`“${o.t}” means “${m.en}”.`:`“${o.t}” says something else.`;tip=`For “${it.en}”, say “${it.ko}”${cfg().rom?` (${rom(it.ko)})`:""}.`;}
        else{const m=L.byEn[o.t];why=m?`“${o.t}” is the meaning of “${m.ko}”, a different sentence.`:"That's a different meaning.";
          tip=q.qtype==="listen"?`You heard “${it.ko}”, which means “${it.en}”. Play it again and listen for the first word, “${it.ko.split(" ")[0]}”.`:`“${it.ko}” means “${it.en}”.`;}
        nt.replaceChildren(fbNote(why,tip+" This one will come back in a later quiz."));
      }
      const nb=el(`<button class="act" style="display:block;width:100%;margin-top:8px">${rqi===RQ.length-1?"See result":"Next"}</button>`);nb.onclick=()=>{rqi++;render();};nt.appendChild(nb);
    };
    document.getElementById("op").appendChild(b);});
}
function reviewResult(){
  const p=PLACES[pi], need=Math.ceil(RQ.length*0.7), pass=rscore>=need;
  S.track("quiz_done",p.code,`${rscore}/${RQ.length}:${pass?"pass":"fail"}`);
  let next=null;
  if(pass){const fresh=stateOf(p)!=="done";setState(p,"done");next=unlockNext(p);save();if(fresh&&next)setTimeout(()=>toast(`${p.ko} passed! ${next.ko} (${next.en}) is now unlocked.`),400);}
  const nx=PLACES[PLACES.indexOf(p)+1];
  const v=sceneShell(p,`<div class="ticket ${pass?"stamped":""}"><div class="stub"><span>🚏 ${p.ko}</span><span>${pass?"PASSED":"TRY AGAIN"}</span></div>
    <div class="body"><h2>${rscore} / ${RQ.length} correct</h2>
    <p>${pass?(nx?`Great memory. ${nx.ko} (${nx.en}) is open now.`:`Great memory. You finished every place in ${city().en}!`):`You need ${need} to pass. Questions you missed come back more often. Replaying ${p.covers.map(c=>c.ko).join(" or ")} helps.`}</p>
    <div class="row">${pass?`<button class="act" id="home">Back to the map</button>`:`<button class="act" id="retry">New quiz</button><button class="act alt" id="home">Back to the map</button>`}</div></div></div>`);
  app.replaceChildren(v);wireBack();
  say(pass?"잘했어요!":"괜찮아요, 다시 해 봐요!",pass?"Well done!":"It's okay, let's try again!");
  const q=id=>document.getElementById(id);
  if(q("retry"))q("retry").onclick=()=>startReview();
  if(q("home"))q("home").onclick=()=>go("map");
}

// ---------- place cleared (after the conversation) ----------
function cleared(){
  const p=PLACES[pi], fresh=stateOf(p)!=="done";
  if(fresh)setState(p,"done");
  unlockNext(p);save();
  const i=PLACES.indexOf(p), nx=PLACES[i+1], after=PLACES[i+2];
  let msg;
  if(nx&&nx.kind==="review")msg=stateOf(nx)==="done"?`${nx.ko} is already passed. ${after?`${after.ko} (${after.en}) is open.`:""}`:`🚏 <b>${nx.ko} is now open.</b> 8 quick questions on ${nx.covers.map(c=>c.ko).join(" and ")}. Pass 6 to unlock ${after?`${after.ko} (${after.en})`:"the next city"}.`;
  else if(nx)msg=`${nx.ko} (${nx.en}) is unlocked.${after&&after.kind==="review"?` After it comes 🚏 ${after.ko}, a short quiz on both places.`:""}`;
  else msg="That was the last place here.";
  const words=p.words||[];
  const v=sceneShell(p,`<div class="ticket stamped"><div class="stub"><span>PLACE CLEARED · ${p.ko}</span><span>${mistakes?`${mistakes} SLIP${mistakes>1?"S":""}`:"PERFECT"}</span></div>
    <div class="body"><h2>${mistakes?"Nice work!":"Perfect conversation!"}</h2><p>${msg}</p>
    ${fresh&&words.length?`<div class="newcards"><span>+${words.length} word cards</span><b>${words.map(w=>w.emo).join(" ")}</b></div>`:""}
    <div class="row"><button class="act" id="tomission">Real-life mission</button>${nx&&nx.kind==="review"&&stateOf(nx)==="open"?`<button class="act alt" id="tostation">Start review now</button>`:""}</div>
    <button class="back" id="home" style="align-self:center">Back to the map</button></div></div>`);
  app.replaceChildren(v);wireBack();react("happy");
  say(mistakes?"잘했어요!":"완벽해요!",mistakes?"Well done!":"Perfect!");
  if(fresh)S.track("place_done",p.code,mistakes);
  const q=id=>document.getElementById(id);
  q("tomission").onclick=()=>{missionStage="ticket";go("missionView");};
  if(q("tostation"))q("tostation").onclick=()=>{pi=i+1;S.track("station_start",nx.code,"after_place");startReview();};
  q("home").onclick=()=>go("map");
}

// ---------- word cards ----------
const allWords=()=>CITIES.filter(c=>!c.soon).flatMap(c=>c.places).filter((p,i,a)=>a.indexOf(p)===i).flatMap(p=>(p.words||[]).map((w,k)=>({...w,id:`${p.code}:${k}`,place:p})));
function myWords(){return allWords().filter(w=>stateOf(w.place)==="done");}
let WD=[], wi=0, wscore=0, wmode="write", wtries=0, whint=0, wtyped="";
function words(){
  const all=allWords(), mine=new Set(myWords().map(w=>w.id));
  const enough=mine.size>=4;
  const v=el(`<div class="col">
    <div class="topbar"><button class="back" id="back">← Map</button><span class="where">단어 카드 · Word cards</span></div>
    <div class="hero"><h1>${mine.size}<span class="en-title"> / ${all.length} cards</span></h1>
      <p>Every place you clear gives you its key words. Play to name each picture in Korean: write it or say it.</p></div>
    <div class="panel">${enough?`<button class="act" id="play">Play ${Math.min(10,mine.size)} cards</button>`:`<div class="note info">Clear ${mine.size?"one more place":"your first place"} to start playing. You need at least 4 cards.</div>`}</div>
    <div class="cardgrid">${all.map(w=>mine.has(w.id)?`<div class="wcard"><span class="emo">${w.emo}</span><b>${w.ko}</b><small>${esc(w.en)}</small></div>`
      :`<div class="wcard off"><span class="emo">?</span><small>${w.place.ko}</small></div>`).join("")}</div></div>`);
  app.replaceChildren(v);
  document.getElementById("back").onclick=()=>go("map");
  const pl=document.getElementById("play");
  if(pl)pl.onclick=()=>{const weight=w=>(P.wrong["w:"+w.id]||0)*2+Math.random();
    WD=myWords().sort((a,b)=>weight(b)-weight(a)).slice(0,10);WD=shuffle(WD).map(w=>({...w,again:false}));wi=0;wscore=0;wtries=0;whint=cfg().autoEn?1:0;wtyped="";
    S.track("words_start","",WD.length);go("wordplay");};
}
function wordplay(){
  if(wi>=WD.length){
    const total=WD.filter(w=>!w.again).length;
    const v=el(`<div class="col"><div class="ticket stamped"><div class="stub"><span>단어 카드 · WORD CARDS</span><span>DONE</span></div>
      <div class="body"><h2>${wscore} / ${total} named on the first try</h2><p>Cards you missed come back more often next time.</p>
      <div class="row"><button class="act" id="again">Play again</button><button class="act alt" id="coll">My cards</button></div>
      <button class="back" id="home" style="align-self:center">Back to the map</button></div></div></div>`);
    app.replaceChildren(v);S.track("words_done","",`${wscore}/${total}`);
    document.getElementById("again").onclick=()=>{go("words");setTimeout(()=>{const b=document.getElementById("play");b&&b.click();},0);};
    document.getElementById("coll").onclick=()=>go("words");document.getElementById("home").onclick=()=>go("map");return;
  }
  const w=WD[wi], others=allWords().filter(x=>x.ko!==w.ko);
  const syl=[...w.ko];
  const decoys=shuffle([...new Set(others.flatMap(x=>[...x.ko]))].filter(c=>!syl.includes(c))).slice(0,Math.max(2,4-syl.length));
  const tiles=shuffle([...syl,...decoys]);
  const v=el(`<div class="col">
    <div class="topbar"><button class="back" id="back">← Cards</button><span class="where">Card ${wi+1} of ${WD.length}${w.again?" · again":""}</span></div>
    <div class="progress"><i style="width:${100*wi/WD.length}%"></i></div>
    <div class="flash"><span class="emo">${w.emo}</span>${whint?`<span class="fhint">${esc(w.en)}${whint>1?` · starts with ${syl[0]}`:""}</span>`:""}</div>
    <div class="turn">
      <p class="hint">What is this in Korean?</p>
      ${seg("wm",[["write","✍️ Write"],["speak","🎤 Speak"]])}
      <div id="wbox"></div><div id="nt"></div>
      <div class="row"><button class="act alt" id="hint">${whint>=2?"No more hints":"Hint"}</button><button class="act alt" id="idk">Show me</button></div>
    </div></div>`);
  app.replaceChildren(v);
  v.querySelectorAll(".seg [data-v]").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.v===wmode?"true":"false");b.onclick=()=>{wmode=b.dataset.v;wordplay();};});
  document.getElementById("back").onclick=()=>go("words");
  const nt=document.getElementById("nt"), box=document.getElementById("wbox");
  let done=false;
  const finish=(ok,how)=>{if(done)return;done=true;
    const first=!w.again&&wtries===0;
    P.wrong["w:"+w.id]=Math.max(0,(P.wrong["w:"+w.id]||0)+(ok&&first?-1:1));save();
    S.track("word_answer",w.place.code,`${w.ko}:${ok?1:0}:${how}`);
    if(ok&&first)wscore++;
    if(!ok&&!w.again)WD.push({...w,again:true});
    speak(w.ko);
    nt.replaceChildren(el(ok?`<div class="note ok">✓ ${w.ko} <span class="small">(${rom(w.ko)}) · ${esc(w.en)}</span></div>`:`<div class="note bad fb"><b>The answer:</b> ${w.ko} (${rom(w.ko)}) · ${esc(w.en)}<span class="fb-tip"><b>How to remember it:</b> you learned it at ${w.place.ko}. This card comes back at the end of the round.</span></div>`));
    const nb=el(`<button class="act" style="display:block;width:100%;margin-top:8px">${wi===WD.length-1?"Finish":"Next card"}</button>`);
    nb.onclick=()=>{wi++;wtries=0;whint=cfg().autoEn?1:0;wtyped="";wordplay();};nt.appendChild(nb);nb.focus({preventScroll:true});
    v.querySelectorAll("#wbox button,#wbox input,#hint,#idk").forEach(x=>x.disabled=true);};
  const wrongTry=(why,tip)=>{wtries++;react("confused");
    if(wtries>=3){finish(false,"gave_up");return;}
    nt.replaceChildren(fbNote(why,tip+(wtries===2?` Hint: it starts with “${syl[0]}”.`:"")));};
  if(wmode==="write"){
    box.innerHTML=`<input id="wi" class="winput" lang="ko" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type in Korean" value="${esc(wtyped)}">
      <p class="small">No Korean keyboard? Tap the blocks:</p>
      <div class="bank">${tiles.map(t=>`<button class="tile" data-t="${t}">${t}</button>`).join("")}<button class="tile" data-del>⌫</button></div>
      <button class="act" id="chk">Check</button>`;
    const inp=document.getElementById("wi");
    inp.oninput=()=>{wtyped=inp.value;};
    box.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{inp.value+=b.dataset.t;wtyped=inp.value;});
    box.querySelector("[data-del]").onclick=()=>{inp.value=[...inp.value].slice(0,-1).join("");wtyped=inp.value;};
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("chk").click();});
    document.getElementById("chk").onclick=()=>{const a=inp.value.replace(/\s/g,"");if(!a)return;
      if(a===w.ko.replace(/\s/g,"")){finish(true,"write");return;}
      const m=allWords().find(x=>x.ko===a);
      if(m)wrongTry(`“${a}” means “${m.en}” ${m.emo}.`,"Look at the picture again.");
      else if(/[a-z]/i.test(a))wrongTry("That's in English letters.","Write it in Hangul. Use the blocks below if you don't have a Korean keyboard.");
      else if(a.length!==syl.length)wrongTry(`“${a}” has ${a.length} block${a.length>1?"s":""}. The word has ${syl.length}.`,"Count the syllable blocks and try again.");
      else{const k=[...a].findIndex((c,j)=>c!==syl[j]);wrongTry(`Close, but block ${k+1} (“${[...a][k]}”) is off.`,`Read it out loud: ${rom(a)}. Does that sound like the thing in the picture?`);}
      inp.value="";wtyped="";};
  }else{
    box.innerHTML=`<button class="act" data-sp2>● Speak</button><div data-nt2></div>`;
    box.querySelector("[data-sp2]").onclick=()=>{
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition, n2=box.querySelector("[data-nt2]");
      if(!SR){n2.replaceChildren(el(`<div class="note info">Your browser can't check speech. Use ✍️ Write, or try Chrome.</div>`));return;}
      try{const r=new SR();r.lang="ko-KR";r.maxAlternatives=5;
        r.onresult=e=>{const alts=[...e.results[0]].map(x=>x.transcript);
          if(alts.some(t=>hangulOnly(t).includes(hangulOnly(w.ko))))finish(true,"speak");
          else wrongTry(`Heard “${esc(alts[0])}”.`,"Say just the word, clearly. Tap Hint if you're not sure.");};
        r.onerror=()=>n2.replaceChildren(el(`<div class="note info">Couldn't use the microphone. Try ✍️ Write.</div>`));
        r.start();n2.replaceChildren(el(`<div class="note info">Listening…</div>`));
      }catch(e){n2.replaceChildren(el(`<div class="note info">Couldn't use the microphone. Try ✍️ Write.</div>`));}
    };
  }
  document.getElementById("hint").onclick=()=>{if(whint<2){whint++;S.track("word_hint",w.place.code,w.ko);wordplay();}};
  document.getElementById("idk").onclick=()=>finish(false,"show");
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

// ---------- self-introduction ----------
const COUNTRY_KO={uzbekistan:"우즈베키스탄",vietnam:"베트남","viet nam":"베트남",china:"중국",japan:"일본",mongolia:"몽골",russia:"러시아",kazakhstan:"카자흐스탄",kyrgyzstan:"키르기스스탄",tajikistan:"타지키스탄",turkmenistan:"투르크메니스탄",
  indonesia:"인도네시아",india:"인도",nepal:"네팔",pakistan:"파키스탄",bangladesh:"방글라데시","sri lanka":"스리랑카",myanmar:"미얀마",cambodia:"캄보디아",thailand:"태국",philippines:"필리핀",malaysia:"말레이시아",laos:"라오스",
  usa:"미국",us:"미국","united states":"미국",america:"미국",canada:"캐나다",mexico:"멕시코",brazil:"브라질",uk:"영국","united kingdom":"영국",england:"영국",france:"프랑스",germany:"독일",spain:"스페인",italy:"이탈리아",
  netherlands:"네덜란드",poland:"폴란드",ukraine:"우크라이나",turkey:"튀르키예","türkiye":"튀르키예",egypt:"이집트",nigeria:"나이지리아",kenya:"케냐",morocco:"모로코",australia:"호주","new zealand":"뉴질랜드",
  taiwan:"대만","hong kong":"홍콩",singapore:"싱가포르",iran:"이란","saudi arabia":"사우디아라비아",azerbaijan:"아제르바이잔",sweden:"스웨덴",norway:"노르웨이",finland:"핀란드",colombia:"콜롬비아",peru:"페루",chile:"칠레",argentina:"아르헨티나"};
function koCountry(c){c=String(c||"").trim();if(/[가-힣]/.test(c))return c;return COUNTRY_KO[c.toLowerCase()]||"";}
function introSentence(){
  const nick=profile.nick||"";let end="이에요";
  const last=nick.slice(-1);
  if(/[가-힣]/.test(last))end=((last.charCodeAt(0)-0xAC00)%28)?"이에요":"예요";
  else if(/[aeiouy]$/i.test(nick))end="예요";
  const c=koCountry(profile.country);
  return `안녕하세요. 저는 ${nick}${end}. ${c?`${c}에서 왔어요. `:""}만나서 반가워요!`;
}

// ---------- 한글 학교 (basics) ----------
let ui=0, uphase="cards", uk=0, uq=0, umiss=0, built={L:null,V:null};
const LJ="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ", VJ="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const compose=(l,v)=>String.fromCharCode(0xAC00+(LJ.indexOf(l)*21+VJ.indexOf(v))*28);
const decompose=ch=>{const c=ch.charCodeAt(0)-0xAC00;return {L:LJ[Math.floor(c/588)],V:VJ[Math.floor((c%588)/28)]};};
function finishBasics(how){
  const fresh=stateOf(BASICS)!=="done";setState(BASICS,"done");const next=unlockNext(BASICS);save();
  S.track("basics_done",BASICS.code,how);
  if(fresh&&next)setTimeout(()=>toast(`${BASICS.ko} cleared! ${next.ko} (${next.en}) is now unlocked.`),300);
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
  const wrong=(why,tip)=>{umiss++;S.track("basics_wrong",p.code,u.id);react("confused");nt.replaceChildren(fbNote(why,tip));};
  // letter <-> sound map from this unit's teaching cards (e.g. "ㅋ ㅌ ㅍ ㅊ" / "k t p ch")
  const SND={};p.units.forEach(un=>un.cards.forEach(cd=>{const a=cd.big.split(" "),b=cd.sound.split(/\s*\/\s*|\s+/);
    if(/^[ㄱ-ㅣ]( [ㄱ-ㅣ])*$/.test(cd.big)){if(a.length===1)SND[a[0]]={sound:cd.sound,note:cd.note};else if(a.length===b.length)a.forEach((x,k)=>SND[x]={sound:b[k],note:cd.note});}}));
  const soundOf=x=>SND[x]&&SND[x].sound, letterOf=snd=>Object.keys(SND).find(k=>SND[k].sound===snd);
  function explain(i){
    const o=q.options[i], r=q.options[q.answer];
    if(q.notes&&q.notes[i])return [q.notes[i],u.id==="numbers"?"Sino numbers (일, 이, 삼) for money, floors, minutes. Native numbers (하나, 둘, 셋) for people, things, hours.":"Think about the situation, then try again."];
    if(SND[q.prompt]&&letterOf(o))return [`“${o}” is the sound of ${letterOf(o)}, not ${q.prompt}.`,`${q.prompt} sounds “${soundOf(q.prompt)}”. ${SND[q.prompt].note}`];
    if(SND[o])return [`${o} makes the “${soundOf(o)}” sound.`,SND[r]?`The answer is ${r}: ${SND[r].note}`:"Play it again and compare."];
    if(/[가-힣]/.test(q.prompt)&&!/[가-힣]/.test(o))return [`“${q.prompt}” reads “${rom(q.prompt)}”, not “${o}”.`,"Read it out loud, one block at a time. Many words are borrowed from English."];
    if(q.speak&&/[가-힣]/.test(o))return [`“${o}” reads “${rom(o)}”. The word you heard is different.`,`Play it again. It sounds like “${rom(q.speak)}”.`];
    return ["That's not the one.","Look at the teaching cards again, then try another option."];
  }
  if(q.type==="say"){
    const sent=introSentence();
    box.innerHTML=sayBlock(`${q.prompt} It uses your nickname${koCountry(profile.country)?" and country":""}.`,sent,rom(sent));
    say("자기소개 해 볼까요?","Shall we introduce ourselves?");
    speakBox(box,sent,how=>{S.track("basics_say",p.code,how);right();},p.code);
    return;
  }
  if(q.type==="pick"){
    box.innerHTML=`${q.speak?`<p class="hint">${q.prompt}</p><button class="act alt" id="play" style="display:block">▶ Play again</button>`:`<p class="hint">${/[가-힣ㄱ-ㅣ0-9]/.test(q.prompt)&&q.prompt.length<12?"What is this?":"Which one fits?"}</p><div class="${q.prompt.length<12?"bigglyph":"qtext"}">${q.prompt}</div>`}<div class="opts grid2opts" id="op"></div>`;
    say(q.speak?"잘 들어 보세요.":"정답은 무엇일까요?",q.speak?"Listen carefully.":"What's the answer?");
    if(q.speak){setTimeout(()=>speak(q.speak),900);document.getElementById("play").onclick=()=>speak(q.speak);}
    shuffle(q.options.map((o,i)=>i)).forEach(i=>{const b=el(`<button class="opt">${q.options[i]}</button>`);
      b.onclick=()=>{if(i===q.answer){b.classList.add("right");if(/[가-힣]/.test(q.options[i]))speak(q.options[i]);right();}else{b.classList.add("wrong");b.disabled=true;const [w,t]=explain(i);wrong(w,t);}};
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
        else{const made=compose(built.L,built.V), tr=rom(q.target), mr=rom(made);
          if(built.L!==t.L)wrong(`You built ${made} (“${mr}”). The first sound is off.`,`“${tr}” starts with “${tr.replace(/[aeiouwy].*$/,"")||"no consonant sound"}”, so pick ${t.L}${t.L==="ㅇ"?" (silent at the start)":""}.`);
          else wrong(`You built ${made} (“${mr}”). The consonant is right, but the vowel is off.`,`“${tr}” ends with “${tr.slice(rom(compose(t.L,"ㅏ")).length-1)}”. Try ${t.V}.`);}
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

// ---------- install as an app ----------
let installEvt=null;
const standalone=()=>(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;
const isIOS=(/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1))&&/Safari/.test(navigator.userAgent)&&!/CriOS|FxiOS|EdgiOS|KAKAOTALK|Instagram|FBAN|FBAV|Line\//.test(navigator.userAgent); // Safari only: in-app browsers can't add to home screen
try{if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});}catch(e){}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;if(view==="map")setTimeout(maybeInstall,800);});
window.addEventListener("appinstalled",()=>{S.track("app_installed");installEvt=null;document.getElementById("inst")?.remove();});
function maybeInstall(){
  if(!profile||standalone()||view!=="map"||document.getElementById("inst"))return;
  const ask=store.get("hc_install_ask",{n:0,t:0});
  if(ask.n>=2||(ask.n===1&&Date.now()-ask.t<3*864e5))return;           // ask at most twice, 3 days apart
  if(stateOf(BASICS)!=="done"&&clearedCount()<1)return;                 // only after they've finished something
  if(!installEvt&&!isIOS)return;
  store.set("hc_install_ask",{n:ask.n+1,t:Date.now()});S.track("install_prompt",isIOS?"ios":"android",ask.n+1);
  const ios=!installEvt;
  const sh=el(`<div class="sheet-bg" id="inst"><div class="sheet" role="dialog" aria-label="Install Hangul City">
    <img src="img/icon-192.png" alt="" width="64" height="64">
    <h2>Install Hangul City</h2>
    <p>Open it from your home screen like an app: full screen, one tap, your progress stays.</p>
    ${ios?`<ol class="ios-steps"><li>Tap <b>Share</b> <span class="ios-ico">⬆︎</span> at the bottom of Safari</li><li>Choose <b>Add to Home Screen</b></li><li>Tap <b>Add</b></li></ol>`:""}
    <div class="row">${ios?`<button class="act" id="instok">Got it</button>`:`<button class="act" id="instyes">Install</button><button class="act alt" id="instno">Not now</button>`}</div>
  </div></div>`);
  document.body.appendChild(sh);
  const close=how=>{S.track("install_choice","",how);sh.remove();};
  sh.addEventListener("click",e=>{if(e.target===sh)close("outside");});
  const q=id=>document.getElementById(id);
  if(q("instok"))q("instok").onclick=()=>close("ios_ok");
  if(q("instno"))q("instno").onclick=()=>close("later");
  if(q("instyes"))q("instyes").onclick=async()=>{const ev=installEvt;installEvt=null;sh.remove();
    try{ev.prompt();const r=await ev.userChoice;S.track("install_choice","",r.outcome);if(r.outcome==="accepted")toast("Installed! Find Hangul City on your home screen.");}catch(e){}};
}

function go(v){view=v;render();window.scrollTo({top:0});}
function render(){
  clearInterval(typeTimer);clearInterval(turnTimer);
  ({welcome,placeIntro,placement,survey,map:mapView,intro,learn,practice,review,cleared,words,wordplay,missionView,units:unitsView,unit:unitView,rooms})[view]();
}
render();
})();
