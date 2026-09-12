process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const B64='';
const VER='dep-x';
const GKEY='ps_x';
const PHASES=["GO"];
const OUT='analize/s1678_gsc.json';
const DATA=[];
const out={v:VER};
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function token(sa,scope){ const crypto=await import('crypto'); const now=Math.floor(Date.now()/1000); const b=s=>Buffer.from(JSON.stringify(s)).toString('base64url');
  const hdr=b({alg:'RS256',typ:'JWT'}); const clm=b({iss:sa.client_email,scope,aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
  const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+clm).sign(sa.private_key,'base64url');
  const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+hdr+'.'+clm+'.'+sig});
  const tj=await tr.json(); return tj.access_token||null; }
const d=(n)=>{const x=new Date(Date.now()-n*86400000);return x.toISOString().slice(0,10);};
try{
  let raw=process.env.GTM_SA_JSON.trim(); if(!raw.startsWith('{')) raw='{'+raw+'}'; const sa=JSON.parse(raw); out.sa=sa.client_email;
  // GSC
  const t=await token(sa,'https://www.googleapis.com/auth/webmasters.readonly'); out.gsc={token:!!t};
  if(t){ const H={Authorization:'Bearer '+t,'Content-Type':'application/json'};
    const sl=await (await fetch('https://www.googleapis.com/webmasters/v3/sites',{headers:H})).json(); out.gsc.sites=sl;
    const props=(sl.siteEntry||[]).map(s=>s.siteUrl); const site=props.find(p=>p.includes('petshop.lt'))||'sc-domain:petshop.lt';
    const q=async(body)=>{ const r=await fetch('https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(site)+'/searchAnalytics/query',{method:'POST',headers:H,body:JSON.stringify(body)}); const j=await r.json(); return r.ok?(j.rows||[]):{err:r.status,body:JSON.stringify(j).slice(0,300)}; };
    out.gsc.site=site;
    out.gsc.q28=await q({startDate:d(30),endDate:d(2),dimensions:['query'],rowLimit:500});
    out.gsc.q90=await q({startDate:d(92),endDate:d(2),dimensions:['query'],rowLimit:800});
    out.gsc.p28=await q({startDate:d(30),endDate:d(2),dimensions:['page'],rowLimit:300});
    out.gsc.qp90=await q({startDate:d(92),endDate:d(2),dimensions:['query','page'],rowLimit:1500});
    out.gsc.dienos=await q({startDate:d(120),endDate:d(2),dimensions:['date']});
    out.gsc.irenginiai=await q({startDate:d(30),endDate:d(2),dimensions:['device']});
  }
  // GA4 Data API
  const t2=await token(sa,'https://www.googleapis.com/auth/analytics.readonly'); out.ga4={token:!!t2};
  if(t2){ const H={Authorization:'Bearer '+t2,'Content-Type':'application/json'}; const P='properties/346051580';
    const run=async(body)=>{ const r=await fetch('https://analyticsdata.googleapis.com/v1beta/'+P+':runReport',{method:'POST',headers:H,body:JSON.stringify(body)}); const j=await r.json(); return r.ok?j:{err:r.status,body:JSON.stringify(j).slice(0,300)}; };
    out.ga4.paieska=await run({dateRanges:[{startDate:'90daysAgo',endDate:'yesterday'}],dimensions:[{name:'searchTerm'}],metrics:[{name:'eventCount'}],limit:300,orderBys:[{metric:{metricName:'eventCount'},desc:true}]});
    out.ga4.kanalai=await run({dateRanges:[{startDate:'90daysAgo',endDate:'yesterday'}],dimensions:[{name:'sessionDefaultChannelGroup'}],metrics:[{name:'sessions'},{name:'totalUsers'},{name:'transactions'},{name:'purchaseRevenue'}]});
    out.ga4.prekes=await run({dateRanges:[{startDate:'90daysAgo',endDate:'yesterday'}],dimensions:[{name:'itemName'}],metrics:[{name:'itemsViewed'},{name:'itemsAddedToCart'},{name:'itemsPurchased'},{name:'itemRevenue'}],limit:300,orderBys:[{metric:{metricName:'itemsViewed'},desc:true}]});
    out.ga4.puslapiai=await run({dateRanges:[{startDate:'90daysAgo',endDate:'yesterday'}],dimensions:[{name:'landingPage'}],metrics:[{name:'sessions'},{name:'transactions'}],limit:150,orderBys:[{metric:{metricName:'sessions'},desc:true}]});
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
await put(OUT, Buffer.from(JSON.stringify(out)), VER);
