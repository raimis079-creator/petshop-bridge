import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(path){const cmd='curl -s -k --max-time 60 -u "'+U+':'+P+'" "'+BASE+path+'"';try{return execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
const r=api('/wp-json/wp/v2/pages/34261?context=edit');
let raw='';try{raw=JSON.parse(r).content.raw;}catch(e){raw='PARSE_ERR '+r.slice(0,200);}
putText('page34261_raw.txt', raw);
// count + contexts
let idx=0,ctxs=[];const needle='Ne būtinai';
while((idx=raw.indexOf(needle,idx))>-1){ctxs.push(raw.slice(Math.max(0,idx-30),idx+50));idx+=needle.length;}
// also check lowercase "ne būtinai"
let idx2=0,ctxs2=[];const n2='ne būtinai';
while((idx2=raw.indexOf(n2,idx2))>-1){ctxs2.push(raw.slice(Math.max(0,idx2-30),idx2+50));idx2+=n2.length;}
putText('_txtctx.txt','len='+raw.length+'\n"Ne būtinai" count='+ctxs.length+'\n'+ctxs.map((c,i)=>i+': ...'+c+'...').join('\n')+'\n\n"ne būtinai"(lower) count='+ctxs2.length+'\n'+ctxs2.map((c,i)=>i+': ...'+c+'...').join('\n'));
console.log('done raw len',raw.length);
