process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const out={versija:'G816'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
/* ---- A. GOOGLE SA, trecias bandymas ---- */
out.google={};
try{
  let raw=(process.env.GTM_SA_JSON||'').trim();
  let sa=null; let fmt='';
  const bandymai=[ ['tiesiogiai',()=>JSON.parse(raw)],
                   ['skliaustai',()=>JSON.parse('{'+raw+'}')],
                   ['dvigubas',()=>JSON.parse(JSON.parse(raw))],
                   ['base64',()=>JSON.parse(Buffer.from(raw,'base64').toString('utf8'))] ];
  for(const [n,f] of bandymai){ try{ const r=f(); if(r && r.client_email){ sa=r; fmt=n; break; } }catch(e){} }
  out.google.formatas=fmt||'neatpazintas'; out.google.ilgis=raw.length;
  if(!sa) out.google.pradzia_forma=raw.slice(0,40).replace(/[A-Za-z0-9+/=]{12,}/g,'…');
  if(sa){
    out.google.client_email=sa.client_email; out.google.project=sa.project_id;
    const now=Math.floor(Date.now()/1000);
    const hdr=Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');
    const cl=Buffer.from(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/content',aud:'https://oauth2.googleapis.com/token',exp:now+3600,iat:now})).toString('base64url');
    const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+cl).sign(sa.private_key).toString('base64url');
    const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion='+hdr+'.'+cl+'.'+sig});
    const tj=await tr.json(); out.google.token_status=tr.status;
    if(tj.access_token){
      const ai=await fetch('https://shoppingcontent.googleapis.com/content/v2.1/accounts/authinfo',{headers:{Authorization:'Bearer '+tj.access_token}});
      out.google.authinfo_status=ai.status; out.google.authinfo=(await ai.text()).slice(0,800);
    } else out.google.token_klaida=JSON.stringify(tj).slice(0,300);
  }
}catch(e){ out.google.klaida=String(e).slice(0,250); }

/* ---- B. VF XML SALTINIS ---- */
out.vf={};
try{
  const U=WP+'/wp-content/petshop-xml-vf-fetcher.php?key=dfjsfgtdfbfb54651bhfbd36dggbdgb87b65dfbdgdbfv2dfbfgn6f23dv5f4dvdsz';
  const r=await fetch(U); const x=await r.text();
  out.vf.status=r.status; out.vf.baitai=x.length; out.vf.ct=r.headers.get('content-type');
  out.vf.pradzia=x.slice(0,600);
  const tagai={};
  const m1=x.match(/<([a-z0-9_]*(?:barcode|ean|gtin)[a-z0-9_]*)>/gi)||[];
  for(const t of m1){ tagai[t]=(tagai[t]||0)+1; }
  out.vf.kodo_tagai=tagai;
  const vals=[...x.matchAll(/<([a-z0-9_]*(?:barcode|ean|gtin)[a-z0-9_]*)>([^<]*)<\//gi)].map(m=>m[2].trim()).filter(Boolean);
  const ilgiai={}; for(const v of vals){ ilgiai[v.length]=(ilgiai[v.length]||0)+1; }
  out.vf.reiksmiu=vals.length; out.vf.ilgiai=ilgiai; out.vf.pvz_reiksmes=vals.slice(0,10);
  const SKU=['JOS0617','JOS0813','JOS0723','JOS0910','JOS0931','JOS0799','JOS0914'];
  out.vf.paieska={};
  for(const s of SKU){ const i=x.indexOf(s); out.vf.paieska[s]= i<0 ? 'nerasta' : x.slice(Math.max(0,i-450), i+450).replace(/\s+/g,' '); }
}catch(e){ out.vf.klaida=String(e).slice(0,250); }
const zlib=await import('zlib');
await put('g816.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g816 vf xml + google');
