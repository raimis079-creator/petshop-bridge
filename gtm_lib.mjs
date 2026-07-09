// gtm_lib.mjs — bendras GTM API + GitHub result helper
// Naudojimas: import { putFile, gtmToken, gtm, CT } from './gtm_lib.mjs';
import { execSync } from "child_process"; import fs from "fs"; import crypto from "crypto";

export const CT = 'accounts/6071827163/containers/101921278'; // GTM-MF3GZGT
export const IDS = {
  gtm:      'GTM-MF3GZGT',
  ga4:      'G-FMTKEGGLMG',
  gads:     'AW-11117260149',
  metaPixel:'1097111687955877',
  legacyGtm:'GTM-MZGDV75F'   // PROD OpenCart, nevaldomas
};

export function putFile(n, s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha='';
    try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const body={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};
    if(sha) body.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(body));
    execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
  }catch(e){}
}

function loadSA(){
  let r=(process.env.GTM_SA_JSON||'').trim();
  if(!r) throw new Error('GTM_SA_JSON tuscias');
  if(!r.startsWith('{')) r='{'+r;     // secret issaugotas be isoriniu skliaustu
  if(!r.endsWith('}'))   r=r+'}';
  return JSON.parse(r);
}
const b64url=(b)=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');

export async function gtmToken(){
  const sa=loadSA();
  const scopes=['tagmanager.readonly','tagmanager.edit.containers','tagmanager.edit.containerversions','tagmanager.publish','tagmanager.manage.users','tagmanager.manage.accounts']
    .map(s=>'https://www.googleapis.com/auth/'+s).join(' ');
  const now=Math.floor(Date.now()/1000);
  const h=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const c=b64url(JSON.stringify({iss:sa.client_email,scope:scopes,aud:sa.token_uri,exp:now+3600,iat:now}));
  const s=crypto.createSign('RSA-SHA256'); s.update(h+'.'+c);
  const sig=s.sign(sa.private_key).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const r=await fetch(sa.token_uri,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:h+'.'+c+'.'+sig})});
  const j=await r.json();
  if(!j.access_token) throw new Error('TOKEN FAIL '+JSON.stringify(j).slice(0,200));
  return j.access_token;
}

const BASE='https://tagmanager.googleapis.com/tagmanager/v2';
// gtm(token, path)                      -> GET
// gtm(token, path, 'POST', {body})      -> POST/PUT/DELETE
export async function gtm(token, path, method='GET', body=null){
  const opt={method, headers:{Authorization:'Bearer '+token}};
  if(body){ opt.headers['Content-Type']='application/json'; opt.body=JSON.stringify(body); }
  const r=await fetch(BASE+path, opt);
  const txt=await r.text();
  let j; try{ j = txt ? JSON.parse(txt) : {}; }catch(e){ j={_raw:txt.slice(0,300)}; }
  return {status:r.status, body:j};
}

export async function defaultWorkspace(token){
  const ws=await gtm(token,'/'+CT+'/workspaces');
  const list=ws.body.workspace||[];
  return list.find(w=>w.name==='Default Workspace')||list[0];
}
