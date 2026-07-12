import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'ap '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s --max-time 40 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  // APPLY
  const r=sh('curl -s -k --max-time 40 "'+BASE+'/?ps_insertblock=1&confirm=INSERT_HOME&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('=== APPLY ==='); L(r.slice(0,1200));
  // homepage sveikata + ar shortcode isrenderintas (ne literalus)
  const hp=sh('curl -s -k --max-time 30 "'+BASE+'/"');
  L('homepage len '+hp.length);
  L('ps-pop klase HTML: '+(hp.indexOf('ps-pop-card')>-1?'YRA (renderinta)':'NĖRA'));
  L('literalus shortcode tekstas: '+(hp.indexOf('[petshop_popular_products')>-1?'MATOSI (BLOGAI)':'ne (gerai)'));
  L('Pirkeju pamegtos h2: '+(hp.indexOf('Pirkėjų pamėgtos')>-1?'YRA':'ne'));
  // deakt insert snippet (jis nebereikalingas)
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let iid=0;try{iid=JSON.parse(list.body).find(s=>/Insert Block/i.test(s.name)).id;}catch(e){}
  if(iid){api('POST','/wp-json/code-snippets/v1/snippets/'+iid+'/deactivate',{});L('insert snippet deakt id='+iid);}
  putText('insert_apply.json', r.slice(0,2500));
}catch(e){L('!!! '+e);}finally{putText('_run64_log.txt',out);}})();
