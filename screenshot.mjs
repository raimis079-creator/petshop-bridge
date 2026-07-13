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
  // register subscribers/new webhook too
  const WH_URL = BASE + '/wp-json/petshop/v1/sender-webhook';
  L('--- Registruoju subscribers/new + groups/new-subscriber ---');
  for(const t of ['subscribers/new','groups/new-subscriber']){
    const r=scall('POST','/account/webhooks',{url:WH_URL, topic:t});
    L('  '+t+' HTTP '+r.code+(r.code==='200'?' ✅':' '+r.raw.slice(0,80)));
  }
  L('');
  // clear log
  sh('curl -s -k --max-time 30 "'+BASE+'/?ps_webhook_log=1&clear=1&token=cmplz_6680aa2a42151d54fa8d64ec"');

  // TRIGGER: add a fresh new subscriber (fires subscribers/new)
  L('--- Trigger: naujas subscriber (fires subscribers/new) ---');
  const testEmail='webhooktest+'+Date.now()+'@example.com';
  const add=scall('POST','/subscribers',{email:testEmail, firstname:'Webhook', lastname:'Test', groups:['bDxp2q']});
  L('  pridetas '+testEmail+' HTTP '+add.code);
  L('');
  L('  laukiu 12s webhook pristatymui...');
  execSync('sleep 12');
  L('');
  // check log
  const log=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_webhook_log=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  let logArr=[];try{logArr=JSON.parse(log);}catch(e){}
  L('--- Woo webhook log ---');
  L('  Gauta kvietimų: '+logArr.length);
  for(const e of logArr.slice(-6)){
    L('    ['+e.received_at+'] sig:'+e.signature_present);
    L('       '+(JSON.stringify(e.parsed||e.body)).slice(0,250));
  }
  L('');
  // also check webhook delivery stats on Sender side
  L('--- Sender webhook delivery stats ---');
  const list=scall('GET','/account/webhooks');
  if(list.j){
    const arr=(list.j.data||list.j||[]);
    if(Array.isArray(arr)) for(const w of arr){ L('  '+w.topic+': deliveries='+(w.total_deliveries||w.deliveries||0)+' failures='+(w.total_failures||w.failures||0)); }
  }
  putText('_test4c.txt', out);
  console.log('done');
})();
