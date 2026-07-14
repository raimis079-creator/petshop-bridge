import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" "'+SAPI+path+'"';
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  return {code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?', raw:r.replace(/\nHTTP:\S+$/,'')};
}
(async()=>{
  L('=== Sender domeno autentifikacija (SPF/DKIM/DMARC) ===');
  // Domenu sarasas + verifikacijos statusas
  const endpoints = ['/domains', '/account/domains', '/senders', '/account/senders'];
  for(const ep of endpoints){
    const r = scall('GET', ep);
    L(ep+' -> HTTP '+r.code);
    if(r.code==='200'){ L(r.raw.slice(0,800)); }
    else { L('  '+r.raw.slice(0,100)); }
    L('');
  }
  putText('sender_domain.txt', out);
  console.log('done');
})();
