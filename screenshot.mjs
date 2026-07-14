import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  return {code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?', raw:r.replace(/\nHTTP:\S+$/,'')};
}
(async()=>{
  L('=== Kaip mūsų order_paid event atrodo Sender pusej ===');
  // Nusiunciam order_paid event i Sender (kaip adapter darytu) + tikrinam ar priima
  const eventBody = {
    subscriber: {email: 'terra@gyvunai.lt'},
    type: 'order_paid',
    order_id: 88888,
    order_total: 25.50,
    order_currency: 'EUR'
  };
  const r = scall('POST','/events', eventBody);
  L('POST /events (order_paid) -> HTTP '+r.code);
  L(r.raw.slice(0,300));
  L('');

  // Ar galim gauti esamu workflow detales (tas kuri sukurem e1wk0P)
  L('=== Esamas workflow e1wk0P (DRAFT) ===');
  const w = scall('GET','/workflows/e1wk0P');
  L('HTTP '+w.code);
  L(w.raw.slice(0,600));

  putText('sender_event_wf.txt', out);
  console.log('done');
})();
