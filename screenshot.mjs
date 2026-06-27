import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 3');}return null;}
function front(id){for(let i=0;i<3;i++){try{execSync(`curl -skL --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/h.html`,{encoding:'utf8',env,maxBuffer:90000000});return fs.readFileSync('/tmp/h.html','utf8');}catch(e){execSync('sleep 2');}}return null;}
const IDS=[18014,17995,21325,17992,21846];
const out=[];
for(const id of IDS){const T=readRaw(id);if(T===null){out.push({id,ERR:1});continue;}
  const cnt=(s,p)=>s.split(p).length-1;
  out.push({id,len:T.length,
    empty_p:cnt(T,"<p></p>")+cnt(T,"<p> </p>"),
    nbsp_p:cnt(T,"<p>&nbsp;</p>"),
    br:cnt(T,"<br"),
    dbl_nl:cnt(T,"\n\n"),
    crlf:cnt(T,"\r\n"),
    tbl_100:cnt(T,'width:100%'),
    tbl_450:cnt(T,'width:450px'),
    tbl_650:cnt(T,'width:650px'),
    p_margin_inline:cnt(T,'margin')});}
// rendered: find description container classes around a feeding table
const H=front(17992);
let ctx="NO";
if(H){const i=H.indexOf("\u0160\u0117rimo instrukcija");if(i>-1)ctx=H.slice(Math.max(0,i-300),i+60).replace(/\s+/g,' ');}
out.push({rendered_ctx:ctx});
commit("fmt_diag_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
