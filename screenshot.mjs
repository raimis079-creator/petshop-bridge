import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={};
try{
  const call=(b)=>{ fs.writeFileSync('/tmp/cb.json', JSON.stringify(b));
    const r=execSync('curl -sk --max-time 45 -X POST -H "Content-Type: application/json" --data-binary @/tmp/cb.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{maxBuffer:8e6,timeout:60000}).toString();
    try{ return JSON.parse(r); }catch(e){ return {raw:r.slice(0,300)}; } };
  const a=call({product_id:18620, weight_kg:13, species_code:'dog'});
  o.raktai = Object.keys(a);
  o.pilnas = a;
  const b=call({product_id:18620, weight_kg:13, species_code:'dog', activity_code:'moderate'});
  o.raktai_su_akt = Object.keys(b);
}catch(e){o.err=String(e).slice(0,250);}
putB64('dbg.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
