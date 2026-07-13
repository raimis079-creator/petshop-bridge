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
  L('TESTAS #2 — property verifikacija');
  L('');
  // Send one clean event with clear properties
  L('--- Emit refill_due su aiskiais property ---');
  const e=call('POST','/events',{subscriber:{email:'terra@gyvunai.lt'}, type:'refill_due', product_sku:'EXCL-2KG', cycle_n:3, days_left:5});
  L('  '+e.raw.slice(0,100));
  execSync('sleep 3');
  L('');
  // Try to read events back - several possible endpoints
  L('--- GET /subscribers/{email}/events ---');
  const g1=call('GET','/subscribers/terra@gyvunai.lt/events');
  L('  HTTP '+g1.code+' body: '+(g1.raw||'(tuscia)').slice(0,500));
  L('');
  L('--- GET /events?email= ---');
  const g2=call('GET','/events?email=terra@gyvunai.lt');
  L('  HTTP '+g2.code+' body: '+(g2.raw||'(tuscia)').slice(0,400));
  L('');
  // full subscriber record — events may be embedded
  L('--- GET /subscribers/{email} (full) ---');
  const g3=call('GET','/subscribers/terra@gyvunai.lt');
  if(g3.j&&g3.j.data){
    const d=g3.j.data;
    const keys=Object.keys(d);
    L('  subscriber laukai: '+JSON.stringify(keys));
    // look for anything event/activity related
    for(const k of keys){ if(/event|activit|action/i.test(k)){ L('    '+k+' = '+JSON.stringify(d[k]).slice(0,200)); } }
  }
  putText('_test2verify.txt', out);
  console.log('done');
})();
