import { execSync } from "child_process"; import fs from "fs"; import crypto from "crypto";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }

// --- SA JSON normalizacija (secret issaugotas be isoriniu skliaustu) ---
function loadSA(){
  let r = (process.env.GTM_SA_JSON||'').trim();
  if(!r) throw new Error('GTM_SA_JSON tuscias');
  if(!r.startsWith('{')) r = '{'+r;
  if(!r.endsWith('}')) r = r+'}';
  return JSON.parse(r);
}
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function getToken(sa){
  const scopes = [
    'https://www.googleapis.com/auth/tagmanager.readonly',
    'https://www.googleapis.com/auth/tagmanager.edit.containers',
    'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
    'https://www.googleapis.com/auth/tagmanager.publish',
    'https://www.googleapis.com/auth/tagmanager.manage.users'
  ].join(' ');
  const now = Math.floor(Date.now()/1000);
  const header = b64url(JSON.stringify({alg:'RS256', typ:'JWT'}));
  const claim  = b64url(JSON.stringify({iss:sa.client_email, scope:scopes, aud:sa.token_uri, exp:now+3600, iat:now}));
  const signer = crypto.createSign('RSA-SHA256'); signer.update(header+'.'+claim);
  const sig = signer.sign(sa.private_key).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r = await fetch(sa.token_uri, {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion:header+'.'+claim+'.'+sig})});
  const j = await r.json();
  if(!j.access_token) throw new Error('TOKEN FAIL: '+JSON.stringify(j).slice(0,300));
  return j.access_token;
}
const BASE='https://tagmanager.googleapis.com/tagmanager/v2';
async function gtm(token, path){
  const r = await fetch(BASE+path, {headers:{Authorization:'Bearer '+token}});
  const txt = await r.text(); let j; try{ j=JSON.parse(txt); }catch(e){ j={_raw:txt.slice(0,300)}; }
  return {status:r.status, body:j};
}
let out=''; const L=(s)=>{out+=s+'\n';};
try{
  const sa = loadSA();
  L('client_email: '+sa.client_email);
  const token = await getToken(sa);
  L('AUTH OK ('+token.length+' chars)'); L('');

  const acc = await gtm(token, '/accounts');
  L('=== GET /accounts -> HTTP '+acc.status+' ===');
  if(acc.status!==200){ L(JSON.stringify(acc.body).slice(0,600)); throw new Error('accounts fail'); }
  const accounts = acc.body.account||[];
  L('Accounts matomi: '+accounts.length);
  for(const a of accounts) L('  - '+a.name+' | accountId='+a.accountId);
  L('');

  let target=null;
  for(const a of accounts){
    const c = await gtm(token, '/'+a.path+'/containers');
    L('--- containers @ '+a.name+' -> HTTP '+c.status+' ---');
    const conts=(c.body.container)||[];
    if(!conts.length) L('   (tuscia / nera prieigos)');
    for(const ct of conts){
      L('   - '+ct.name+' | publicId='+ct.publicId+' | ctx='+JSON.stringify(ct.usageContext)+' | path='+ct.path);
      if(ct.publicId==='GTM-MF3GZGT') target=ct;
    }
  }
  L('');
  if(!target){ L('!!! GTM-MF3GZGT NERASTAS'); throw new Error('target not found'); }
  L('=== TARGET '+target.publicId+' ('+target.name+') ==='); L('   path='+target.path); L('');

  const ws = await gtm(token, '/'+target.path+'/workspaces');
  const wss = ws.body.workspace||[];
  L('=== WORKSPACES ('+wss.length+') HTTP '+ws.status+' ===');
  for(const w of wss) L('   ['+w.workspaceId+'] '+w.name);
  if(!wss.length) throw new Error('no workspaces');
  const W = wss[0]; L('   -> naudojam: '+W.name); L('');

  const tg = await gtm(token,'/'+W.path+'/tags'); const tags=tg.body.tag||[];
  L('=== TAGS ('+tags.length+') HTTP '+tg.status+' ===');
  for(const t of tags){
    L('  ['+t.tagId+'] '+t.name);
    L('      type='+t.type+' paused='+(t.paused?'YES':'no'));
    L('      firing=['+((t.firingTriggerId||[]).join(','))+'] blocking=['+((t.blockingTriggerId||[]).join(','))+']');
    if(t.consentSettings) L('      consent='+JSON.stringify(t.consentSettings));
    const ps=(t.parameter||[]).filter(p=>/measurementId|tagId|pixelId|conversionId|trackingId|streamId/i.test(p.key));
    if(ps.length) L('      params='+ps.map(p=>p.key+'='+(p.value||'')).join(' | '));
  }
  L('');
  const tr = await gtm(token,'/'+W.path+'/triggers'); const trigs=tr.body.trigger||[];
  L('=== TRIGGERS ('+trigs.length+') HTTP '+tr.status+' ===');
  for(const t of trigs) L('  ['+t.triggerId+'] '+t.name+' | type='+t.type);
  L('');
  const vr = await gtm(token,'/'+W.path+'/variables'); const vars=vr.body.variable||[];
  L('=== VARIABLES ('+vars.length+') HTTP '+vr.status+' ===');
  for(const v of vars) L('  ['+v.variableId+'] '+v.name+' | type='+v.type);
  L('');
  const bv = await gtm(token,'/'+W.path+'/built_in_variables'); const bvars=bv.body.builtInVariable||[];
  L('=== BUILT-IN ('+bvars.length+') ===');
  L('  '+bvars.map(v=>v.type).join(', ')); L('');
  const lv = await gtm(token,'/'+target.path+'/versions:live');
  L('=== LIVE VERSION HTTP '+lv.status+' ===');
  if(lv.status===200) L('  versionId='+lv.body.containerVersionId+' | tags='+((lv.body.tag||[]).length)+' triggers='+((lv.body.trigger||[]).length)+' vars='+((lv.body.variable||[]).length));
  else L('  '+JSON.stringify(lv.body).slice(0,300));
}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('gtm_recon.txt', out);
console.log(out);
