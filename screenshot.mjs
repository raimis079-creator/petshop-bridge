import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function prbin(n,path){const b=fs.readFileSync(path).toString('base64');const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
  try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/img.json',JSON.stringify({message:'img',content:b,...(s?{sha:s}:{})}));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/img.json "'+u+'"',{maxBuffer:20*1024*1024}).toString().trim();}
const imgs={
  'h_small.png':'https://exclusion.lt/wp-content/uploads/2024/10/P9_Hypoallergenic-sunims_kiauliena-zirniai_SAUSAS-maistas-mazoms-veislems_SERIMAS.png',
  'h_small2.png':'https://exclusion.lt/wp-content/uploads/2024/10/P8_Hypoallergenic-sunims_vabzdziai-zirniai_SAUSAS-maistas-mazoms-veislems_SERIMAS.png',
  'h_ml.png':'https://exclusion.lt/wp-content/uploads/2024/10/P9_Hypoallergenic-sunims_kiauliena-zirniai_SAUSAS-maistas-vidutinems-veislems_SERIMAS.png',
  'ng_small.png':'https://exclusion.lt/wp-content/uploads/2024/10/P45_MONOPROTEIN_sunys_vistiena_SAUSAS_SERIMAS.png',
  'ng_med.png':'https://exclusion.lt/wp-content/uploads/2024/10/P48_MONOPROTEIN_vidutinio-dydzio-sunims_vistiena_SAUSAS_SERIMAS.png',
  'ng_large.png':'https://exclusion.lt/wp-content/uploads/2024/10/P51_MONOPROTEIN_dideliu-veisliu-sunims_vistiena_SAUSAS_SERIMAS.png',
};
const out={};
for(const [n,u] of Object.entries(imgs)){
  try{ execSync('curl -sk --max-time 20 -o /tmp/'+n+' "'+u+'"'); out[n]={size:fs.statSync('/tmp/'+n).size,up:prbin(n,'/tmp/'+n)}; }catch(e){ out[n]={err:String(e).slice(0,50)}; }
}
console.log(JSON.stringify(out));
