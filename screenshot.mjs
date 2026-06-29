import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};
const tests=[
  'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512',
  'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets',
  'https://dev.avesa.lt/wp-json/code-snippets/v2/snippets',
  'https://dev.avesa.lt/wp-json/wp/v2/code_snippet/512',
  'https://dev.avesa.lt/wp-json/wp/v2/snippet/512',
  'https://dev.avesa.lt/wp-json/'
];
const out={};
for(const u of tests){
  try{
    const r=execSync(`curl -sk --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    out[u]=r.substring(0,500);
  }catch(e){out[u]='ERR:'+e.message.slice(0,100);}
}
commit('snippet_test.json',JSON.stringify(out,null,1));
console.log("done");
