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
const WH_URL='https://dev.avesa.lt/wp-json/petshop/v1/sender-webhook';
const WH_SECRET='uD5RdRkIjPorxrlouQDahacEyHxxoEO0TcemLKnX';
(async()=>{
  L('=== Sender webhook topic paieska ===');

  // Bandom ivairius topic pavadinimus (Sender nomenklatura neaiski, bandom logiskus)
  const topics = [
    'subscriber_unsubscribed',
    'subscribers/unsubscribed',
    'unsubscribe',
    'subscriber.unsubscribed',
    'contact_unsubscribed',
    'unsubscribed',
  ];
  L('--- Bandom topic reiksmes su minimaliu payload ---');
  let ok=null;
  for(const t of topics){
    const r = scall('POST','/account/webhooks', {url: WH_URL, topic: t, secret: WH_SECRET});
    L('  topic="'+t+'" -> HTTP '+r.code+' | '+r.raw.slice(0,150));
    if(r.code==='200'||r.code==='201'){ ok={topic:t, raw:r.raw}; break; }
  }
  L('');
  if(ok){
    L('=== PAVYKO su topic="'+ok.topic+'" ===');
    L(ok.raw.slice(0,400));
  } else {
    L('=== Nei vienas topic nepavyko — reikia teisingo enum ===');
  }
  L('');

  // Galutinis sarasas
  const after = scall('GET','/account/webhooks');
  L('--- Webhookai dabar ---');
  try {
    const d = JSON.parse(after.raw).data || [];
    L('  Viso: '+d.length);
    for(const w of d){ L('  '+JSON.stringify(w).slice(0,250)); }
  } catch(e){ L('  '+after.raw.slice(0,300)); }

  putText('sender_wh_topic.txt', out);
  console.log('done');
})();
