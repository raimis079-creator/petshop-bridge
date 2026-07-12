import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'cl '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s --max-time 40 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{try{
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let snips=[];try{snips=JSON.parse(list.body);}catch(e){L('parse err');}
  // laikini probe patternai (sukurti šioje sesijoje)
  const tmpRe=/(Popular Deploy|Popular Redeploy|Popular Verify|Popular Post|Home Recon|Home Content|Filter Check|Insert Block|SM DryRun|VetDiet)/i;
  const toDelete=snips.filter(s=>tmpRe.test(s.name));
  L('Rasta laikinu snippetu trynimui: '+toDelete.length);
  const deleted=[]; const failed=[];
  for(const s of toDelete){
    const r=api('DELETE','/wp-json/code-snippets/v1/snippets/'+s.id);
    if(/20[0-9]/.test(r.code)) deleted.push(s.id+':'+s.name); else failed.push(s.id+':'+s.name+' ('+r.code+')');
    execSync('sleep 1');
  }
  L('ISTRINTA ('+deleted.length+'):'); deleted.forEach(d=>L('  - '+d));
  if(failed.length){L('NEPAVYKO:'); failed.forEach(f=>L('  ! '+f));}
  // likusiu snippetu sarasas
  const list2=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let snips2=[];try{snips2=JSON.parse(list2.body);}catch(e){}
  L('\n=== LIKUSIEJI SNIPPETAI ('+snips2.length+') ===');
  snips2.forEach(s=>L('  ['+(s.active?'ON ':'off')+'] #'+s.id+' '+s.name));
  putText('_run67_cleanup.txt', out);
}catch(e){L('!!! '+e); putText('_run67_cleanup.txt',out);}})();
