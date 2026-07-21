import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
let html='';
try{ html=execSync('curl -Lsk "https://dev.avesa.lt/?p=18545"',{maxBuffer:30*1024*1024}).toString(); }catch(e){}
const hidx=html.indexOf('Rekomenduojamas');
const slice = hidx>=0 ? html.slice(Math.max(0,hidx-400), hidx+500) : 'NF';
// count summaries
const summaries=(html.match(/<summary[^>]*>(.*?)<\/summary>/g)||[]).map(s=>s.replace(/<[^>]+>/g,'').trim()).filter(x=>x.length<60);
console.log('PUT:',pr('slice2.json',{d:{hidx, slice, summaries}}));
