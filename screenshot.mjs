import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'cl '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{try{
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let snips=[];try{snips=JSON.parse(list.body);}catch(e){}
  // Deaktyvuojam Read Attach probe
  const ra=snips.find(s=>/Read Attach/i.test(s.name));
  if(ra){api('POST','/wp-json/code-snippets/v1/snippets/'+ra.id+'/deactivate',{});L('Read Attach #'+ra.id+' deaktyvuotas');}
  // Patvirtinam gyvu snippetu busena+scope
  const l2=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');let s2=[];try{s2=JSON.parse(l2.body);}catch(e){}
  for(const nm of ['Completed Attach Fix','Doc Type Fix','Read Attach']){
    const f=s2.find(s=>new RegExp(nm,'i').test(s.name));
    if(f)L(nm+': id='+f.id+' active='+f.active+' scope='+f.scope);
  }
}catch(e){L('!!! '+e);}finally{putText('_run38_log.txt',out);}})();
