import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  L('=== 1. Ar dev.avesa.lt viesai pasiekiamas su GALIOJANCIU SSL (be -k)? ===');
  // Sender needs valid public HTTPS. Test WITHOUT -k (strict SSL)
  const strictSSL=sh('curl -s -o /dev/null -w "HTTP:%{http_code} SSL_VERIFY:%{ssl_verify_result}" --max-time 20 -X POST -H "Content-Type: application/json" -d \'{"probe":"ssl"}\' "'+BASE+'/wp-json/petshop/v1/sender-webhook" 2>&1');
  L('  Strict SSL (kaip Sender matytu): '+strictSSL);
  L('');
  const withK=sh('curl -s -k -o /dev/null -w "HTTP:%{http_code}" --max-time 20 -X POST -H "Content-Type: application/json" -d \'{"probe":"k"}\' "'+BASE+'/wp-json/petshop/v1/sender-webhook" 2>&1');
  L('  Su -k (ignoruojant SSL): '+withK);
  L('');
  // check cert details
  L('=== 2. SSL sertifikato info ===');
  const cert=sh('echo | timeout 15 openssl s_client -connect dev.avesa.lt:443 -servername dev.avesa.lt 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null');
  L(cert||'(cert info nepavyko)');
  L('');
  // clear log, add another subscriber, wait LONGER (60s)
  L('=== 3. Trigger + ilgas laukimas (60s) ===');
  sh('curl -s -k --max-time 30 "'+BASE+'/?ps_webhook_log=1&clear=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  const te='webhooklong+'+Date.now()+'@example.com';
  const add=scall('POST','/subscribers',{email:te, firstname:'WHLong', groups:['bDxp2q']});
  L('  pridetas '+te+' HTTP '+add.code);
  L('  laukiu 60s...');
  execSync('sleep 60');
  const log=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_webhook_log=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  let la=[];try{la=JSON.parse(log);}catch(e){}
  L('  Woo gavo: '+la.length+' kvietimų');
  for(const e of la.slice(-4)){ L('    '+(JSON.stringify(e.parsed||e.body)).slice(0,200)); }
  L('');
  L('=== 4. Sender delivery stats po 60s ===');
  const list=scall('GET','/account/webhooks');
  const arr=(list.j.data||list.j||[]);
  if(Array.isArray(arr)) for(const w of arr){ L('  '+w.topic+': deliveries='+w.total_deliveries+' failures='+w.total_failures+' resp_time='+w.response_time); }
  putText('_test4e.txt', out);
  console.log('done');
})();
