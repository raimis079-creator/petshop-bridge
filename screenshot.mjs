import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function get(path){const cmd='curl -s -k --max-time 60 -u "'+U+':'+P+'" "'+BASE+path+'"';try{return execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const r=get('/wp-json/wp/v2/pages/34261');
  let link='',slug='',status='';try{const j=JSON.parse(r);link=j.link;slug=j.slug;status=j.status;}catch(e){}
  L('link='+link+' slug='+slug+' status='+status);
  // fetch the real page URL (follow redirects)
  const html=execSync('curl -s -k -L --max-time 45 "'+link+'"',{encoding:'utf8',maxBuffer:30000000});
  L('page HTML len='+html.length);
  L('"Nebūtinai"='+(html.indexOf('Nebūtinai')>-1)+' "Ne būtinai"='+(html.indexOf('Ne būtinai')>-1));
  L('"sterilizacijos energijos poreikis"(FAQ ats.)='+(html.indexOf('sterilizacijos energijos poreikis')>-1));
  // context around Nebutinai
  const i=html.indexOf('Nebūtinai');
  if(i>-1) L('kontekstas: ...'+html.slice(i-20,i+60)+'...');
}catch(e){L('!!! '+e);}
finally{ putText('_verify.txt',out); }
})();
