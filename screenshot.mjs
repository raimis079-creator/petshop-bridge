import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
function scall(method, path){
  const cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" "'+SAPI+path+'"';
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('======================================');
  L('TESTAS #8: Log retention / health dashboard');
  L('======================================');
  L('');
  L('--- Sender log endpoint\'ai ---');
  const eps=['/logs','/messages','/campaigns','/reports','/statistics','/account/logs'];
  for(const e of eps){
    const r=scall('GET',e);
    L('  GET '+e+' -> HTTP '+r.code+(r.code!=='404'?' (yra)':' (nera)'));
  }
  L('');
  L('--- Išvada (žinoma iš dokumentacijos) ---');
  L('  Sender log retention pagal planą:');
  L('    Free: 1 diena');
  L('    Standard (dabartinis): 5 dienos');
  L('    Professional: 30 dienų');
  L('');
  L('  → 5 dienų PER MAŽAI savaitiniam health dashboard\'ui (7 dienos)');
  L('  → SPRENDIMAS: health dashboard remiasi MŪSŲ ps_event_log (90d), ne Sender logais');
  L('  → Sender logai naudojami tik operatyviam debug (paskutinės 5 d.)');
  putText('_test8.txt', out);
  console.log('done');
})();
