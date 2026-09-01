import { gtmToken, gtm, CT } from './gtm_lib.mjs';
const TOK=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const out={v:'S1578'};
try{
  const t=await gtmToken();
  const live=await gtm(t,'/'+CT+'/versions:live'); const v=live.body; out.live_status=live.status;
  out.versija={id:v.containerVersionId,name:v.name,desc:(v.description||'').slice(0,200),tags:(v.tag||[]).length,triggers:(v.trigger||[]).length,vars:(v.variable||[]).length};
  const trg={}; for(const x of (v.trigger||[])){ trg[x.triggerId]={name:x.name,type:x.type,filt:(x.customEventFilter||x.filter||[]).map(f=>f.parameter.map(p=>p.value).join(' ')).slice(0,3)}; }
  out.triggers=trg;
  out.tags=(v.tag||[]).map(x=>({id:x.tagId,name:x.name,type:x.type,paused:!!x.paused,fire:(x.firingTriggerId||[]).map(i=>(trg[i]||{}).name||i),block:(x.blockingTriggerId||[]),consent:x.consentSettings?{s:x.consentSettings.consentStatus,t:(x.consentSettings.consentType||{}).list?.map(l=>l.value)}:null,params:(x.parameter||[]).filter(p=>/measurementId|tagId|pixelId|conversionId|html/.test(p.key)).map(p=>p.key+'='+String(p.value||'').slice(0,80))}));
  const ws=await gtm(t,'/'+CT+'/workspaces'); out.workspaces=(ws.body.workspace||[]).map(w=>w.name);
  const st=await gtm(t,'/'+CT+'/workspaces/'+((ws.body.workspace||[])[0]||{}).workspaceId+'/status'); out.ws_pakeitimai={tags:(st.body.workspaceChange||[]).length,status:st.status};
  const vh=await gtm(t,'/'+CT+'/version_headers'); out.version_headers=(vh.body.containerVersionHeader||[]).slice(-5).map(h=>h.containerVersionId+' '+h.name);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('analize/s1578_gtm.json',Buffer.from(JSON.stringify(out,null,1)),'S1578 gtm recon'); console.log('ok');
