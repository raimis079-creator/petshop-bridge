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
  L('=== Sender webhook registracija ===');
  L('URL: '+WH_URL);
  L('');

  // 1. Pirma — koks webhook create payload formatas? Bandom kelis variantus.
  // Sender webhook API: POST /account/webhooks su {url, event, ...}
  // Reikia issiaiskinti kokie event tipai palaikomi.
  L('--- 1. Esami webhookai (pries kurima) ---');
  const before = scall('GET','/account/webhooks');
  L('HTTP '+before.code+': '+before.raw.slice(0,300));
  L('');

  // 2. Bandom sukurti unsubscribe webhook
  // Sender dokumentacija: event tipai "subscriber_added", "subscriber_unsubscribed", "subscriber_bounced" ir pan.
  L('--- 2. Kuriam unsubscribe webhook ---');
  const variants = [
    {url: WH_URL, event: 'subscriber_unsubscribed', secret: WH_SECRET},
    {url: WH_URL, event: 'subscribers/unsubscribed'},
    {url: WH_URL, type: 'subscriber_unsubscribed'},
  ];
  let created = null;
  for(let i=0;i<variants.length;i++){
    const r = scall('POST','/account/webhooks', variants[i]);
    L('  variant '+(i+1)+' '+JSON.stringify(variants[i]).slice(0,80)+' -> HTTP '+r.code);
    L('    '+r.raw.slice(0,200));
    if(r.code==='200'||r.code==='201'){ created=r.raw; break; }
  }
  L('');

  // 3. Po kurimo — sarasas
  L('--- 3. Webhookai po kurimo ---');
  const after = scall('GET','/account/webhooks');
  L('HTTP '+after.code+': '+after.raw.slice(0,500));

  putText('sender_webhook_reg.txt', out);
  console.log('done');
})();
