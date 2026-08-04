import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();return o;}catch(e){return String(e).slice(0,200);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s405',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const O={VERSIJA_RUN:'run405-sveikata'};
const t=[];
for(const p of ['/','/parduotuve/','/wp-json/']){
  t.push(p+' -> '+sh('curl -sSk -o /dev/null -w "%{http_code}|%{time_total}" --max-time 60 "'+SITE+p+'"').trim());
}
O.puslapiai=t;
putResult('s405.json', JSON.stringify(O,null,1));
console.log('OK');
