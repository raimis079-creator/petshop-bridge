import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function prbin(n,path){const b=fs.readFileSync(path).toString('base64');const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
  try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/img.json',JSON.stringify({message:'img',content:b,...(s?{sha:s}:{})}));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/img.json "'+u+'"',{maxBuffer:20*1024*1024}).toString().trim();}
const imgs={
  'hyd1.png':'https://exclusion.lt/wp-content/uploads/2024/09/P5_HYD1.png',
  'hyd2.png':'https://exclusion.lt/wp-content/uploads/2024/09/P5_HYD2.png',
  'hyd3.png':'https://exclusion.lt/wp-content/uploads/2024/09/P5_HYD4.png',
  'hyd4.png':'https://exclusion.lt/wp-content/uploads/2024/09/P5_HYD3.png',
};
const out={};
for(const [n,u] of Object.entries(imgs)){
  try{ execSync('curl -sk --max-time 25 -o /tmp/'+n+' "'+u+'"'); out[n]={size:fs.statSync('/tmp/'+n).size,up:prbin(n,'/tmp/'+n),src:u}; }catch(e){ out[n]={err:String(e).slice(0,60)}; }
}
console.log(JSON.stringify(out));
