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
  const j=await r.json(); if(!j.access_token) throw new Error('TOKEN FAIL '+JSON.stringify(j).slice(0,150));
  return j.access_token;
}

L('############ PRIEIGU SUVESTINE ############'); L('');
const PROP='346051580';

try{
  // ---- GA4 ----
  L('=== GA4 Data API (property '+PROP+') ===');
  const t=await token('https://www.googleapis.com/auth/analytics.readonly');
  L('  auth ✅');
  const r=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+PROP+':runReport',{
    method:'POST', headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},
    body:JSON.stringify({
      dateRanges:[{startDate:'30daysAgo',endDate:'yesterday'}],
      metrics:[{name:'sessions'},{name:'totalRevenue'},{name:'transactions'},{name:'activeUsers'}]
    })
  });
  const txt=await r.text();
  L('  runReport -> HTTP '+r.status);
  if(r.status===200){
    const j=JSON.parse(txt);
    const row=(j.rows||[])[0];
    if(row){
      const m=row.metricValues.map(v=>v.value);
      L('  ✅ VEIKIA. Paskutines 30 d.:');
      L('     sesijos:     '+m[0]);
      L('     pajamos:     '+parseFloat(m[1]).toFixed(2)+' EUR');
      L('     transakcijos:'+m[2]);
      L('     aktyvus vart:'+m[3]);
    } else L('  200, bet 0 eiluciu');
  } else {
    L('  ❌ '+txt.slice(0,400).replace(/\s+/g,' '));
    if(/has not been used|SERVICE_DISABLED/i.test(txt)) L('  >>> analyticsdata.googleapis.com NEIJUNGTA');
    if(/permission|PERMISSION_DENIED/i.test(txt)) L('  >>> SA nepridetas prie property arba propagacija (palauk 2-5 min)');
  }
  L('');

  // ---- GSC ----
  L('=== Search Console API ===');
  const t2=await token('https://www.googleapis.com/auth/webmasters.readonly');
  const s=await fetch('https://www.googleapis.com/webmasters/v3/sites',{headers:{Authorization:'Bearer '+t2}});
  if(s.status===200){
    const j=await s.json();
    (j.siteEntry||[]).forEach(x=>L('  ✅ '+x.siteUrl+'   '+x.permissionLevel));
  } else L('  ❌ HTTP '+s.status);
  L('');

  // ---- GTM ----
  L('=== Tag Manager API ===');
  const t3=await token('https://www.googleapis.com/auth/tagmanager.readonly');
  const g=await fetch('https://tagmanager.googleapis.com/tagmanager/v2/accounts/6071827163/containers/101921278/versions:live',{headers:{Authorization:'Bearer '+t3}});
  L('  '+(g.status===200?'✅ GTM-MF3GZGT live version pasiekiama':'❌ HTTP '+g.status));
  L('');

  L('=== SUVESTINE ===');
  L('  Vienas Service Account, trys API:');
  L('    claude-gtm-manager@prefab-envoy-482617-b4.iam.gserviceaccount.com');
  L('');
  L('  Google Ads API — NEGALIMA (reikia developer token + OAuth2).');
  L('  Alternatyva: Google Ads Script (veikia Ads viduje, token nereikia).');
}catch(e){ L('!!! '+e.message.slice(0,200)); }
putFile('access_summary.txt', out); console.log(out);
