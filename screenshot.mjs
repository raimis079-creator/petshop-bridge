import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1',{maxBuffer:50e6,shell:'/bin/bash'}).toString();return o;}catch(e){return String(e).slice(0,300);}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={deaktyvuota:[], klaidos:[]};
fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
for (const id of [1885,1937,1999,2003]) {
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+id+'"');
  let ok=false; try{ const j=JSON.parse(r); ok = (j && j.id && !j.active); }catch(e){}
  O.deaktyvuota.push(id+' -> '+(ok?'OK':r.slice(0,120)));
  // bandom ir istrinti (tikimes rest_cannot_delete)
  const d=sh('curl -sSk -o /dev/null -w "%{http_code}" '+AUTH+' -X DELETE "'+API+'/'+id+'"');
  O['delete_'+id]=d.trim();
}
// PATIKRA: kiek TEMP liko aktyviu
const ver=sh('curl -sSk '+AUTH+' "'+API+'?per_page=200"');
try{
  const arr=JSON.parse(ver);
  O.viso_snippetu=arr.length;
  O.TEMP_aktyvus=arr.filter(s=>s.name&&s.name.indexOf('TEMP')===0&&s.active).map(s=>s.id+':'+s.name);
  O.TEMP_viso=arr.filter(s=>s.name&&s.name.indexOf('TEMP')===0).length;
}catch(e){ O.klaidos.push('sarasas: '+ver.slice(0,200)); }
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').trim();
putB64('cleanup2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
