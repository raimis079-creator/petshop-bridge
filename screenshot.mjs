import { gtmToken, gtm, CT } from './gtm_lib.mjs';
const TOK=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const out={v:'S1578b'};
try{ const t=await gtmToken(); const v=(await gtm(t,'/'+CT+'/versions:live')).body;
  for(const x of (v.trigger||[])) if(['17','18','38','39','40'].includes(x.triggerId)) out[x.triggerId+' '+x.name]={type:x.type,customEventFilter:x.customEventFilter,filter:x.filter};
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('analize/s1578b_gtm.json',Buffer.from(JSON.stringify(out,null,1)),'S1578b'); console.log('ok');
