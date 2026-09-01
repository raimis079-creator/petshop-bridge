import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const VER='dep-180351'; const OUT='analize/s1584_ga4_ads.json'; const out={v:VER};
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{')) r='{'+r; if(!r.endsWith('}')) r=r+'}'; return JSON.parse(r); }
const b64url=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(scope){ const sa=loadSA(); const now=Math.floor(Date.now()/1000);
  const jwt=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+b64url(JSON.stringify({iss:sa.client_email,scope,aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
  const sig=crypto.sign('RSA-SHA256',Buffer.from(jwt),sa.private_key); const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+jwt+'.'+b64url(sig)});
  const j=await r.json(); if(!j.access_token) throw new Error('token:'+JSON.stringify(j).slice(0,200)); return j.access_token; }
const PROP='properties/346051580';
try{
  const t=await token('https://www.googleapis.com/auth/analytics.readonly');
  async function rep(body,key){ const r=await fetch('https://analyticsdata.googleapis.com/v1beta/'+PROP+':runReport',{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(body)});
    const j=await r.json(); if(j.error){ out[key]={error:j.error.message}; return; }
    const dh=(j.dimensionHeaders||[]).map(x=>x.name), mh=(j.metricHeaders||[]).map(x=>x.name);
    out[key]={cols:[...dh,...mh],rows:(j.rows||[]).map(r=>[...r.dimensionValues.map(v=>v.value),...r.metricValues.map(v=>Math.round(parseFloat(v.value)*100)/100)])}; }
  const M=['sessions','totalUsers','ecommercePurchases','purchaseRevenue','advertiserAdCost','advertiserAdClicks'].map(n=>({name:n}));
  // 1. Mėnesinė tendencija 2026-01..08
  await rep({dateRanges:[{startDate:'2026-01-01',endDate:'2026-08-31'}],dimensions:[{name:'yearMonth'}],metrics:M,orderBys:[{dimension:{dimensionName:'yearMonth'}}]},'menesiai');
  // 2. Kanalai: du periodai
  for(const [k,s,e] of [['kanalai_H1','2026-01-01','2026-07-03'],['kanalai_liepa_rugp','2026-07-04','2026-08-31']])
    await rep({dateRanges:[{startDate:s,endDate:e}],dimensions:[{name:'sessionDefaultChannelGroup'}],metrics:M,orderBys:[{metric:{metricName:'sessions'},desc:true}]},k);
  // 3. Ads kampanijos liepa–rugpjūtis
  await rep({dateRanges:[{startDate:'2026-07-04',endDate:'2026-08-31'}],dimensions:[{name:'sessionCampaignName'},{name:'sessionSourceMedium'}],metrics:M,dimensionFilter:{filter:{fieldName:'sessionSourceMedium',stringFilter:{matchType:'CONTAINS',value:'cpc'}}},orderBys:[{metric:{metricName:'advertiserAdCost'},desc:true}],limit:25},'ads_kampanijos');
  await rep({dateRanges:[{startDate:'2026-01-01',endDate:'2026-07-03'}],dimensions:[{name:'sessionCampaignName'}],metrics:M,dimensionFilter:{filter:{fieldName:'sessionSourceMedium',stringFilter:{matchType:'CONTAINS',value:'cpc'}}},orderBys:[{metric:{metricName:'advertiserAdCost'},desc:true}],limit:15},'ads_kampanijos_H1');
  // 4. Ads pagal savaitę liepa–rugpjūtis (ar kas keitėsi)
  await rep({dateRanges:[{startDate:'2026-06-01',endDate:'2026-08-31'}],dimensions:[{name:'isoYearIsoWeek'}],metrics:M,dimensionFilter:{filter:{fieldName:'sessionSourceMedium',stringFilter:{matchType:'CONTAINS',value:'cpc'}}},orderBys:[{dimension:{dimensionName:'isoYearIsoWeek'}}]},'ads_savaites');
  // 5. Nauji vs grįžtantys pirkėjai liepa–rugp (Google cpc vs visi)
  await rep({dateRanges:[{startDate:'2026-07-04',endDate:'2026-08-31'}],dimensions:[{name:'newVsReturning'},{name:'sessionDefaultChannelGroup'}],metrics:[{name:'sessions'},{name:'ecommercePurchases'},{name:'purchaseRevenue'}],orderBys:[{metric:{metricName:'purchaseRevenue'},desc:true}],limit:20},'nauji_vs_grizt');
  // 6. Ads top prekės liepa–rugp
  await rep({dateRanges:[{startDate:'2026-07-04',endDate:'2026-08-31'}],dimensions:[{name:'itemName'}],metrics:[{name:'itemsPurchased'},{name:'itemRevenue'}],dimensionFilter:{filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{matchType:'EXACT',value:'Paid Search'}}},orderBys:[{metric:{metricName:'itemRevenue'},desc:true}],limit:15},'ads_prekes');
  // 7. Landing puslapiai Paid Search
  await rep({dateRanges:[{startDate:'2026-07-04',endDate:'2026-08-31'}],dimensions:[{name:'landingPagePlusQueryString'}],metrics:[{name:'sessions'},{name:'ecommercePurchases'},{name:'purchaseRevenue'}],dimensionFilter:{filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{matchType:'EXACT',value:'Paid Search'}}},orderBys:[{metric:{metricName:'sessions'},desc:true}],limit:12},'ads_landing');
  // 8. Įrenginys
  await rep({dateRanges:[{startDate:'2026-07-04',endDate:'2026-08-31'}],dimensions:[{name:'deviceCategory'}],metrics:[{name:'sessions'},{name:'ecommercePurchases'},{name:'purchaseRevenue'}]},'irenginiai');
}catch(e){ out.klaida=String(e).slice(0,500); }
await put(OUT,Buffer.from(JSON.stringify(out,null,1)),VER); console.log('ok');
