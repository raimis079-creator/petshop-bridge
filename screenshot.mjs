import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s382',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const O={VERSIJA_RUN:'run382-sveikata'};
const t=[];
for(const p of ['/','/parduotuve/','/cart/','/checkout/','/wp-json/']){
  const r=sh('curl -sSk -o /dev/null -w "%{http_code}|%{time_total}" --max-time 40 "'+SITE+p+'"');
  t.push(p+' -> '+r.out.trim());
}
O.puslapiai=t;
const AUTH='-u "'+WU+':'+WP+'"';
O.rest=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 40 '+AUTH+' "'+SITE+'/wp-json/code-snippets/v1/snippets?per_page=1"').out.trim();
putResult('s382.json', JSON.stringify(O,null,1));
console.log('OK');
