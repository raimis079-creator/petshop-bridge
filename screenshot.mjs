import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
(async()=>{
  L('=== Webhook objektų pilnos detalės ===');
  const list=scall('GET','/account/webhooks');
  if(list.j){
    const arr=(list.j.data||list.j||[]);
    if(Array.isArray(arr)){
      for(const w of arr){
        L('');
        L('Topic: '+w.topic);
        L('  pilnas objektas: '+JSON.stringify(w));
      }
    } else {
      L('non-array: '+JSON.stringify(list.j).slice(0,500));
    }
  }
  L('');
  // check for active/status field, try to activate if paused
  L('=== Bandau aktyvuoti (jei yra active toggle) ===');
  const list2=scall('GET','/account/webhooks');
  const arr=(list2.j.data||list2.j||[]);
  if(Array.isArray(arr)){
    for(const w of arr){
      // maybe need PATCH to set active
      const patch=scall('PATCH','/account/webhooks/'+w.id,{active:true, status:'active'});
      L('  PATCH webhook '+w.topic+' active=true HTTP '+patch.code+' '+patch.raw.slice(0,120));
    }
  }
  putText('_test4d.txt', out);
  console.log('done');
})();
