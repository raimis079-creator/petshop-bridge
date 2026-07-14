import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n'; };
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  return {code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?', raw:r.replace(/\nHTTP:\S+$/,'')};
}
(async()=>{
  L('=== Ar galim KURTI workflow per API? ===');
  // POST /workflows bandymas
  const r = scall('POST','/workflows', {name:'PS Test E2E order_paid', trigger:'event', event_type:'order_paid'});
  L('POST /workflows -> HTTP '+r.code);
  L(r.raw.slice(0,300));
  L('');

  // Alternatyva: ar galim siusti transactional email tiesiogiai (kad E2E patikrintume laiško pristatyma)?
  L('=== Transactional email siuntimas (alternatyva workflow) ===');
  // /message/send su transactional token
  const TK=(process.env.SENDER_TRANSACTIONAL_TOKEN||'').trim();
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X POST -H "Authorization: Bearer '+TK+'" -H "Accept: application/json" -H "Content-Type: application/json" ';
  const body={to:{email:'terra@gyvunai.lt'}, from:{email:'terra@petshop.lt',name:'Petshop.lt'}, subject:'E2E test', html:'<p>test</p>'};
  fs.writeFileSync('/tmp/tb.json',JSON.stringify(body));
  cmd += '--data-binary @/tmp/tb.json "'+SAPI+'/message/send"';
  let tr;try{tr=execSync(cmd,{encoding:'utf8'});}catch(e){tr=(e.stdout||'')+'\nERR';}
  L('POST /message/send -> '+tr.slice(0,300));

  putText('sender_wf_create.txt', out);
  console.log('done');
})();
