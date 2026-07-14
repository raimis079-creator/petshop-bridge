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
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('=== PS_ fields recon + kurimo endpoint paieska ===');
  L('');
  // 1. Esami fields — per esama subscriber columns (nes /account/fields 404)
  L('--- 1. Esami PS_ fields (per terra@gyvunai.lt columns) ---');
  const sub = scall('GET','/subscribers/terra@gyvunai.lt');
  let existing = {};
  if(sub.code==='200'){
    try {
      const d = JSON.parse(sub.raw).data;
      for(const col of (d.columns||[])){
        if((col.title||'').startsWith('PS_')){
          existing[col.title] = {id: col.id, type: col.type};
          L('  '+col.title+' (id='+col.id+', type='+col.type+')');
        }
      }
    } catch(e){ L('  parse err'); }
  } else { L('  HTTP '+sub.code); }
  L('  VISO esami PS_: '+Object.keys(existing).length);
  L('');

  // 2. Field kurimo endpoint paieska
  L('--- 2. Field kurimo endpoint bandymai ---');
  const endpoints = [
    ['POST','/fields', {title:'PS_TEST_PROBE', type:'text'}],
    ['POST','/account/fields', {title:'PS_TEST_PROBE', type:'text'}],
    ['POST','/subscribers/fields', {title:'PS_TEST_PROBE', type:'text'}],
    ['POST','/custom-fields', {title:'PS_TEST_PROBE', type:'text'}],
  ];
  for(const [m,p,b] of endpoints){
    const r = scall(m, p, b);
    L('  '+m+' '+p+' -> HTTP '+r.code+' — '+r.raw.slice(0,100));
  }
  L('');
  L('=== esami JSON ===');
  L(JSON.stringify(existing));
  putText('_psfields_recon.txt', out);
  console.log('done');
})();
