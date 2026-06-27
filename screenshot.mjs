import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putResult(name, buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512" -o /tmp/s.json`,{env,maxBuffer:50000000});
const o=JSON.parse(fs.readFileSync('/tmp/s.json','utf8'));
const code=o.code||'';
putResult("snip512_code_"+Date.now()+".txt", Buffer.from(code,'utf8'));
console.log("DONE len="+code.length+" name="+o.name+" active="+o.active+" scope="+o.scope);
