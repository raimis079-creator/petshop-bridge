import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge'; const VER='dep-192822'; const out={v:VER};
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{')) r='{'+r; if(!r.endsWith('}')) r=r+'}'; return JSON.parse(r); }
const b64url=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(scope){ const sa=loadSA(); const now=Math.floor(Date.now()/1000); const jwt=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+b64url(JSON.stringify({iss:sa.client_email,scope,aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})); const sig=crypto.sign('RSA-SHA256',Buffer.from(jwt),sa.private_key); const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+jwt+'.'+b64url(sig)}); const j=await r.json(); if(!j.access_token) throw new Error('token:'+JSON.stringify(j).slice(0,200)); return j.access_token; }
try{ const t=await token('https://www.googleapis.com/auth/analytics.edit');
  const A={Authorization:'Bearer '+t,'Content-Type':'application/json'};
  const ds=await (await fetch('https://analyticsadmin.googleapis.com/v1beta/properties/346051580/dataStreams',{headers:A})).json(); out.streams=JSON.stringify(ds).slice(0,600);
  const web=(ds.dataStreams||[]).find(s=>s.type==='WEB_DATA_STREAM'); out.stream=web?web.name:null; out.mid=web?web.webStreamData.measurementId:null;
  if(web){ const ex=await (await fetch('https://analyticsadmin.googleapis.com/v1beta/'+web.name+'/measurementProtocolSecrets',{headers:A})).json(); out.existing=JSON.stringify(ex).slice(0,400);
    const have=(ex.measurementProtocolSecrets||[]).find(s=>s.displayName==='petshop-serveris');
    if(have){ out.secret=have.secretValue; out.secret_src='existing'; } else {
      const c=await fetch('https://analyticsadmin.googleapis.com/v1beta/'+web.name+'/measurementProtocolSecrets',{method:'POST',headers:A,body:JSON.stringify({displayName:'petshop-serveris'})}); const cj=await c.json(); out.create_status=c.status; if(cj.secretValue){ out.secret=cj.secretValue; out.secret_src='created'; } else out.create_err=JSON.stringify(cj).slice(0,400); } }
  // key events sąrašas (ar purchase key event)
  const ke=await (await fetch('https://analyticsadmin.googleapis.com/v1beta/properties/346051580/keyEvents',{headers:A})).json(); out.key_events=(ke.keyEvents||[]).map(k=>k.eventName);
  // Ads links
  const al=await (await fetch('https://analyticsadmin.googleapis.com/v1beta/properties/346051580/googleAdsLinks',{headers:A})).json(); out.ads_links=JSON.stringify(al).slice(0,400);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('analize/s1587_mp_secret.json',Buffer.from(JSON.stringify(out,null,1)),VER); console.log('ok');
