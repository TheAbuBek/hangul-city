// Usage tracking for Module 2. Every event is one row in the Google Sheet:
// time | user id | nickname | event | place | detail | country | level | months in Korea
(function(){
  const store={
    get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
    set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  };
  function uid(){
    let id=store.get("ssk_uid",null);
    if(!id){id="u"+Math.random().toString(36).slice(2,10);store.set("ssk_uid",id);}
    return id;
  }
  let queue=store.get("ssk_queue",[]);
  let sending=false;
  async function flush(){
    const url=window.SSK_ENDPOINT;
    if(!url||sending||!queue.length) return;
    sending=true;
    const batch=queue.slice(0,50);
    try{
      await fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({rows:batch})});
      queue=queue.slice(batch.length);store.set("ssk_queue",queue);
    }catch(e){/* offline: keep the queue and try again next time */}
    sending=false;
    if(queue.length) setTimeout(flush,1500);
  }
  window.SSK={
    store, uid,
    track(event,place="",detail=""){
      const p=store.get("ssk_profile",{});
      const row={t:new Date().toISOString(),uid:uid(),nick:p.nick||"",event,place,detail:String(detail),country:p.country||"",level:p.level||"",months:p.months||""};
      queue.push(row);store.set("ssk_queue",queue);
      const log=store.get("ssk_log",[]);log.push(row);store.set("ssk_log",log.slice(-500));
      flush();
    },
    flush
  };
  window.addEventListener("online",flush);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush();});
})();
