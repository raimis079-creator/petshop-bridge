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
  const base='https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/';
  const h1=execSync('curl -skL --max-time 70 "'+base+'"',{maxBuffer:20e6,timeout:85000}).toString();
  o.be_forma  = (h1.match(/<form class="ps-wask"/g)||[]).length;
  o.be_badge  = (h1.match(/<div class="ps-cb">/g)||[]).length;
  o.be_filtras= (h1.match(/<div class="ps-wfilter">/g)||[]).length;
  const h2=execSync('curl -skL --max-time 90 "'+base+'?ps_weight=13&ps_species=dog"',{maxBuffer:20e6,timeout:110000}).toString();
  o.su_forma  = (h2.match(/<form class="ps-wask"/g)||[]).length;
  o.su_badge  = (h2.match(/<div class="ps-cb">/g)||[]).length;
  o.su_filtras= (h2.match(/<div class="ps-wfilter">/g)||[]).length;
  const bb=[...h2.matchAll(/<div class="ps-cb">([\s\S]*?)<\/div>/g)].slice(0,4).map(m=>m[1].replace(/<[^>]*>/g,'').trim());
  o.pvz=bb;
  // kacių kategorija
  const cbase='https://dev.avesa.lt/kategorija/katems/maistas-katems/sausas-maistas-katems/';
  const h3=execSync('curl -skL --max-time 70 "'+cbase+'"',{maxBuffer:20e6,timeout:85000}).toString();
  o.kat_forma=(h3.match(/<form class="ps-wask"/g)||[]).length;
  const q=h3.match(/aria-label="([^"]*)"/); o.kat_label=q?q[1]:null;
  // NE maisto kategorija — neturi rodyti
  const obase='https://dev.avesa.lt/kategorija/sunims/';
  const h4=execSync('curl -skL --max-time 70 "'+obase+'"',{maxBuffer:20e6,timeout:85000}).toString();
  o.kita_kat_forma=(h4.match(/<form class="ps-wask"/g)||[]).length;
}catch(e){o.err=String(e).slice(0,250);}
putB64('prec.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
