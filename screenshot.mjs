import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge'; const VER='dep-205055'; const out={v:VER};
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{')) r='{'+r; if(!r.endsWith('}')) r=r+'}'; return JSON.parse(r); }
const b64url=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function token(scope){ const sa=loadSA(); const now=Math.floor(Date.now()/1000); const jwt=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+b64url(JSON.stringify({iss:sa.client_email,scope,aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})); const sig=crypto.sign('RSA-SHA256',Buffer.from(jwt),sa.private_key); const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+jwt+'.'+b64url(sig)}); const j=await r.json(); if(!j.access_token) throw new Error('token:'+JSON.stringify(j).slice(0,200)); return j.access_token; }
try{ const t=await token('https://www.googleapis.com/auth/content'); const A={Authorization:'Bearer '+t,'Content-Type':'application/json'}; const MC='5321054797';
  const P=(v)=>({value:v,currency:'EUR'});
  const body={accountId:MC,services:[{name:'Pristatymas Lietuvoje (paštomatas / kurjeris)',active:true,deliveryCountry:'LT',currency:'EUR',
    deliveryTime:{minHandlingTimeInDays:0,maxHandlingTimeInDays:1,minTransitTimeInDays:1,maxTransitTimeInDays:3},
    rateGroups:[{applicableShippingLabels:[],mainTable:{
      rowHeaders:{weights:[{value:'25',unit:'kg'},{value:'50',unit:'kg'},{value:'70',unit:'kg'},{value:'100',unit:'kg'},{value:'infinity',unit:'kg'}]},
      columnHeaders:{prices:[{value:'29.99',currency:'EUR'},{value:'infinity',currency:'EUR'}]},
      rows:[
        {cells:[{flatRate:P('1.78')},{flatRate:P('0')}]},
        {cells:[{flatRate:P('3.30')},{flatRate:P('3.30')}]},
        {cells:[{flatRate:P('6.60')},{flatRate:P('6.60')}]},
        {cells:[{flatRate:P('9.90')},{flatRate:P('9.90')}]},
        {cells:[{flatRate:P('20.65')},{flatRate:P('20.65')}]}
      ]}}]}]};
  const r=await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+MC+'/shippingsettings/'+MC,{method:'PUT',headers:A,body:JSON.stringify(body)});
  out.put_status=r.status; out.put_resp=(await r.text()).slice(0,900);
  const g=await fetch('https://shoppingcontent.googleapis.com/content/v2.1/'+MC+'/shippingsettings/'+MC,{headers:A}); out.get=(await g.text()).slice(0,1400);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('analize/s1590_mc_ship.json',Buffer.from(JSON.stringify(out,null,1)),VER); console.log('ok');
