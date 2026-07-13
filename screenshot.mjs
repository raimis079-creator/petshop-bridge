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
  L('======================================');
  L('TESTAS #2: Custom events + property');
  L('======================================');
  L('');
  // TZ event: refill_due su payload (product_sku, cycle_n, days_left)
  const payload={
    email:'terra@gyvunai.lt',
    event:'refill_due',
    // property variantai — bandom kelis pavadinimus
  };

  // Bandymas A: POST /events su {email, event, ...properties}
  L('--- A: POST /events ---');
  const a=call('POST','/events',{email:'terra@gyvunai.lt', event:'refill_due', product_sku:'EXCL-2KG', cycle_n:3, days_left:5});
  L('  HTTP '+a.code+' resp: '+a.raw.slice(0,250));
  L('');

  // Bandymas B: POST /activities/events
  L('--- B: POST /activities ---');
  const b=call('POST','/activities',{email:'terra@gyvunai.lt', event:'refill_due', properties:{product_sku:'EXCL-2KG', cycle_n:3, days_left:5}});
  L('  HTTP '+b.code+' resp: '+b.raw.slice(0,250));
  L('');

  // Bandymas C: POST /subscribers/{email}/events
  L('--- C: POST /subscribers/{email}/events ---');
  const c=call('POST','/subscribers/terra@gyvunai.lt/events',{event:'refill_due', properties:{product_sku:'EXCL-2KG', cycle_n:3, days_left:5}});
  L('  HTTP '+c.code+' resp: '+c.raw.slice(0,250));
  L('');

  // Bandymas D: POST /track (custom events tracking)
  L('--- D: POST /track ---');
  const d=call('POST','/track',{email:'terra@gyvunai.lt', event:'refill_due', data:{product_sku:'EXCL-2KG', cycle_n:3, days_left:5}});
  L('  HTTP '+d.code+' resp: '+d.raw.slice(0,250));
  putText('_test2probe.txt', out);
  console.log('done');
})();
