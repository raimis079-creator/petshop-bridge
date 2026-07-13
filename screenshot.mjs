import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function get(path){const cmd='curl -s -k --max-time 60 -u "'+U+':'+P+'" "'+BASE+path+'"';try{return execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
function post(path,bodyObj){fs.writeFileSync('/tmp/body.json',JSON.stringify(bodyObj));const cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" -u "'+U+':'+P+'" -X POST -H "Content-Type: application/json" --data-binary @/tmp/body.json "'+BASE+path+'"';try{const r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});return{code:(r.match(/HTTP:(\S+)$/)||[])[1],body:r.replace(/\nHTTP:\S+$/,'')};}catch(e){return{code:'ERR',body:(e.stdout||'')};}}
(async()=>{try{
  const r=get('/wp-json/wp/v2/pages/34261?context=edit');
  let raw='';try{raw=JSON.parse(r).content.raw;}catch(e){L('read parse err');putText('_txtfix.txt',out);return;}
  const before=(raw.match(/Ne būtinai/g)||[]).length;
  L('prieš: "Ne būtinai" count='+before+' raw_len='+raw.length);
  if(before!==1){L('NUTRAUKIU — tikėjausi 1, radau '+before);putText('_txtfix.txt',out);return;}
  const newRaw=raw.replace('Ne būtinai','Nebūtinai');
  const afterOld=(newRaw.match(/Ne būtinai/g)||[]).length;
  const afterNew=(newRaw.match(/Nebūtinai/g)||[]).length;
  L('po replace: "Ne būtinai"='+afterOld+' "Nebūtinai"='+afterNew+' new_len='+newRaw.length+' delta='+(raw.length-newRaw.length));
  // update
  const up=post('/wp-json/wp/v2/pages/34261',{content:newRaw});
  L('UPDATE http='+up.code);
  execSync('sleep 2');
  // verify via re-read
  const r2=get('/wp-json/wp/v2/pages/34261?context=edit');
  let raw2='';try{raw2=JSON.parse(r2).content.raw;}catch(e){}
  L('PO UPDATE (raw): "Ne būtinai"='+((raw2.match(/Ne būtinai/g)||[]).length)+' "Nebūtinai"='+((raw2.match(/Nebūtinai/g)||[]).length));
  // verify live HTML
  const html=execSync('curl -s -k --max-time 45 "'+BASE+'/?page_id=34261"',{encoding:'utf8',maxBuffer:30000000});
  L('LIVE HTML: "Ne būtinai"='+(html.indexOf('Ne būtinai')>-1)+' "Nebūtinai"='+(html.indexOf('Nebūtinai')>-1));
}catch(e){L('!!! '+e);}
finally{ putText('_txtfix.txt',out); }
})();
