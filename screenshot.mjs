import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function probe(u){ try{
  const o=execSync('curl -sSkI -L --max-time 25 "'+u+'" -o /dev/null -w "%{http_code}|%{url_effective}" 2>&1',{maxBuffer:10e6}).toString().trim();
  return o.slice(0,150); }catch(e){ return 'ERR'; } }
const O={venipak:{},lp:{}};
const V='106200460';
for (const u of [
  'https://venipak.com/lt/siuntos-sekimas/?code='+V,
  'https://venipak.com/lt/siuntos-sekimas?code='+V,
  'https://www.venipak.com/lt/siuntos-sekimas/?code='+V,
  'https://venipak.lt/siuntos-sekimas/?code='+V,
]) O.venipak[u]=probe(u);
// LP Express — testinis barkodas formato pavyzdziui
const B='CE123456789LT';
for (const u of [
  'https://www.post.lt/siuntos-paieska?barcode='+B,
  'https://www.post.lt/siuntu-sekimas?barcode='+B,
  'https://www.post.lt/siuntu-sekimas',
  'https://lpexpress.lt/lt/siuntos-sekimas?barcode='+B,
]) O.lp[u]=probe(u);
putB64('url.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
