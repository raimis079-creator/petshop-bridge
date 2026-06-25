import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/20445?context=edit&_fields=content" -o /tmp/r.json`,{env,maxBuffer:50000000});
const T=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
// locate legacy table: the <table ...> whose content has "Neaktyvus / pagyven" (before MARK)
const np=T.indexOf("Neaktyvus / pagyven");
// find <table start before np
const tStart=T.lastIndexOf("<table", np);
const tEnd=T.indexOf("</table>", np); const tEndFull=tEnd>=0?tEnd+8:-1;
const out={ legacy_table_start_idx:tStart, legacy_table_end_idx:tEndFull,
  before_120: T.slice(Math.max(0,tStart-160), tStart),
  legacy_table_html: T.slice(tStart, tEndFull),
  after_120: T.slice(tEndFull, tEndFull+200),
  markIdx:T.lastIndexOf(MARK) };
commit("dbg2_20445_"+Date.now()+".json", JSON.stringify(out,null,2));
console.log("DONE");
