import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
const out={};
for(const id of [12707,12708,12687,12685]){
  try{
    const j=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=id,content,title"`,{env,encoding:'utf8',maxBuffer:200000000}));
    const raw=(j.content&&j.content.raw)||"";
    // Pirmi 1500 simbolio + paskutiniai 500
    out[id]={title:(j.title&&j.title.rendered)||'',len:raw.length,head:raw.slice(0,1500),tail:raw.slice(-500),hasSerimo:/Šėrimo|Šerimo|šerimo|šeriam/.test(raw),hasInstr:/instrukcij/i.test(raw)};
  }catch(e){out[id]={err:String(e).slice(0,150)};}
}
commit("monge_fail_check.json",JSON.stringify(out,null,1));
console.log("DONE");
