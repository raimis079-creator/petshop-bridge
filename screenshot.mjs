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
  return (await r.json()).access_token;
}
const SITE='sc-domain%3Apetshop.lt';
const PROP='346051580';
const END='2026-07-09', START16='2025-03-01', START6='2026-01-10';

async function gsc(t, dims, rowLimit=25000){
  let all=[], startRow=0;
  for(let i=0;i<5;i++){
    const r=await fetch('https://www.googleapis.com/webmasters/v3/sites/'+SITE+'/searchAnalytics/query',{
      method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},
      body:JSON.stringify({startDate:START16,endDate:END,dimensions:dims,rowLimit,startRow})});
    if(r.status!==200){ L('    GSC '+dims+' HTTP '+r.status); break; }
    const j=await r.json();
    const rows=j.rows||[];
    all=all.concat(rows);
    if(rows.length<rowLimit) break;
    startRow+=rowLimit;
  }
  return all;
}
async function ga4(t, dims, mets, start=START6){
  const r=await fetch('https://analyticsdata.googleapis.com/v1beta/properties/'+PROP+':runReport',{
    method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},
    body:JSON.stringify({dateRanges:[{startDate:start,endDate:END}],
      dimensions:dims.map(d=>({name:d})), metrics:mets.map(m=>({name:m})), limit:5000})});
  if(r.status!==200){ const e=await r.text(); L('    GA4 '+dims+' HTTP '+r.status+' '+e.slice(0,120)); return null; }
  return await r.json();
}

L('############ DUOMENU TRAUKIMAS I REPO ############');
L('periodas GSC: '+START16+' .. '+END+'   GA4: '+START6+' .. '+END); L('');

try{
  const tg=await token('https://www.googleapis.com/auth/webmasters.readonly');
  const ta=await token('https://www.googleapis.com/auth/analytics.readonly');

  // ===== GSC =====
  L('=== GSC ===');
  const pages=await gsc(tg,['page']);
  L('  page: '+pages.length+' eiluciu');
  putFile('gsc_pages.json', JSON.stringify(pages));
  const totC=pages.reduce((a,r)=>a+r.clicks,0), totI=pages.reduce((a,r)=>a+r.impressions,0);
  L('    viso clicks: '+totC+'   impressions: '+totI+'   CTR: '+(100*totC/totI).toFixed(2)+'%');
  L('  TOP 12 puslapiu:');
  pages.slice(0,12).forEach(r=>L('    '+String(r.clicks).padStart(5)+'  '+r.keys[0].replace('https://petshop.lt','').slice(0,52).padEnd(54)+' impr='+String(r.impressions).padStart(6)+'  pos='+r.position.toFixed(1)));
  L('');

  const queries=await gsc(tg,['query']);
  L('  query: '+queries.length+' eiluciu');
  putFile('gsc_queries.json', JSON.stringify(queries));
  L('  TOP 12 uzklausu:');
  queries.slice(0,12).forEach(r=>L('    '+String(r.clicks).padStart(5)+'  '+r.keys[0].slice(0,44).padEnd(46)+' impr='+String(r.impressions).padStart(6)+'  pos='+r.position.toFixed(1)));
  L('');

  const pq=await gsc(tg,['page','query'],25000);
  L('  page x query: '+pq.length+' eiluciu');
  putFile('gsc_page_query.json', JSON.stringify(pq.slice(0,8000)));
  L('');

  // ===== GA4 =====
  L('=== GA4 (6 men.) ===');
  const src=await ga4(ta,['sessionSourceMedium'],['sessions','totalRevenue','transactions','engagementRate']);
  if(src){
    const rows=(src.rows||[]).map(r=>({k:r.dimensionValues[0].value, s:+r.metricValues[0].value, rev:+r.metricValues[1].value, tx:+r.metricValues[2].value, eng:+r.metricValues[3].value}));
    rows.sort((a,b)=>b.rev-a.rev);
    putFile('ga4_source_medium.json', JSON.stringify(rows));
    const tot=rows.reduce((a,r)=>a+r.rev,0);
    L('  saltiniu: '+rows.length+'   viso pajamu: '+tot.toFixed(2)+' EUR');
    L('  TOP 10 pagal pajamas:');
    rows.slice(0,10).forEach(r=>L('    '+r.k.slice(0,30).padEnd(32)+' rev='+r.rev.toFixed(0).padStart(6)+'  sess='+String(r.s).padStart(5)+'  tx='+String(r.tx).padStart(4)+'  konv='+(r.s?(100*r.tx/r.s).toFixed(2):'0')+'%'));
  }
  L('');

  const prod=await ga4(ta,['itemName'],['itemRevenue','itemsPurchased','itemsViewed']);
  if(prod){
    const rows=(prod.rows||[]).map(r=>({n:r.dimensionValues[0].value, rev:+r.metricValues[0].value, qty:+r.metricValues[1].value, views:+r.metricValues[2].value}));
    rows.sort((a,b)=>b.rev-a.rev);
    putFile('ga4_products.json', JSON.stringify(rows));
    L('  produktu: '+rows.length);
    L('  TOP 10 pagal pajamas:');
    rows.slice(0,10).forEach(r=>L('    '+r.rev.toFixed(0).padStart(6)+' EUR  '+String(r.qty).padStart(4)+' vnt  '+r.n.slice(0,48)));
  }
  L('');

  const funnel=await ga4(ta,['eventName'],['eventCount']);
  if(funnel){
    const rows=(funnel.rows||[]).map(r=>({e:r.dimensionValues[0].value, c:+r.metricValues[0].value}));
    rows.sort((a,b)=>b.c-a.c);
    putFile('ga4_events.json', JSON.stringify(rows));
    L('  Funnel (event counts, 6 men.):');
    ['session_start','view_item','add_to_cart','begin_checkout','purchase'].forEach(e=>{
      const r=rows.find(x=>x.e===e);
      L('    '+e.padEnd(18)+' '+String(r?r.c:0).padStart(7));
    });
    const vi=rows.find(x=>x.e==='view_item')?.c||0;
    const atc=rows.find(x=>x.e==='add_to_cart')?.c||0;
    const bc=rows.find(x=>x.e==='begin_checkout')?.c||0;
    const pu=rows.find(x=>x.e==='purchase')?.c||0;
    L('');
    L('    view_item -> add_to_cart:      '+(vi?(100*atc/vi).toFixed(1):'?')+'%');
    L('    add_to_cart -> begin_checkout: '+(atc?(100*bc/atc).toFixed(1):'?')+'%');
    L('    begin_checkout -> purchase:    '+(bc?(100*pu/bc).toFixed(1):'?')+'%  ← CIA NUTEKA');
  }
  L('');

  const dev=await ga4(ta,['deviceCategory'],['sessions','totalRevenue','transactions']);
  if(dev){
    const rows=(dev.rows||[]).map(r=>({d:r.dimensionValues[0].value,s:+r.metricValues[0].value,rev:+r.metricValues[1].value,tx:+r.metricValues[2].value}));
    putFile('ga4_device.json', JSON.stringify(rows));
    L('  Irenginiai:');
    rows.forEach(r=>L('    '+r.d.padEnd(10)+' sess='+String(r.s).padStart(6)+'  rev='+r.rev.toFixed(0).padStart(6)+'  konv='+(r.s?(100*r.tx/r.s).toFixed(2):'0')+'%'));
  }
  L('');
  L('=== Failai repo: analize/ ===');
  L('  gsc_pages.json  gsc_queries.json  gsc_page_query.json');
  L('  ga4_source_medium.json  ga4_products.json  ga4_events.json  ga4_device.json');
}catch(e){ L('!!! '+e.message.slice(0,200)); }
putFile('_santrauka.txt', out); console.log(out);
