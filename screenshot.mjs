import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  // request kur PHP klaidos rodomos (display_errors) — mums reikia tikros klaidos zinutes
  const r = sh('curl -s -k --max-time 30 "'+BASE+'/?nocache='+Date.now()+'" 2>&1');
  // Ieskom fatal error
  const fatalMatch = r.match(/Fatal error[\s\S]{0,500}/i);
  const parseMatch = r.match(/Parse error[\s\S]{0,500}/i);
  let out = '';
  if(fatalMatch){ out = 'FATAL:\n'+fatalMatch[0]; }
  else if(parseMatch){ out = 'PARSE:\n'+parseMatch[0]; }
  else { out = 'no error in response body, first 1000:\n'+r.slice(0,1000); }
  putText('_esp_error.txt', out);
})();
