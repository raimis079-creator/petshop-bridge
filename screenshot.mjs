import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
const ids=[736,738,797,798,1410,726];
for(const id of ids){
  try{ const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+id+'?n='+Math.random()+'"',{maxBuffer:20e6,timeout:30000}).toString();
    const s=JSON.parse(r);
    o[id]={name:s.name, active:s.active, scope:s.scope, code_head:(s.code||'').replace(/\s+/g,' ').slice(0,220)};
  }catch(e){ o[id]='ERR '+String(e).slice(0,60); }
}
putB64('inspect.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
