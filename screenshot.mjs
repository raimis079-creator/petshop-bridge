import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();return o;}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s417',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run417-diag'};
const g=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'/2202"');
try{const j=JSON.parse(g); O.snippet={id:j.id,name:j.name,active:j.active,scope:j.scope,
  code_len:(j.code||'').length, code_pradzia:(j.code||'').slice(0,180)};}catch(e){O.raw=g.slice(0,400);}
O.testas=sh('curl -sSk --max-time 40 -o /dev/null -w "%{http_code}|%{size_download}" "'+SITE+'/?ps_s416=K416fh&act=recon"').trim();
putResult('s417.json', JSON.stringify(O,null,1));
console.log('OK');
