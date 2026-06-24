import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
const out={};
for(const id of [27130,26901,25391,26435]){
  const T=readRaw(id)||"";
  // extract the serimo block
  const idx=T.lastIndexOf('<p><strong>\u0160\u0117rimo instrukcija:');
  let blk = idx>=0 ? T.slice(idx, idx+700) : "NO_SERIMO_BLOCK";
  // also note if any table + header type
  out[id]={
    has_serimo: idx>=0,
    has_table: /<table>/.test(T),
    hdr_amzius: /<th>Am\u017eius/.test(T),
    hdr_svoris: /<th>\u0160uns svoris/.test(T),
    sample: blk.replace(/\s+/g,' ').slice(0,500)
  };
}
commit("verkids_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
