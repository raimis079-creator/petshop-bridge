import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{'))r='{'+r; if(!r.endsWith('}'))r=r+'}'; return JSON.parse(r); }
const b64url=(b)=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(scopes){
  const sa=loadSA(); const now=Math.floor(Date.now()/1000);
  const h=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const c=b64url(JSON.stringify({iss:sa.client_email,scope:scopes,aud:sa.token_uri,exp:now+3600,iat:now}));
  const s=crypto.createSign('RSA-SHA256'); s.update(h+'.'+c);
  const sig=s.sign(sa.private_key).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r=await fetch(sa.token_uri,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:h+'.'+c+'.'+sig})});
  const j=await r.json(); if(!j.access_token) throw new Error('TOKEN FAIL: '+JSON.stringify(j).slice(0,200));
  return j.access_token;
}

L('############ SEARCH CONSOLE API PATIKRA ############'); L('');
L('SA: claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com'); L('');

try{
  const t = await token('https://www.googleapis.com/auth/webmasters.readonly');
  L('✅ AUTH OK (webmasters.readonly scope gautas)'); L('');

  L('=== 1. GET /webmasters/v3/sites (kokias property mato SA) ===');
  const r = await fetch('https://www.googleapis.com/webmasters/v3/sites',{headers:{Authorization:'Bearer '+t}});
  const txt = await r.text();
  L('  HTTP '+r.status);
  if(r.status===200){
    const j=JSON.parse(txt);
    const sites=j.siteEntry||[];
    L('  matomu property: '+sites.length);
    sites.forEach(s=>L('    '+s.siteUrl+'   permission='+s.permissionLevel));
    if(sites.length===0){
      L('');
      L('  ⚠️ API VEIKIA, bet SA nepridetas ne prie vienos property.');
      L('     Reikia: GSC → Nustatymai → Naudotojai ir teises → Prideti naudotoja');
      L('     El. pastas: claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com');
      L('     Teises: „Visos" (Full) arba „Ribotos" (Restricted) — uztenka Restricted');
    }
  } else if(r.status===403){
    L('  ❌ 403');
    L('  '+txt.slice(0,500));
    if(/has not been used|is disabled|SERVICE_DISABLED/i.test(txt)){
      L('');
      L('  >>> Search Console API NEIJUNGTA Cloud projekte.');
      L('      Ijungti: console.cloud.google.com/apis/library/searchconsole.googleapis.com');
      L('      Projektas: prefab-envoy-482617-b4 (Petshop Google Ads)');
    }
  } else {
    L('  '+txt.slice(0,400));
  }
  L('');

  L('=== 2. Bandom searchanalytics.query (jei property matoma) ===');
  for(const site of ['https://petshop.lt/','sc-domain:petshop.lt','http://petshop.lt/']){
    const enc=encodeURIComponent(site);
    const q=await fetch('https://www.googleapis.com/webmasters/v3/sites/'+enc+'/searchAnalytics/query',{
      method:'POST', headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},
      body: JSON.stringify({ startDate:'2025-03-01', endDate:'2026-07-01', dimensions:['page'], rowLimit:3 })
    });
    const qt=await q.text();
    L('  '+site.padEnd(28)+' -> HTTP '+q.status);
    if(q.status===200){
      const j=JSON.parse(qt);
      L('    ✅ VEIKIA. eiluciu: '+((j.rows||[]).length));
      (j.rows||[]).forEach(row=>L('      '+row.keys[0].slice(0,60)+'  clicks='+row.clicks+'  impr='+row.impressions+'  pos='+row.position.toFixed(1)));
      break;
    } else {
      L('    '+qt.slice(0,180).replace(/\s+/g,' '));
    }
  }
}catch(e){ L('!!! '+e.message.slice(0,250)); }
putFile('gsc_api_check.txt', out); console.log(out);
