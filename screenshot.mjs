import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const OUT={};
// 1) istrinti 1885
fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
OUT.deact=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/1885"').rc;
OUT.del=sh('curl -sSk '+AUTH+' -X DELETE "'+API+'/1885"').out.slice(0,200);
sh('sleep 2');
OUT.verify=sh('curl -sSk '+AUTH+' "'+API+'/1885"').out.slice(0,200);
// 2) surasti VISUS likusius TEMP snippetus
const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
try{ const a=JSON.parse(l); OUT.total=a.length;
  OUT.temps=a.filter(x=>/TEMP|Recon|tmp|Dry-Run|DRY/i.test(x.name||'')).map(x=>({id:x.id,name:x.name,active:x.active}));
}catch(e){ OUT.list_err=l.slice(0,200); }
putB64('cl.json',Buffer.from(JSON.stringify(OUT,null,1)).toString('base64'));
console.log('done');
