import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'wpdiag',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:8*1024*1024,timeout:60000}).toString().slice(0,800);}catch(e){return 'EXITFAIL: '+String(e.stdout||e.message).slice(0,500);}}
const o={};
o.dns_dev = sh('getent hosts dev.avesa.lt || echo NO_DNS');
o.dns_prod = sh('getent hosts petshop.lt || echo NO_DNS');
o.head_dev = sh('curl -s -m 25 -o /dev/null -w "code=%{http_code} ip=%{remote_ip} t=%{time_total}" -I https://dev.avesa.lt/');
o.head_dev_root = sh('curl -s -m 25 -o /dev/null -w "code=%{http_code} ip=%{remote_ip}" https://dev.avesa.lt/');
o.wpjson = sh('curl -s -m 25 -o /dev/null -w "code=%{http_code}" https://dev.avesa.lt/wp-json/');
o.head_prod = sh('curl -s -m 25 -o /dev/null -w "code=%{http_code} ip=%{remote_ip}" -I https://petshop.lt/');
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U); fs.writeFileSync('/tmp/wpp',P);
o.auth_probe = sh('curl -s -m 25 -o /tmp/o.txt -w "code=%{http_code}" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/wc/v3/products?per_page=1"');
try{o.auth_body=fs.readFileSync('/tmp/o.txt','utf8').slice(0,300);}catch(e){o.auth_body='(nera failo)';}
o.runner_ip = sh('curl -s -m 20 https://api.github.com/meta -o /dev/null -w "gh=%{http_code}"');
putResult('wpdiag.json',o);
console.log('DONE');
