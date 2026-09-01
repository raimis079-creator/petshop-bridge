import { execSync } from "child_process"; import fs from "fs"; import crypto from "crypto";
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{')) r='{'+r; if(!r.endsWith('}')) r+='}'; return JSON.parse(r); }
const b64url=(b)=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(){ const sa=loadSA(); const now=Math.floor(Date.now()/1000);
 const h=b64url(JSON.stringify({alg:'RS256',typ:'JWT'})), c=b64url(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/webmasters.readonly',aud:sa.token_uri,exp:now+3600,iat:now}));
 const s=crypto.createSign('RSA-SHA256'); s.update(h+'.'+c); const sig=s.sign(sa.private_key).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const r=await fetch(sa.token_uri,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:h+'.'+c+'.'+sig})}); return (await r.json()).access_token; }
function putFile(n,s){ const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN; const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha='';
 try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
 const body={message:'gsc',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body));
 execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"'); }
const SITE=encodeURIComponent('sc-domain:petshop.lt'); const d=(n)=>{const x=new Date(); x.setUTCDate(x.getUTCDate()-n); return x.toISOString().slice(0,10);};
(async()=>{ const out={}; try{ const t=await token(); const q=async(b)=>{ const r=await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites/'+SITE+'/searchAnalytics/query',{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(b)}); return (await r.json()); };
 const END=d(3), S28=d(30), P28s=d(58), P28e=d(31), S90=d(92);
 out.window={end:END,last28:[S28,END],prev28:[P28s,P28e]};
 const daily=await q({startDate:S90,endDate:END,dimensions:['date'],rowLimit:100}); out.daily=(daily.rows||[]).map(r=>[r.keys[0],r.clicks,r.impressions,+r.position.toFixed(1)]);
 const sum=(rows,a,b)=>rows.filter(r=>r[0]>=a&&r[0]<=b).reduce((o,r)=>({c:o.c+r[1],i:o.i+r[2],n:o.n+1,p:o.p+r[3]}),{c:0,i:0,n:0,p:0});
 const L=sum(out.daily,S28,END), P=sum(out.daily,P28s,P28e); out.tot={last28:{clicks:L.c,impr:L.i,pos:+(L.p/L.n).toFixed(1)},prev28:{clicks:P.c,impr:P.i,pos:+(P.p/P.n).toFixed(1)}};
 const pages=await q({startDate:S28,endDate:END,dimensions:['page'],rowLimit:25}); out.pages=(pages.rows||[]).map(r=>[r.keys[0].replace('https://petshop.lt',''),r.clicks,r.impressions,+r.position.toFixed(1)]);
 const pagesAll=await q({startDate:S28,endDate:END,dimensions:['page'],rowLimit:5000}); const pa=pagesAll.rows||[]; out.pages_n=pa.length; out.pages_clicked=pa.filter(r=>r.clicks>0).length; out.pages_top10=pa.filter(r=>r.position<=10).length;
 const qs=await q({startDate:S28,endDate:END,dimensions:['query'],rowLimit:20}); out.queries=(qs.rows||[]).map(r=>[r.keys[0],r.clicks,r.impressions,+r.position.toFixed(1)]);
 const dev=await q({startDate:S28,endDate:END,dimensions:['device']}); out.device=(dev.rows||[]).map(r=>[r.keys[0],r.clicks,r.impressions]);
 const sm=await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites/'+SITE+'/sitemaps',{headers:{Authorization:'Bearer '+t}}); out.sitemaps=((await sm.json()).sitemap||[]).map(s=>({path:s.path,last:s.lastDownloaded,warn:s.warnings,err:s.errors,contents:(s.contents||[]).map(c=>c.type+':'+c.submitted+'/'+c.indexed)}));
 }catch(e){ out.ERR=String(e); }
 putFile('gsc_live.json',JSON.stringify(out)); console.log(JSON.stringify(out.tot||out.ERR)); })();
