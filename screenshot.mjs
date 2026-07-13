import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  L('=== petshop.lt recon (nekenksmingas) ===');
  L('');
  L('--- 1. SSL galiojimas (strict, be -k) ---');
  const ssl=sh('curl -s -o /dev/null -w "HTTP:%{http_code} SSL_VERIFY:%{ssl_verify_result}" --max-time 20 "https://petshop.lt/" 2>&1');
  L('  '+ssl);
  L('');
  L('--- 2. Sertifikato detalės ---');
  const cert=sh('echo | timeout 15 openssl s_client -connect petshop.lt:443 -servername petshop.lt 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null');
  L(cert||'(nepavyko)');
  L('');
  L('--- 3. Ar tai WordPress + REST API pasiekiamas ---');
  const rest=sh('curl -s -o /dev/null -w "HTTP:%{http_code}" --max-time 20 "https://petshop.lt/wp-json/" 2>&1');
  L('  /wp-json/ : '+rest);
  L('');
  L('--- 4. Kokia sistema (headers) ---');
  const hdr=sh('curl -s -I --max-time 20 "https://petshop.lt/" 2>&1 | head -15');
  L(hdr);
  putText('_petshoprecon.txt', out);
  console.log('done');
})();
