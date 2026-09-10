// S1668 MC READ-ONLY: produktų nuorodos, feed'ai, statusai (tik GET)
import { putFile } from './gtm_lib.mjs'; import crypto from 'crypto';
const o={v:'S1668 mc'}; const M='5321054797';
const b64u=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
try{
  let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{')) r='{'+r; if(!r.endsWith('}')) r+='}'; const sa=JSON.parse(r);
  const now=Math.floor(Date.now()/1000); const h=b64u(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const c=b64u(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/content',aud:sa.token_uri,exp:now+3600,iat:now}));
  const s=crypto.createSign('RSA-SHA256'); s.update(h+'.'+c); const sig=s.sign(sa.private_key).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const tk=(await (await fetch(sa.token_uri,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:h+'.'+c+'.'+sig})})).json()).access_token;
  const G=async p=>{const x=await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+M+p,{headers:{Authorization:'Bearer '+tk}}); return {st:x.status,j:await x.json()};};
  const df=await G('/datafeeds'); o.feeds=(df.j.resources||[]).map(f=>({id:f.id,name:f.name,url:f.fetchSchedule&&f.fetchSchedule.fetchUrl,sched:f.fetchSchedule&&(f.fetchSchedule.hour+'h '+(f.fetchSchedule.weekday||'daily')),targets:JSON.stringify(f.targets||[]).slice(0,120)})); o.feeds_st=df.st;
  const ds=await G('/datafeedstatuses'); o.feed_status=(ds.j.resources||[]).map(f=>({id:f.datafeedId,st:f.processingStatus,items:f.itemsTotal,valid:f.itemsValid,last:f.lastUploadDate,err:(f.errors||[]).slice(0,4).map(e=>e.code+':'+e.count+':'+e.message)}));
  // produktai
  let pt='',n=0; const hosts={},kel={},src={},sample=[];
  for(let i=0;i<40;i++){ const p=await G('/products?maxResults=250'+(pt?'&pageToken='+pt:'')); if(p.st!==200){o.prod_err=p.st+' '+JSON.stringify(p.j).slice(0,200);break;}
    for(const x of (p.j.resources||[])){ n++; let u; try{u=new URL(x.link);}catch(e){continue;}
      hosts[u.host]=(hosts[u.host]||0)+1; const k=u.pathname.startsWith('/product/')?'/product/':(u.pathname.split('/').filter(Boolean).length<=1?'root-1seg':'kita'); kel[k]=(kel[k]||0)+1;
      src[x.source||'?']=(src[x.source||'?']||0)+1; if(k!=='/product/'&&sample.length<12) sample.push(x.link); }
    pt=p.j.nextPageToken; if(!pt) break; }
  o.prod={n,hosts,kel,src,sample};
  // statusai: tik suvestinė
  let st='',agg={},issues={},m=0;
  for(let i=0;i<40;i++){ const p=await G('/productstatuses?maxResults=250'+(st?'&pageToken='+st:'')); if(p.st!==200){o.ps_err=p.st;break;}
    for(const x of (p.j.resources||[])){ m++; for(const d of (x.destinationStatuses||[])){ const k=d.destination+':'+d.status; agg[k]=(agg[k]||0)+1; }
      for(const is of (x.itemLevelIssues||[])){ if(is.servability!=='disapproved'&&is.servability!=='demoted') continue; const k=is.code+' ('+is.servability+')'; issues[k]=(issues[k]||0)+1; } }
    st=p.j.nextPageToken; if(!st) break; }
  o.statusai={m,agg,issues:Object.fromEntries(Object.entries(issues).sort((a,b)=>b[1]-a[1]).slice(0,15))};
}catch(e){ o.klaida=String(e).slice(0,300); }
putFile('s1668_mc.json', JSON.stringify(o,null,1)); console.log('OK');
