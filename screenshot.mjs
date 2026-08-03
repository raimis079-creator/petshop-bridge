import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s352',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run352-cleanup-v1'};
// aktyvuoti snippet 2143 (TEMP S351 su ps_e2c)
fs.writeFileSync('/tmp/on.json',JSON.stringify({active:true}));
O.on=sh('curl -sSk --max-time 30 -o /dev/null -w "%{http_code}" '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/on.json "'+API+'/2143"').out.trim();
sh('sleep 3');
function q(a){const x=sh('curl -sSk -m 45 "'+SITE+'/?ps_e2c='+a+'&z='+Math.random()+'"');try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,300)};}}
O.pries=q('pets');
O.cleanup=q('cleanup2');
// deaktyvuoti
fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
O.off=sh('curl -sSk --max-time 30 -o /dev/null -w "%{http_code}" '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/2143"').out.trim();
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putResult('s352.json', JSON.stringify(O,null,1));
console.log('OK');
