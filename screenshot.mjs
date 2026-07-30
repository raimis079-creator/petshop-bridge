import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={};
// DELETE variantai 1885
O.d1=sh('curl -sSk '+AUTH+' -X DELETE "'+API+'/1885?force=true"').out.slice(0,150);
O.d2=sh('curl -sSk '+AUTH+' -X POST -H "X-HTTP-Method-Override: DELETE" "'+API+'/1885"').out.slice(0,150);
sh('sleep 2');
const v=sh('curl -sSk '+AUTH+' "'+API+'/1885"').out;
O.still_1885 = v.includes('"id":1885');
try{ O.active_1885=JSON.parse(v).active; }catch(e){}
// snippet 472 turinys (pirmos eilutes) + ar turi guard
const s472=sh('curl -sSk '+AUTH+' "'+API+'/472"').out;
try{ const j=JSON.parse(s472); O.s472={name:j.name,active:j.active,scope:j.scope,
  head:String(j.code).slice(0,600), has_guard:/isset\(\$_GET/.test(j.code), len:String(j.code).length}; }
catch(e){ O.s472_err=s472.slice(0,200); }
putB64('cl2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
