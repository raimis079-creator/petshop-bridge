import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'s421 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');const BASE='https://dev.avesa.lt';
function api(path){const cmd='curl -s -k -u "'+U+':'+P+'" "'+BASE+path+'"';try{return execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  for(const sid of [421,420,419]){
    const r=api('/wp-json/code-snippets/v1/snippets/'+sid);
    let code='';try{code=JSON.parse(r).code;}catch(e){code='PARSE ERR '+r.slice(0,100);}
    putText('snippet_'+sid+'.txt', code);
    L('=== #'+sid+' (len '+code.length+') ===');
    // istraukiam raktazodzius/mapping dalis
    const lines=code.split('\n').filter(l=>/hipoalergin|hypoallerg|steriliz|virškinim|gastrointest|intestinal|hairball|plaukų|svorio|weight|urinary|šlapim|=>|map|keyword|match|stripos|preg_match|Hipoalerginis|Sterilizuot/i.test(l));
    L(lines.slice(0,50).join('\n'));
  }
}catch(e){L('!!! '+e);}finally{putText('_run45_log.txt',out);}})();
