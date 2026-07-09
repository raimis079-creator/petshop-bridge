import { execSync } from "child_process"; import fs from "fs"; import crypto from "crypto";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function loadSA(){ let r=(process.env.GTM_SA_JSON||'').trim(); if(!r.startsWith('{'))r='{'+r; if(!r.endsWith('}'))r=r+'}'; return JSON.parse(r); }
const b64url=(b)=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function getToken(sa){
  const scopes=['tagmanager.readonly','tagmanager.edit.containers','tagmanager.edit.containerversions','tagmanager.publish','tagmanager.manage.users','tagmanager.manage.accounts'].map(s=>'https://www.googleapis.com/auth/'+s).join(' ');
  const now=Math.floor(Date.now()/1000);
  const h=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const c=b64url(JSON.stringify({iss:sa.client_email,scope:scopes,aud:sa.token_uri,exp:now+3600,iat:now}));
  const s=crypto.createSign('RSA-SHA256'); s.update(h+'.'+c);
  const sig=s.sign(sa.private_key).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r=await fetch(sa.token_uri,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:h+'.'+c+'.'+sig})});
  const j=await r.json(); if(!j.access_token) throw new Error('TOKEN FAIL '+JSON.stringify(j).slice(0,200)); return j.access_token;
}
const BASE='https://tagmanager.googleapis.com/tagmanager/v2';
async function gtm(t,p){ const r=await fetch(BASE+p,{headers:{Authorization:'Bearer '+t}}); const x=await r.text(); let j; try{j=JSON.parse(x);}catch(e){j={_raw:x.slice(0,200)};} return {status:r.status, body:j}; }
let out=''; const L=(s)=>{out+=s+'\n';};
try{
  const sa=loadSA(); const t=await getToken(sa);
  L('AUTH OK'); L('');
  for(const aid of ['6071827163','6065881322']){
    L('########## accountId '+aid+' ##########');
    const a = await gtm(t,'/accounts/'+aid);
    L('GET /accounts/'+aid+' -> HTTP '+a.status+' | name='+(a.body.name||JSON.stringify(a.body).slice(0,120)));
    const c = await gtm(t,'/accounts/'+aid+'/containers');
    L('GET containers -> HTTP '+c.status);
    if(c.status===200){
      const list=c.body.container||[];
      L('  container count: '+list.length);
      for(const ct of list) L('   - '+ct.name+' | publicId='+ct.publicId+' | containerId='+ct.containerId+' | path='+ct.path);
    } else L('  body: '+JSON.stringify(c.body).slice(0,250));
    const up = await gtm(t,'/accounts/'+aid+'/user_permissions');
    L('GET user_permissions -> HTTP '+up.status);
    if(up.status===200){
      const perms=up.body.userPermission||[];
      for(const p of perms){
        const isSA = (p.emailAddress||'').includes('claude-gtm-manager');
        L('   '+(isSA?'>>> ':'    ')+p.emailAddress+' | acct='+JSON.stringify(p.accountAccess)+' | cont='+JSON.stringify(p.containerAccess||[]));
      }
    } else L('  body: '+JSON.stringify(up.body).slice(0,250));
    L('');
  }
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('gtm_probe.txt', out); console.log(out);
