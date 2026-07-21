import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const targets={
 '18545':['Rekomenduojamas kiekis per par','150–170','550–600'],
 '18551':['Rekomenduojamas kiekis per par','50–60','140–160'],
 '18620':['Rekomenduojamas kiekis per par','145–165','540–580'],
 '18554':['Rekomenduojamas kiekis per par','150–170','550–600']
};
const o={};
for(const pid of Object.keys(targets)){
  let html='';
  try{ html=execSync('curl -Lsk "https://dev.avesa.lt/?p='+pid+'"',{maxBuffer:30*1024*1024}).toString(); }catch(e){ html=''; }
  const checks={};
  for(const needle of targets[pid]){ checks[needle]= html.indexOf(needle)!==-1; }
  o[pid]={len:html.length, checks};
}
console.log('PUT:',pr('verifyfd.json',{d:o}));
