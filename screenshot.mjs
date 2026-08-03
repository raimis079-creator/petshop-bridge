import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s387',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run387-tiesiogiai'};
// tiesiogiai pagal ZINOMUS ID
for(const id of [2171,2172]){
  const g=sh('curl -sSk --max-time 30 '+AUTH+' "'+API+'/'+id+'"');
  let j=null; try{j=JSON.parse(g.out);}catch(e){}
  O['pries_'+id]= j? {name:j.name, active:j.active} : {raw:g.out.slice(0,120)};
  fs.writeFileSync('/tmp/o.json',JSON.stringify({active:false}));
  const c=sh('curl -sSk --max-time 30 -o /dev/null -w "%{http_code}" '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o.json "'+API+'/'+id+'"');
  O['isjungimas_'+id]=c.out.trim();
  const g2=sh('curl -sSk --max-time 30 '+AUTH+' "'+API+'/'+id+'"');
  let j2=null; try{j2=JSON.parse(g2.out);}catch(e){}
  O['po_'+id]= j2? {active:j2.active} : null;
}
// patikra: 2173 (v3) aktyvus?
const g3=sh('curl -sSk --max-time 30 '+AUTH+' "'+API+'/2173"');
let j3=null; try{j3=JSON.parse(g3.out);}catch(e){}
O.v3 = j3? {name:j3.name, active:j3.active} : {raw:g3.out.slice(0,120)};
sh('sleep 3');
const h=sh('curl -sSk --max-time 45 "'+SITE+'/?ps_b2=B2setup-9fK3xQ7mZp"');
O.rodo_v3 = /v3<\/span>/.test(h.out) ? 'TAIP' : 'NE';
O.turi_forma = /name="appkey"/.test(h.out) ? 'taip' : 'ne';
O.antraste = (h.out.match(/<h1>[\s\S]{0,120}?<\/h1>/)||[''])[0].replace(/\s+/g,' ');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 25 "'+SITE+'/"').out.trim();
putResult('s387.json', JSON.stringify(O,null,1));
console.log('OK');
