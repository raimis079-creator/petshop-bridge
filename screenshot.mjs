import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
const WH='https://webhook.site/94328e56-9d87-4421-bdb1-6568dd4d2c97';
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
(async()=>{
  L('TESTAS #4 — unsubscribe trigger + ilgas laukimas');
  L('');
  // trigger a real unsubscribe via API on a throwaway subscriber
  const te='whunsub+'+Date.now()+'@example.com';
  L('--- Pridedu + tada unsubscribe '+te+' ---');
  const add=scall('POST','/subscribers',{email:te, firstname:'Unsub', groups:['bDxp2q']});
  L('  add HTTP '+add.code);
  execSync('sleep 3');
  // unsubscribe: PATCH status or dedicated endpoint
  let uns=scall('PATCH','/subscribers/'+te,{status:{email:'unsubscribed'}});
  L('  unsubscribe (PATCH status) HTTP '+uns.code+' '+uns.raw.slice(0,120));
  if(uns.code!=='200'){
    // alt: POST /subscribers/{email}/unsubscribe
    let uns2=scall('POST','/subscribers/'+te+'/unsubscribe',{});
    L('  unsubscribe (POST /unsubscribe) HTTP '+uns2.code+' '+uns2.raw.slice(0,120));
  }
  L('');
  L('  laukiu 45s...');
  execSync('sleep 45');
  L('');
  L('--- Sender delivery stats ---');
  const list=scall('GET','/account/webhooks');
  const arr=(list.j&&(list.j.data||list.j))||[];
  if(Array.isArray(arr)) for(const w of arr){
    if((w.url||'').includes('webhook.site')){
      L('  '+w.topic+': deliveries='+w.total_deliveries+' failures='+w.total_failures+' resp='+w.response_time+'ms');
    }
  }
  L('');
  L('  >>> Patikrink webhook.site DAR KARTĄ <<<');
  putText('_test4unsub.txt', out);
  console.log('done');
})();
