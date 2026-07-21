import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const pids=['18545','18551','18554','18557','18560','18563','18566','18569','18575','18578','18581','18584','18587','18590','18620','19899','20943'];
const o={};
for(const pid of pids){
  let h=''; try{ h=execSync('curl -Lsk "https://dev.avesa.lt/?p='+pid+'"',{maxBuffer:30*1024*1024}).toString(); }catch(e){}
  o[pid]={
    tables:(h.match(/Kiekis \/ 24 val\./g)||[]).length,
    old_intro:h.indexOf('Rekomenduojamas pašaro')!==-1?1:0,
    bad_18545:(pid==='18545')?(h.indexOf('140–155')!==-1?1:0):0,
    bad_18551:(pid==='18551')?(h.indexOf('45–55')!==-1||h.indexOf('45-55')!==-1?1:0):0
  };
}
console.log('PUT:',pr('finalall.json',{d:o}));
