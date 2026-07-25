import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
// nonce reikia - imam per admin. Kvieciam REST tiesiogiai su curl -u (App Password)
// bet food-search permission? tikrinam ar public
try{
  // 1. Tiesiogiai per HTTP be auth (kaip anonimas anketoje)
  const r1=execSync('curl -sk "https://dev.avesa.lt/wp-json/petshop/v1/food-search?q=ontario&species=dog"',{maxBuffer:5e6,timeout:40000}).toString();
  o.http_dog = r1.slice(0,1200);
  // 2. be species
  const r2=execSync('curl -sk "https://dev.avesa.lt/wp-json/petshop/v1/food-search?q=ontario"',{maxBuffer:5e6,timeout:40000}).toString();
  o.http_nospecies = r2.slice(0,600);
}catch(e){o.err=String(e).slice(0,200);}
putB64('fsapi.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
