import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const j=cj(`${BASE}/wp/v2/product/14535?context=edit&_fields=content`);
const raw=(j.content&&j.content.raw)||"";
const cnt=(raw.match(/b2b-black/g)||[]).length;
const cntTbl=(raw.match(/<table/g)||[]).length;
// pirma "b2b-black" pozicija ir paskutine
const first=raw.indexOf('<style>.b2b-black');
const second=raw.indexOf('<style>.b2b-black', first+1);
const out={
  totalLen:raw.length,
  b2bCount:cnt,
  tableCount:cntTbl,
  firstB2bAt:first,
  secondB2bAt:second,
  // imam window apie pirmaji b2b
  contextAround1: raw.slice(Math.max(0,first-100), first+800),
  contextAround2: second>0 ? raw.slice(Math.max(0,second-100), second+800) : 'N/A',
  // ar tarp ju yra Serimo ar kitkas
  betweenB2b: first>=0 && second>0 ? raw.slice(first, second).slice(-300) : 'N/A'
};
commit("farmina_inspect_14535.json",JSON.stringify(out,null,1));
console.log("INSPECT DONE");
