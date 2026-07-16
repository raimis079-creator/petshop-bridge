import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'tlsdiag',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:8*1024*1024,timeout:60000}).toString().trim().slice(0,900);}catch(e){return 'EXIT'+(e.status||'?')+': '+String(e.stdout||e.message).trim().slice(0,700);}}
const o={};
o.a_tcp443   = sh('timeout 15 bash -c "</dev/tcp/79.98.29.24/443" && echo TCP443_OPEN || echo TCP443_CLOSED');
o.b_tcp80    = sh('timeout 15 bash -c "</dev/tcp/79.98.29.24/80" && echo TCP80_OPEN || echo TCP80_CLOSED');
o.c_https_v  = sh('curl -sv -m 20 -o /dev/null https://dev.avesa.lt/ 2>&1 | tail -25');
o.d_https_k  = sh('curl -sk -m 20 -o /dev/null -w "code=%{http_code}" https://dev.avesa.lt/');
o.e_http     = sh('curl -s -m 20 -o /dev/null -w "code=%{http_code} redir=%{redirect_url}" http://dev.avesa.lt/');
o.f_cert     = sh('echo | timeout 20 openssl s_client -connect dev.avesa.lt:443 -servername dev.avesa.lt 2>&1 | grep -Ei "subject=|issuer=|verify|Verification|notAfter|alert|failure" | head -12');
o.g_http_wp  = sh('curl -s -m 20 -o /dev/null -w "code=%{http_code} redir=%{redirect_url}" "http://dev.avesa.lt/wp-json/"');
putResult('tlsdiag.json',o);
console.log('DONE');
