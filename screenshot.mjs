import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
try{
  const js = execSync('curl -sk "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-profile.js?v='+Date.now()+'"',{maxBuffer:50e6,timeout:30000}).toString();
  o.pp_bytes = js.length;
  o.feeding_states = js.includes('Nustatę maistą matysite');
  o.repeat_null = js.includes('if (!shelf || !shelf.product_name) return null');
  o.refill_fb = js.includes("'Baigsis anksčiau','sooner'");
  o.hero_chips_row = js.includes('Chip\'ai atskiroje eileje');
  const jf = execSync('curl -sk "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-form.js?v='+Date.now()+'"',{maxBuffer:50e6,timeout:30000}).toString();
  o.pf_bytes = jf.length;
  o.fish_promise = jf.includes('akvariumo priežiūrą');
}catch(e){ o.err=String(e).slice(0,200); }
putB64('a2ver.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
