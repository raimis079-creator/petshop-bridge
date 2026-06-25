import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/20445?context=edit&_fields=content" -o /tmp/r.json`,{env,maxBuffer:50000000});
const T=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const out={len:T.length, markCount:T.split(MARK).length-1, neaktyvusCount:T.split("Neaktyvus").length-1, tableCount:T.split("<table>").length-1};
// show context around each Neaktyvus
const ctx=[]; let p=0; while((p=T.indexOf("Neaktyvus",p))>=0){ctx.push(T.slice(Math.max(0,p-120),p+60));p+=9;}
out.neaktyvus_ctx=ctx;
out.tail=T.slice(-700);
commit("dbg20445_"+Date.now()+".json", JSON.stringify(out,null,2));
console.log("DONE");
