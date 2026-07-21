import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr_bin(n,localpath){
  const b=fs.readFileSync(localpath).toString('base64');
  const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
  try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/img.json',JSON.stringify({message:'img',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/img.json "'+u+'"').toString().trim();
  return c;
}
// parsisiunciam serimo lenteles is exclusion.lt
const imgs={
  'excl_inpm_serimas.png':'https://exclusion.lt/wp-content/uploads/2024/10/P18_Intestinal-sunims_kiauliena-ryziai_SAUSAS-vidutinems-veislems_SERIMAS.png',
};
const out={};
for(const [name,url] of Object.entries(imgs)){
  try{
    execSync('curl -sk -o /tmp/'+name+' "'+url+'"',{timeout:30000});
    const sz=fs.statSync('/tmp/'+name).size;
    const code=pr_bin(name,'/tmp/'+name);
    out[name]={size:sz,upload:code};
  }catch(e){ out[name]={err:String(e).slice(0,100)}; }
}
console.log(JSON.stringify(out));
