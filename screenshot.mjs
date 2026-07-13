import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const API='https://api.sender.net/v2';
function call(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+API+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+API+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
(async()=>{
  L('TESTAS #2 (tikslinta) — POST /events su type');
  L('');
  // variantas su type=custom event pavadinimas + properties
  L('--- A1: {email, type:"refill_due", ...props} ---');
  const a1=call('POST','/events',{email:'terra@gyvunai.lt', type:'refill_due', product_sku:'EXCL-2KG', cycle_n:3, days_left:5});
  L('  HTTP '+a1.code+' resp: '+a1.raw.slice(0,300));
  L('');
  L('--- A2: {email, type:"refill_due", properties:{...}} ---');
  const a2=call('POST','/events',{email:'terra@gyvunai.lt', type:'refill_due', properties:{product_sku:'EXCL-2KG', cycle_n:3, days_left:5}});
  L('  HTTP '+a2.code+' resp: '+a2.raw.slice(0,300));
  L('');
  // maybe type is the event category and needs "event" name too
  L('--- A3: {email, type:"custom", event:"refill_due", data:{...}} ---');
  const a3=call('POST','/events',{email:'terra@gyvunai.lt', type:'custom', event:'refill_due', data:{product_sku:'EXCL-2KG', cycle_n:3, days_left:5}});
  L('  HTTP '+a3.code+' resp: '+a3.raw.slice(0,300));
  L('');
  // list events for the subscriber to verify
  L('--- Verifikacija: GET /subscribers/{email}/events (jei yra) ---');
  const ev=call('GET','/subscribers/terra@gyvunai.lt/events');
  L('  HTTP '+ev.code+' resp: '+ev.raw.slice(0,400));
  putText('_test2b.txt', out);
  console.log('done');
})();
