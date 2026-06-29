import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};
const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512"`,{env:env2,encoding:'utf8',maxBuffer:200000000});
commit('snippet_512_full.json',r);
console.log("size:",r.length);
