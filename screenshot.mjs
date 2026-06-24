import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function curlJson(url){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${url}" -o /tmp/q.json`,{encoding:'utf8',env,maxBuffer:50000000});return JSON.parse(fs.readFileSync('/tmp/q.json','utf8'));}catch(e){execSync('sleep 2');}}return null;}
const out={direct:[],search:[]};
// direct check of filled IDs (any status)
for(const id of [25439,25261]){
  const p=curlJson(`https://dev.avesa.lt/wp-json/wc/v3/products/${id}?_fields=id,name,sku,status,catalog_visibility,stock_status,stock_quantity,manage_stock,date_modified,price`);
  if(p) out.direct.push(p); else out.direct.push({id,ERR:"read"});
}
// search YoungStar (all statuses) via wc/v3
for(const q of ["YoungStar","Young Star"]){
  for(const st of ["any"]){
    const arr=curlJson(`https://dev.avesa.lt/wp-json/wc/v3/products?search=${encodeURIComponent(q)}&status=${st}&per_page=30&_fields=id,name,sku,status,catalog_visibility,stock_status,stock_quantity,date_modified`);
    if(Array.isArray(arr)) arr.forEach(p=>out.search.push({q,...p}));
  }
}
// dedupe search by id
const seen={};out.search=out.search.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
commit("ys_recon_"+Date.now()+".json", JSON.stringify(out,null,2));
console.log("DONE");
