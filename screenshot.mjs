import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function pr(n,ob){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(ob)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
try{ o.routes = execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/petshop/v1" ',{maxBuffer:5*1024*1024,timeout:40000}).toString().slice(0,300); }catch(e){ o.routes='ERR '+String(e).slice(0,150); }
fs.writeFileSync('/tmp/b.json', JSON.stringify({product_id:18014,weight_kg:10,activity_code:'moderate',species_code:'dog'}));
try{ o.admin = execSync('curl -sk -w "__H%{http_code}" '+AUTH+' -X POST -H "Content-Type: application/json" --data-binary @/tmp/b.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{maxBuffer:5*1024*1024,timeout:40000}).toString(); }catch(e){ o.admin='ERR '+String(e).slice(0,150); }
try{ o.anon = execSync('curl -sk -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" --data-binary @/tmp/b.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{timeout:40000}).toString().trim(); }catch(e){ o.anon='ERR '+String(e).slice(0,120); }
console.log('PUT:',pr('routetest.json',o));
