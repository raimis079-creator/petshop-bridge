import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
const O={laikas:new Date().toISOString()};
O.dns = sh('getent hosts dev.avesa.lt || echo NERA').trim();
O.ping_443 = sh('timeout 15 bash -c "cat < /dev/null > /dev/tcp/dev.avesa.lt/443" && echo PORTAS_ATVIRAS || echo PORTAS_UZDARAS').trim();
for (const [k,p] of [['home','/'],['paskyra','/paskyra/'],['anketa','/augintinio-profilis/']]) {
  O[k] = sh('curl -sSk -m 30 -o /dev/null -w "%{http_code} laikas=%{time_total}s" "'+SITE+p+'"').trim();
}
O.antrastes = sh('curl -sSkI -m 30 "'+SITE+'/" | head -8');
putB64('ping.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
