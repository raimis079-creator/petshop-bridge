import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'vf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s --max-time 40 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path){const auth='-u "'+U+':'+P+'"';let cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  // 1. svetaine
  const hp=sh('curl -s -k -o /dev/null -w "%{http_code}" --max-time 25 "'+BASE+'/"');
  L('HOMEPAGE HTTP: '+hp);
  // 2. snippetu sarasas (READ-ONLY)
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=400');
  L('list HTTP '+list.code+' len '+list.body.length);
  let snips=[];try{snips=JSON.parse(list.body);}catch(e){L('parse err: '+list.body.slice(0,200));}
  L('VISO snippetu: '+snips.length);
  const targets=[664,665,666,667,668,669,670,671,672,673,674,675,676];
  const left=snips.filter(s=>targets.includes(s.id)).map(s=>s.id);
  L('probe taikiniai dar liko: ['+left.join(',')+']');
  // operaciniai LIVE - ar nepaliesti
  const keyOps=[648,653,329,332,565,512,461,239];
  keyOps.forEach(id=>{const s=snips.find(x=>x.id===id);L('  op #'+id+': '+(s?(s.active?'ON ':'off')+' '+s.name.slice(0,40):'!!! DINGO'));});
  putText('_run70_verify.txt', out);
}catch(e){L('!!! '+e); putText('_run70_verify.txt',out);}})();
