// S1668 GTM READ-ONLY: live versijos žymos ir trigeriai (tik GET)
import { putFile, gtmToken, gtm, CT } from './gtm_lib.mjs';
const o={v:'S1668 gtm'};
try{
  const t=await gtmToken();
  const lv=await gtm(t,'/'+CT+'/versions:live'); const v=lv.body;
  o.status=lv.status; o.ver={id:v.containerVersionId,name:v.name,kurta:v.fingerprint};
  const tr={}; (v.trigger||[]).forEach(x=>tr[x.triggerId]=x.name);
  const pv=(p)=>{const r={};(p||[]).forEach(q=>{ if(q.value!==undefined) r[q.key]=String(q.value).slice(0,120); else if(q.list) r[q.key]='[list '+q.list.length+']'; }); return r;};
  o.tags=(v.tag||[]).map(x=>({id:x.tagId,n:x.name,type:x.type,paused:!!x.paused,fire:(x.firingTriggerId||[]).map(i=>tr[i]||i),block:(x.blockingTriggerId||[]).map(i=>tr[i]||i),p:pv(x.parameter),consent:x.consentSettings?JSON.stringify(x.consentSettings).slice(0,120):''}));
  o.triggers=(v.trigger||[]).map(x=>({id:x.triggerId,n:x.name,type:x.type,ce:JSON.stringify(x.customEventFilter||[]).slice(0,200),f:JSON.stringify(x.filter||[]).slice(0,300)}));
  o.vars=(v.variable||[]).filter(x=>/host|url|page|dev|conv|value|trans/i.test(x.name)).map(x=>({n:x.name,type:x.type,p:pv(x.parameter)}));
  const vs=await gtm(t,'/'+CT+'/version_headers'); o.headers=(vs.body.containerVersionHeader||[]).slice(-4).map(h=>({id:h.containerVersionId,n:h.name}));
}catch(e){ o.klaida=String(e).slice(0,300); }
putFile('s1668_gtm.json', JSON.stringify(o,null,1));
console.log('OK');
