import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" "'+SAPI+path+'"';
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  return {code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?', raw:r.replace(/\nHTTP:\S+$/,'')};
}
(async()=>{
  L('=== Sender automation/workflow API recon ===');
  // Bandom kelis endpoint'us — ar galim skaityti/kurti workflows
  const endpoints = [
    'GET /workflows',
    'GET /automations',
    'GET /campaigns',
    'GET /account/workflows',
  ];
  for(const ep of endpoints){
    const [m,p] = ep.split(' ');
    const r = scall(m, p);
    L(ep+' -> HTTP '+r.code+' | '+r.raw.slice(0,150));
  }
  L('');
  // Groups (PS_TEST grupe)
  L('--- Groups (PS_TEST) ---');
  const g = scall('GET','/groups');
  try {
    const d = JSON.parse(g.raw).data || [];
    for(const grp of d){ L('  '+grp.id+' : '+grp.title+' (subscribers: '+(grp.subscribers_count??grp.active_subscribers??'?')+')'); }
  } catch(e){ L('  '+g.raw.slice(0,300)); }
  putText('sender_wf_recon.txt', out);
  console.log('done');
})();
