import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
try {
  // Ar serveris apskritai gyvas? HTTP status + ar yra pspet-form-host HTML'e
  const home = execSync('curl -sk -m 20 -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/"',{maxBuffer:5e6,timeout:25000}).toString().trim();
  o.home_status = home;
  const acc = execSync('curl -sk -m 20 -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/my-account/"',{maxBuffer:5e6,timeout:25000}).toString().trim();
  o.myaccount_status = acc;
  // Ar CSS/JS failai atsako?
  const css = execSync('curl -sk -m 20 -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/account.css"',{maxBuffer:5e6,timeout:25000}).toString().trim();
  o.css_status = css;
  const js = execSync('curl -sk -m 20 -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-form.js"',{maxBuffer:5e6,timeout:25000}).toString().trim();
  o.js_status = js;
  // JS syntax ar OK? (ar naujausias failas nesulauzytas)
  const jsbody = execSync('curl -sk -m 25 "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-form.js"',{maxBuffer:50e6,timeout:30000}).toString();
  o.js_bytes = jsbody.length;
  o.js_brace_balance = (jsbody.split('{').length - jsbody.split('}').length);
  o.js_has_renderStep2 = jsbody.includes('function renderStep2');
} catch(e){ o.err = String(e).slice(0,300); }
putB64('pgcheck.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
