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
  L('TESTAS #4 — izoliacinis (webhook.site, galiojantis SSL)');
  L('');
  // 1. delete old dev.avesa.lt webhooks first (cleanup)
  L('--- Senų dev webhookų šalinimas ---');
  const old=scall('GET','/account/webhooks');
  const oldArr=(old.j&&(old.j.data||old.j))||[];
  if(Array.isArray(oldArr)) for(const w of oldArr){
    if((w.url||'').includes('dev.avesa.lt')){
      const del=scall('DELETE','/account/webhooks/'+w.id);
      L('  deleted '+w.topic+' HTTP '+del.code);
    }
  }
  L('');
  // 2. register webhook.site URL for subscribers/new
  L('--- Registruoju webhook.site ---');
  const reg=scall('POST','/account/webhooks',{url:WH, topic:'subscribers/new'});
  L('  subscribers/new -> webhook.site HTTP '+reg.code+(reg.code==='200'||reg.code==='201'?' ✅':' '+reg.raw.slice(0,120)));
  const reg2=scall('POST','/account/webhooks',{url:WH, topic:'subscribers/unsubscribed'});
  L('  subscribers/unsubscribed -> webhook.site HTTP '+reg2.code+(reg2.code==='200'||reg2.code==='201'?' ✅':''));
  L('');
  // 3. trigger: add new subscriber
  L('--- Trigger: naujas subscriber ---');
  const te='whsite+'+Date.now()+'@example.com';
  const add=scall('POST','/subscribers',{email:te, firstname:'WHSite', groups:['bDxp2q']});
  L('  pridetas '+te+' HTTP '+add.code);
  L('');
  L('  laukiu 20s Sender pristatymui...');
  execSync('sleep 20');
  L('');
  // 4. check delivery stats
  L('--- Sender delivery stats ---');
  const list=scall('GET','/account/webhooks');
  const arr=(list.j&&(list.j.data||list.j))||[];
  if(Array.isArray(arr)) for(const w of arr){
    if((w.url||'').includes('webhook.site')){
      L('  '+w.topic+': deliveries='+w.total_deliveries+' failures='+w.total_failures+' resp_time='+w.response_time+'ms status='+w.status);
    }
  }
  L('');
  L('  >>> Raimi, patikrink webhook.site puslapį — ar atėjo Sender payload <<<');
  putText('_test4site.txt', out);
  console.log('done');
})();
