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
  L('=== Workflow kurimas su title ===');
  // Bandom minimaliai su title
  const variants = [
    {title:'PS E2E order_paid test'},
    {title:'PS E2E order_paid test', trigger_type:'event'},
    {title:'PS E2E order_paid test', type:'event', event:'order_paid'},
  ];
  for(let i=0;i<variants.length;i++){
    const r = scall('POST','/workflows', variants[i]);
    L('variant '+(i+1)+' '+JSON.stringify(variants[i]).slice(0,70)+' -> HTTP '+r.code);
    L('  '+r.raw.slice(0,250));
    if(r.code==='200'||r.code==='201'){
      // pavyko — issaugom ID kad galetume istrinti
      try { const id=JSON.parse(r.raw).data.id; L('  CREATED id='+id);
        // Istrinam iškart (tik norejom patikrinti ar galim)
        const d=scall('DELETE','/workflows/'+id);
        L('  cleanup delete -> HTTP '+d.code);
      } catch(e){}
      break;
    }
  }
  putText('sender_wf_create2.txt', out);
  console.log('done');
})();
