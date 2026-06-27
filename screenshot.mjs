import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
// Pull all 155 Farmina ids + weights
let acc=[],page=1;
while(page<=3){
  const p=cj(`${BASE}/wp/v2/product?product_brand=301&per_page=100&page=${page}&_fields=id,title`);
  if(!Array.isArray(p)||!p.length)break;
  acc=acc.concat(p.map(x=>({id:x.id,title:(x.title&&x.title.rendered)||''})));
  if(p.length<100)break;page++;
}
fs.writeFileSync('/tmp/ids.txt',acc.map(x=>x.id).join("\n"));
execSync('rm -rf /tmp/w && mkdir -p /tmp/w',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wc/v3/products/{}?_fields=id,weight,dimensions" -o /tmp/w/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const zeros=[],nonzero=[];
for(const x of acc){
  let w={};try{w=JSON.parse(fs.readFileSync('/tmp/w/'+x.id+'.json','utf8'));}catch(e){}
  const wt=parseFloat(w.weight||'0');
  if(!wt) zeros.push({id:x.id,title:x.title,weight:w.weight});
  else nonzero.push({id:x.id,weight:w.weight});
}
commit("farmina_weight_check.json",JSON.stringify({total:acc.length,zerosCount:zeros.length,nonzeroCount:nonzero.length,zeros},null,1));
console.log("CHECK DONE zeros:",zeros.length);
