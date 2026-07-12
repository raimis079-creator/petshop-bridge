import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'cl2 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s --max-time 40 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{try{
  const ids=[664,665,666,667,668,669,670,671,672,673,674,675,676];
  // pirma tikrinam kurie dar egzistuoja
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=400');
  let snips=[];try{snips=JSON.parse(list.body);}catch(e){}
  const existing=snips.filter(s=>ids.includes(s.id)).map(s=>s.id);
  L('dar egzistuoja: ['+existing.join(',')+']');
  // DELETE su force
  const still=[];
  for(const id of existing){
    let r=api('DELETE','/wp-json/code-snippets/v1/snippets/'+id+'?force=true');
    L('DELETE force #'+id+' -> '+r.code);
    execSync('sleep 1');
  }
  execSync('sleep 3');
  // verifikacija
  const list2=api('GET','/wp-json/code-snippets/v1/snippets?limit=400');
  let snips2=[];try{snips2=JSON.parse(list2.body);}catch(e){}
  const left=snips2.filter(s=>ids.includes(s.id)).map(s=>s.id);
  L('PO force trynimo dar liko: ['+left.join(',')+']');
  L('viso snippetu dabar: '+snips2.length);
  putText('_run68_cleanup.txt', out);
}catch(e){L('!!! '+e); putText('_run68_cleanup.txt',out);}})();
