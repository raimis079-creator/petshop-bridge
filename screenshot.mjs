process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge'; const WP=process.env.WP_URL||'https://dev.avesa.lt';
const VER='dep-181527'; const out={v:VER};
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{')) r='{'+r; if(!r.endsWith('}')) r=r+'}'; return JSON.parse(r); }
const b64url=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(scope){ const sa=loadSA(); const now=Math.floor(Date.now()/1000);
  const jwt=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+b64url(JSON.stringify({iss:sa.client_email,scope,aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
  const sig=crypto.sign('RSA-SHA256',Buffer.from(jwt),sa.private_key); const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+jwt+'.'+b64url(sig)});
  const j=await r.json(); if(!j.access_token) throw new Error('token:'+JSON.stringify(j).slice(0,200)); return j.access_token; }
// 1. FEED
try{
  const r=await fetch(WP+'/feed/google/',{headers:{'User-Agent':'Mozilla/5.0 petshopseo','Cache-Control':'no-cache'}}); const x=await r.text();
  out.feed={status:r.status,bytes:x.length,head:x.slice(0,600)};
  const items=x.split(/<item>/).slice(1); out.feed.items=items.length;
  const F=['g:id','title','description','link','g:image_link','g:price','g:sale_price','g:availability','g:brand','g:gtin','g:mpn','g:google_product_category','g:product_type','g:condition','g:shipping','g:shipping_weight','g:item_group_id','g:identifier_exists','g:custom_label_0'];
  const miss={},vals={}; const av={},hosts={},cats={},brands={}; let descShort=0,titleLong=0,idDup=0; const ids=new Set();
  for(const it of items){ for(const f of F){ const m=it.match(new RegExp('<'+f.replace(':','\\:')+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+f.replace(':','\\:')+'>')); if(!m||!m[1].replace(/<!\[CDATA\[|\]\]>/g,'').trim()){ miss[f]=(miss[f]||0)+1; } else { vals[f]=m[1].replace(/<!\[CDATA\[|\]\]>/g,'').trim(); }
      if(f==='g:availability'&&m) av[m[1].trim()]=(av[m[1].trim()]||0)+1;
      if(f==='link'&&m){ try{ const h=new URL(m[1].replace(/<!\[CDATA\[|\]\]>/g,'').trim()).host; hosts[h]=(hosts[h]||0)+1;}catch(e){} }
      if(f==='g:google_product_category'&&m){ const c=m[1].replace(/<!\[CDATA\[|\]\]>/g,'').trim().slice(0,60); cats[c]=(cats[c]||0)+1; }
      if(f==='g:brand'&&m){ const c=m[1].replace(/<!\[CDATA\[|\]\]>/g,'').trim(); brands[c]=(brands[c]||0)+1; }
      if(f==='description'&&m&&m[1].replace(/<[^>]+>|<!\[CDATA\[|\]\]>/g,'').trim().length<50) descShort++;
      if(f==='title'&&m&&m[1].replace(/<!\[CDATA\[|\]\]>/g,'').length>150) titleLong++;
      if(f==='g:id'&&m){ const v=m[1].trim(); if(ids.has(v)) idDup++; ids.add(v); } } }
  out.feed.missing=miss; out.feed.availability=av; out.feed.link_hosts=hosts; out.feed.desc_short=descShort; out.feed.title_gt150=titleLong; out.feed.id_dup=idDup;
  out.feed.cats_n=Object.keys(cats).length; out.feed.cats_top=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,12); out.feed.brands_n=Object.keys(brands).length; out.feed.brands_top=Object.entries(brands).sort((a,b)=>b[1]-a[1]).slice(0,15);
  out.feed.sample=items.slice(0,2).map(s=>s.slice(0,1800));
}catch(e){ out.feed_klaida=String(e).slice(0,300); }
// 2. GSC užklausos 16 mėn.
try{ const t=await token('https://www.googleapis.com/auth/webmasters.readonly');
  async function gsc(body,key){ const r=await fetch('https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Apetshop.lt/searchAnalytics/query',{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify(body)}); const j=await r.json(); out[key]=j.error?{error:j.error.message}:(j.rows||[]).map(x=>[...x.keys,x.clicks,x.impressions,Math.round(x.ctr*1000)/10,Math.round(x.position*10)/10]); }
  await gsc({startDate:'2025-05-01',endDate:'2026-08-29',dimensions:['query'],rowLimit:2500},'gsc_query');
  await gsc({startDate:'2026-03-01',endDate:'2026-08-29',dimensions:['query'],rowLimit:1500},'gsc_query_6m');
  await gsc({startDate:'2025-05-01',endDate:'2026-08-29',dimensions:['query','page'],rowLimit:1500},'gsc_query_page');
}catch(e){ out.gsc_klaida=String(e).slice(0,300); }
await put('analize/s1585_ads_feed_gsc.json',Buffer.from(JSON.stringify(out)),VER); console.log('ok');
