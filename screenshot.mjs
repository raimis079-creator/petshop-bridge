import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function put(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function front(id){for(let i=0;i<3;i++){try{execSync(`curl -skL --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/h.html`,{encoding:'utf8',env,maxBuffer:90000000});return fs.readFileSync('/tmp/h.html','utf8');}catch(e){execSync('sleep 2');}}return null;}
const out={};
const H=front(18014);
out.live_lh145 = H?H.indexOf("line-height:1.45")>-1:null;
out.live_important = H?H.indexOf("width:auto !important")>-1:null;
out.live_old_16 = H?H.indexOf("line-height:1.6;}")>-1:null;
// save full snippet code
execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512" -o /tmp/s.json`,{env,maxBuffer:50000000});
const o=JSON.parse(fs.readFileSync('/tmp/s.json','utf8'));
put("snip512_final_"+Date.now()+".txt", Buffer.from(o.code||'','utf8'));
fs.writeFileSync('/tmp/o.json',JSON.stringify(out));
put("snip512_live_"+Date.now()+".json", Buffer.from(JSON.stringify(out),'utf8'));
console.log("DONE");
