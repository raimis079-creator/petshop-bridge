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
const CT='accounts/6071827163/containers/101921278';
let out=''; const L=(s)=>{out+=s+'\n';};
try{
  const sa=loadSA(); const t=await getToken(sa);
  const ws=await gtm(t,'/'+CT+'/workspaces'); const wss=ws.body.workspace||[];
  L('=== WORKSPACES ('+wss.length+') ===');
  for(const w of wss) L('  ['+w.workspaceId+'] '+w.name+(w.description?' — '+w.description:''));
  const W=wss.find(w=>w.name==='Default Workspace')||wss[0];
  L('  -> naudojam: '+W.name+' (id '+W.workspaceId+')'); L('');

  const tg=await gtm(t,'/'+W.path+'/tags'); const tags=tg.body.tag||[];
  L('=== TAGS ('+tags.length+') ===');
  for(const x of tags){
    L('  ['+x.tagId+'] '+x.name);
    L('       type='+x.type+'  paused='+(x.paused?'YES':'no')+'  fireOnce='+(x.firingTriggerId?'':''));
    L('       firing=['+((x.firingTriggerId||[]).join(','))+']  blocking=['+((x.blockingTriggerId||[]).join(','))+']');
    if(x.consentSettings) L('       consentSettings='+JSON.stringify(x.consentSettings));
    const ps=(x.parameter||[]).filter(p=>/measurementId|tagId|pixelId|conversionId|conversionLabel|trackingId|streamId|serverContainerUrl/i.test(p.key));
    if(ps.length) L('       key params: '+ps.map(p=>p.key+'='+(p.value||JSON.stringify(p.list||p.map||''))).join(' | '));
  }
  L('');
  const tr=await gtm(t,'/'+W.path+'/triggers'); const trigs=tr.body.trigger||[];
  L('=== TRIGGERS ('+trigs.length+') ===');
  for(const x of trigs){
    L('  ['+x.triggerId+'] '+x.name+'  type='+x.type);
    const cond=(x.filter||[]).concat(x.customEventFilter||[]);
    for(const f of cond){
      const a=(f.parameter||[]).map(p=>p.value).join(' ');
      L('        cond: '+f.type+' -> '+a);
    }
  }
  L('');
  const vr=await gtm(t,'/'+W.path+'/variables'); const vars=vr.body.variable||[];
  L('=== USER VARIABLES ('+vars.length+') ===');
  for(const v of vars) L('  ['+v.variableId+'] '+v.name+'  type='+v.type);
  L('');
  const bv=await gtm(t,'/'+W.path+'/built_in_variables'); const bvars=bv.body.builtInVariable||[];
  L('=== BUILT-IN VARIABLES ('+bvars.length+') ===');
  L('  '+bvars.map(v=>v.type).join(', ')); L('');
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('=== LIVE VERSION HTTP '+lv.status+' ===');
  if(lv.status===200){
    L('  versionId='+lv.body.containerVersionId+'  name='+(lv.body.name||'-'));
    L('  tags='+((lv.body.tag||[]).length)+'  triggers='+((lv.body.trigger||[]).length)+'  vars='+((lv.body.variable||[]).length));
    L('  live tag names: '+((lv.body.tag||[]).map(x=>x.name).join(' | ')||'-'));
  } else L('  '+JSON.stringify(lv.body).slice(0,300));
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('gtm_recon.txt', out); console.log(out);
