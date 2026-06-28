import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
// Patikrinkim esamus Code Snippets
try{
  const snip=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/code-snippets/v1/snippets?per_page=100&_fields=id,name,active"`,{env,encoding:'utf8',maxBuffer:200000000}));
  const out={count:snip.length,relevant:snip.filter(s=>/dimension|weight|svoris|išmatavim|attribute|display_product/i.test(s.name||'')),all:snip.map(s=>({id:s.id,name:s.name,active:s.active}))};
  commit("snip_check.json",JSON.stringify(out,null,1));
  console.log("DONE");
}catch(e){console.log("ERR",e);}
