import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function getSnip(){execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512" -o /tmp/s.json`,{env,maxBuffer:50000000});return JSON.parse(fs.readFileSync('/tmp/s.json','utf8'));}
const o=getSnip();let code=o.code||'';const orig=code;
const R=[
 ["font-size:15px;line-height:1.6;}","font-size:15px;line-height:1.45;}"],
 ["ps-desc-body p{margin:0 0 8px}","ps-desc-body p{margin:0 0 5px}"],
 ["table{border-collapse:collapse;width:auto;margin:8px 0}","table{border-collapse:collapse;width:auto !important;max-width:100%;margin:8px 0}"]
];
const report={name:o.name,active:o.active,scope:o.scope,len_before:code.length,matches:{}};
let ok=true;
for(const [a,b] of R){const n=code.split(a).length-1;report.matches[a.slice(0,30)]=n;if(n!==1){ok=false;continue;}code=code.split(a).join(b);}
report.len_after=code.length;
if(!ok){report.RESULT="ABORT_match";commit("snip512_upd_"+Date.now()+".json",JSON.stringify(report,null,1));console.log("ABORT");process.exit(0);}
// PUT full object back
o.code=code;
fs.writeFileSync('/tmp/body.json',JSON.stringify(o));
const put=execSync(`curl -sk --max-time 45 -o /tmp/put_resp.json -w "%{http_code}" -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();
report.put_code=put;
let presp='';try{presp=fs.readFileSync('/tmp/put_resp.json','utf8').slice(0,200);}catch(e){}
report.put_resp=presp;
// verify read-back
execSync('sleep 2');
const v=getSnip();const vc=v.code||'';
report.ver_lh145=vc.indexOf("line-height:1.45;}")>-1;
report.ver_p5=vc.indexOf("p{margin:0 0 5px}")>-1;
report.ver_important=vc.indexOf("width:auto !important")>-1;
report.ver_old_gone=vc.indexOf("line-height:1.6;}")<0 && vc.indexOf("p{margin:0 0 8px}")<0;
report.ver_active=v.active;
report.ver_len=vc.length;
report.RESULT=(put==="200"&&report.ver_lh145&&report.ver_p5&&report.ver_important&&report.ver_old_gone)?"OK":"CHECK";
commit("snip512_upd_"+Date.now()+".json",JSON.stringify(report,null,1));
console.log("DONE "+report.RESULT);
