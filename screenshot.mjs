import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'d '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{const R={};try{
  const auth='-u "'+U+':'+P+'"';
  const deact=sh('curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X POST "'+BASE+'/wp-json/code-snippets/v1/snippets/626/deactivate"');
  L('deactivate 626 -> '+(deact.match(/HTTP:(\d+)/)||[])[1]);
  const chk=sh('curl -s -k '+auth+' "'+BASE+'/wp-json/code-snippets/v1/snippets/626"');
  try{const s=JSON.parse(chk);R.active_after=s.active;L('  #626 active po deaktyvavimo: '+s.active+' ('+s.name+')');}catch(e){L('  chk parse: '+chk.slice(0,150));}
  L('DONE');
}catch(e){L('!!! '+e);}finally{putText('_run4_log.txt',out);}})();
