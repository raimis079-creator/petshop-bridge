import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={};
try{
  const h=execSync('curl -sk --max-time 45 "https://dev.avesa.lt/"',{maxBuffer:20e6}).toString();
  const i=h.indexOf('ps-login-wrap');
  o.rasta=i;
  if(i>0){ o.kontekstas=h.slice(Math.max(0,i-700), i+120).replace(/\s+/g,' '); }
  o.login_popup = h.indexOf('login-form-popup')>=0;
  const m=h.match(/id="login-form-popup"[^>]*/); o.popup_tag = m?m[0].slice(0,160):null;
}catch(e){o.err=String(e).slice(0,200);}
putB64('mb.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
