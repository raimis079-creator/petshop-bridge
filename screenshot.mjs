import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";

function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<5;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'analize '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 3'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n'; console.log(s);};
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
  return (await r.json()).access_token;
}

const PROP='346051580';
const START='2026-01-10', END='2026-07-09';

async function ga4(t, dims, mets, limit=1000, orderMet=null){
  const body={dateRanges:[{startDate:START,endDate:END}],
    dimensions:dims.map(d=>({name:d})), metrics:mets.map(m=>({name:m})), limit};
  if(orderMet) body.orderBys=[{metric:{metricName:orderMet},desc:true}];
  const r=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+PROP+':runReport',{
    method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(r.status!==200){ const e=await r.text(); L('  GA4 ERR '+dims.join(',')+' HTTP '+r.status+' '+e.slice(0,300)); return null; }
  const j=await r.json();
  return (j.rows||[]).map(row=>({
    d: row.dimensionValues.map(v=>v.value),
    m: row.metricValues.map(v=>isNaN(+v.value)?v.value:+v.value)
  }));
}

(async()=>{
  const t=await token('https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly');
  if(!t){ L('NO TOKEN'); putFile('_run2_log.txt',out); return; }
  L('token ok');

  // === A. saltinis x irenginys ===
  const A=await ga4(t,['sessionSourceMedium','deviceCategory'],['sessions','transactions','purchaseRevenue'],400,'sessions');
  if(A){ putFile('ga4_source_x_device.json',JSON.stringify(A)); L('A ok rows='+A.length); }

  // === B. funnel pagal irengini (sesiju-lygio metrikos) ===
  const B=await ga4(t,['deviceCategory'],['sessions','itemsViewed','addToCarts','checkouts','ecommercePurchases','purchaseRevenue','bounceRate','averageSessionDuration'],20);
  if(B){ putFile('ga4_funnel_x_device.json',JSON.stringify(B)); L('B ok rows='+B.length); }

  // === C. funnel pagal kanala ===
  const C=await ga4(t,['sessionDefaultChannelGroup'],['sessions','addToCarts','checkouts','ecommercePurchases','purchaseRevenue'],50,'sessions');
  if(C){ putFile('ga4_funnel_x_channel.json',JSON.stringify(C)); L('C ok rows='+C.length); }

  // === D. landing page: ar veisliu psl. nesa pardavimus ===
  const D=await ga4(t,['landingPagePlusQueryString'],['sessions','addToCarts','ecommercePurchases','purchaseRevenue','bounceRate'],600,'sessions');
  if(D){ putFile('ga4_landing.json',JSON.stringify(D)); L('D ok rows='+D.length); }

  // === E. eventai: sesiju skaicius, ne eventu ===
  const E=await ga4(t,['eventName'],['sessions','eventCount','totalUsers'],60,'eventCount');
  if(E){ putFile('ga4_event_sessions.json',JSON.stringify(E)); L('E ok rows='+E.length); }

  // === F. eventai x irenginys (kur luzta checkout) ===
  const F=await ga4(t,['eventName','deviceCategory'],['eventCount','sessions'],200,'eventCount');
  if(F){ putFile('ga4_event_x_device.json',JSON.stringify(F)); L('F ok rows='+F.length); }

  // === G. URL auditas: ar seni GSC puslapiai egzistuoja dev.avesa.lt ===
  const paths=JSON.parse(fs.readFileSync('analize/_top_paths.json','utf8'));
  const res=[];
  for(const p of paths){
    let line={p};
    for(const host of ['https://dev.avesa.lt','https://petshop.lt']){
      try{
        const r=execSync('curl -s -o /dev/null -m 20 -w "%{http_code}|%{redirect_url}" -A "Mozilla/5.0" "'+host+p+'"',{encoding:'utf8'});
        const [code,red]=r.split('|');
        let final=code;
        if(/^3/.test(code)&&red){
          try{ final=execSync('curl -s -o /dev/null -m 20 -L -w "%{http_code}" -A "Mozilla/5.0" "'+host+p+'"',{encoding:'utf8'}).trim(); }catch(e){}
        }
        line[host.includes('dev')?'dev':'prod']={code,final,red:red||''};
      }catch(e){ line[host.includes('dev')?'dev':'prod']={code:'ERR',final:'ERR',red:''}; }
    }
    res.push(line);
  }
  putFile('url_audit.json',JSON.stringify(res));
  L('G ok rows='+res.length);
  putFile('_run2_log.txt',out);
})();
