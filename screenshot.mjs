import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
let list=[]; try{ list=JSON.parse(execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?per_page=100"',{maxBuffer:20*1024*1024}).toString()); }catch(e){}
const temps=list.filter(s=>/\(temp\)/i.test(s.name||''));
const acted=[];
for(const s of temps){
  let code='';
  try{ code=execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+s.id+'"').toString(); }catch(e){ code='ERR'; }
  acted.push({id:s.id,name:s.name,active:s.active,del:code.slice(0,40)});
}
// re-list to confirm
let after=[]; try{ after=JSON.parse(execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?per_page=100"',{maxBuffer:20*1024*1024}).toString()); }catch(e){}
const remaining_temps=after.filter(s=>/\(temp\)/i.test(s.name||'')).map(s=>({id:s.id,name:s.name}));
const any_active=after.filter(s=>s.active).map(s=>s.name);
console.log('PUT:',pr('cleanup.json',{deleted:acted,remaining_temps,active_snippets:any_active}));
