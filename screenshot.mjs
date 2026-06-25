import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wcRaw(path){try{const r=execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${path}"`,{encoding:'utf8',env,maxBuffer:80000000});return r;}catch(e){return JSON.stringify({ERR:String(e).slice(0,80)});}}
const out={};
// 1) konservai categories
try{ out.cats=JSON.parse(wcRaw("products/categories?search=konserv&per_page=20")).map(c=>({id:c.id,name:c.name,slug:c.slug,count:c.count})); }catch(e){ out.cats="ERR:"+String(e).slice(0,80); }
// 2) Josera products minimal
let all=[];
for(let p=1;p<=3;p++){ let r; try{ r=JSON.parse(wcRaw(`products?search=Josera&per_page=100&page=${p}&_fields=id,name,status`)); }catch(e){ out.searchErr=String(e).slice(0,80); break; } if(!Array.isArray(r)||!r.length)break; all=all.concat(r.map(x=>({id:x.id,name:x.name,st:x.status}))); if(r.length<100)break; }
out.josera_count=all.length;
out.products=all;
commit("krecon2_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE n="+all.length);
