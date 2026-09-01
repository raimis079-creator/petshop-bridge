import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge'; const VER='dep-203919'; const out={v:VER};
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{')) r='{'+r; if(!r.endsWith('}')) r=r+'}'; return JSON.parse(r); }
const b64url=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(scope){ const sa=loadSA(); const now=Math.floor(Date.now()/1000); const jwt=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+b64url(JSON.stringify({iss:sa.client_email,scope,aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})); const sig=crypto.sign('RSA-SHA256',Buffer.from(jwt),sa.private_key); const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+jwt+'.'+b64url(sig)}); const j=await r.json(); if(!j.access_token) throw new Error('token:'+JSON.stringify(j).slice(0,200)); return j.access_token; }
try{ const t=await token('https://www.googleapis.com/auth/content'); const A={Authorization:'Bearer '+t};
  const MC='5321054797';
  const ai=await (await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+MC+'/accounts/authinfo',{headers:A})).json(); out.authinfo=JSON.stringify(ai).slice(0,300);
  const acc=await (await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+MC+'/accounts/'+MC,{headers:A})).json(); out.account={name:acc.name,website:acc.websiteUrl,adsLinks:acc.adsLinks,users:(acc.users||[]).map(u=>u.emailAddress+':'+(u.admin?'admin':'std'))};
  const st=await (await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+MC+'/accountstatuses/'+MC,{headers:A})).json(); out.status={issues:(st.accountLevelIssues||[]).map(i=>i.id+':'+i.severity),products:st.products?JSON.stringify(st.products).slice(0,400):null};
  const df=await (await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+MC+'/datafeeds',{headers:A})).json(); out.feeds=(df.resources||[]).map(f=>({id:f.id,name:f.name,url:(f.fetchSchedule||{}).fetchUrl,target:f.targets}));
  const sh=await (await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+MC+'/shippingsettings/'+MC,{headers:A})).json(); out.shipping=JSON.stringify(sh).slice(0,300);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('analize/s1589_mc.json',Buffer.from(JSON.stringify(out,null,1)),VER); console.log('ok');
