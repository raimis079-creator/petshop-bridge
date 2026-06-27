import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function front(id){for(let i=0;i<3;i++){try{execSync(`curl -skL --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/h.html`,{encoding:'utf8',env,maxBuffer:80000000});return fs.readFileSync('/tmp/h.html','utf8');}catch(e){execSync('sleep 2');}}return null;}
const CHK=[[18088,"130 g"],[18022,"135"+'\u2013'+"175 g"],[20440,"\u0160\u0117rimo instrukcija"],[18014,"\u0160\u0117rimo instrukcija"]];
const out=[];
for(const [id,val] of CHK){const H=front(id);if(H===null){out.push({id,ERR:1});continue;}
  out.push({id,panel:H.indexOf("\u0160\u0117rimo instrukcija")>-1,b2b:H.indexOf("b2b-black")>-1,val:H.indexOf(val)>-1,rekom_left:H.indexOf("\u0160\u0117rimo rekomendacij")>-1});}
commit("dogfin_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
