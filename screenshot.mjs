import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wcList(page){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Eukanuba&per_page=100&page=${page}&_fields=id,sku,status" -o /tmp/w.json`,{encoding:'utf8',env,maxBuffer:80000000});return JSON.parse(fs.readFileSync('/tmp/w.json','utf8'));}catch(e){execSync('sleep 2');}}return null;}
let all=[];for(let p=1;p<=2;p++){const r=wcList(p);if(!r||!r.length)break;all=all.concat(r);if(r.length<100)break;}
execSync('rm -rf /tmp/p && mkdir -p /tmp/p',{env});
fs.writeFileSync('/tmp/ids.txt', all.map(d=>d.id).join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/{}?_fields=id,date_modified,date_created,meta_data" -o /tmp/p/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const IMPORT_KEYS=/import|wpallimport|_zb|zaliojibanga|_last_/i;
const res=all.map(d=>{let o={};try{o=JSON.parse(fs.readFileSync('/tmp/p/'+d.id+'.json','utf8'));}catch(e){return {id:d.id,FAIL:1};}
  const meta=o.meta_data||[];
  const impMeta={};
  for(const m of meta){if(IMPORT_KEYS.test(m.key)){let v=m.value;if(typeof v!=='string')v=JSON.stringify(v);impMeta[m.key]=String(v).slice(0,40);}}
  return {id:d.id,sku:d.sku,status:d.status,mod:(o.date_modified||'').slice(0,16),created:(o.date_created||'').slice(0,10),imp:impMeta};});
// cluster modified dates
const byDay={};res.forEach(x=>{if(x.mod){const day=x.mod.slice(0,10);byDay[day]=(byDay[day]||0)+1;}});
commit("euk_meta_"+Date.now()+".json", JSON.stringify({byDay,products:res},null,1));
console.log("DONE");
