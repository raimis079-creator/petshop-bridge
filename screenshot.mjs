import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function get(path){try{execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json${path}" -o /tmp/g.json -w "%{http_code}" > /tmp/code.txt`,{encoding:'utf8',env,maxBuffer:50000000});const code=fs.readFileSync('/tmp/code.txt','utf8').trim();let body='';try{body=fs.readFileSync('/tmp/g.json','utf8');}catch(e){}return {code,body};}catch(e){return {code:'ERR',body:String(e).slice(0,100)};}}
const out={};
// 1. discover namespaces
const root=get("/");
out.has_codesnippets = root.body.indexOf("code-snippets")>-1;
out.root_code=root.code;
// 2. try read snippet 512
const s1=get("/code-snippets/v1/snippets/512");
out.snip512={code:s1.code, sample:s1.body.slice(0,300)};
// 3. try list snippets
const s2=get("/code-snippets/v1/snippets?limit=2");
out.list={code:s2.code, sample:s2.body.slice(0,200)};
commit("cs_probe_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
