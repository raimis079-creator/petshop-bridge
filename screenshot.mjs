import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(path){const cmd='curl -s -k --max-time 60 -u "'+U+':'+P+'" "'+BASE+path+'"';try{return execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
// list snippets to find filter ones
let list=api('/wp-json/code-snippets/v1/snippets');
let arr=[];try{arr=JSON.parse(list);}catch(e){}
let names=arr.map(s=>s.id+':'+s.name+':'+(s.active?'ON':'off')).join('\n');
putText('snippets_list.txt', names);
// dump 329 and 332
let s329=api('/wp-json/code-snippets/v1/snippets/329');
let s332=api('/wp-json/code-snippets/v1/snippets/332');
putText('snip_329.json', s329);
putText('snip_332.json', s332);
console.log('done', arr.length, 'snippets');
