import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wcRaw(path){try{return execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${path}"`,{encoding:'utf8',env,maxBuffer:80000000});}catch(e){return '{"ERR":1}';}}
function readRaw(id){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){return null;}}
const out={};
// Josera dog wet (cat 73) and cat wet (79)
for(const [k,cat] of [["dog_wet",73],["cat_wet",79]]){
  let all=[];
  for(let p=1;p<=2;p++){ let r; try{ r=JSON.parse(wcRaw(`products?search=Josera&category=${cat}&per_page=100&page=${p}&_fields=id,name,status`)); }catch(e){ break; } if(!Array.isArray(r)||!r.length)break; all=all.concat(r.map(x=>({id:x.id,name:x.name,st:x.status}))); if(r.length<100)break; }
  out[k]=all;
}
// sample description state for first dog-wet product (if any)
const samp=(out.dog_wet&&out.dog_wet[0])?out.dog_wet[0].id:null;
if(samp){ const T=readRaw(samp); out.sample={id:samp, len:T?T.length:null, hasMark:T?T.indexOf("\u0160\u0117rimo")>-1:null, hasSud:T?/Sud\u0117tis/.test(T):null, hasAnal:T?T.indexOf("Analitin")>-1:null, head:T?T.slice(0,600):null}; }
commit("krecon3_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
