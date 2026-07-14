import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" "'+SAPI+path+'"';
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('=== PS_ fields galutine verifikacija (su paginacija) ===');
  L('');
  let allPS = {};
  let page = 1;
  while(page <= 15){
    const r = scall('GET','/fields?page='+page+'&limit=50');
    if(r.code!=='200'){ L('page '+page+' HTTP '+r.code); break; }
    let arr = [];
    let meta = {};
    try { const j = JSON.parse(r.raw); arr = j.data || []; meta = j.meta || {}; } catch(e){ break; }
    if(arr.length===0) break;
    let psThisPage = 0;
    for(const f of arr){
      const t = f.title||'';
      if(t.startsWith('PS_')){
        if(allPS[t]){ L('  DUBLIKATAS: '+t+' (id='+f.id+', jau turejo '+allPS[t]+')'); }
        else { allPS[t] = f.id; psThisPage++; }
      }
    }
    L('page '+page+': '+arr.length+' fields, PS_ nauju: '+psThisPage);
    if(arr.length < 50) break;
    page++;
  }
  L('');
  L('=== VISO unikaliu PS_ fields: '+Object.keys(allPS).length+' ===');
  const sorted = Object.keys(allPS).sort();
  for(const k of sorted){ L('  '+k+' = '+allPS[k]); }
  putText('psfields_verify.txt', out);
  console.log('total PS_: '+Object.keys(allPS).length);
})();
