import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wc(path){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${path}" -o /tmp/w.json`,{encoding:'utf8',env,maxBuffer:80000000});return JSON.parse(fs.readFileSync('/tmp/w.json','utf8'));}catch(e){execSync('sleep 3');}}return null;}
const out={};
// find konservai categories
const cats=wc("products/categories?search=konserv&per_page=20&_fields=id,name,slug,count");
out.konserv_categories=cats;
// search Josera products
let all=[];
for(let p=1;p<=3;p++){const r=wc(`products?search=Josera&per_page=100&page=${p}&_fields=id,name,status,categories`);if(!r||!r.length)break;all=all.concat(r);if(r.length<100)break;}
// reduce: name + category names
out.josera_count=all.length;
out.products=all.map(x=>({id:x.id,name:x.name,st:x.status,cats:(x.categories||[]).map(c=>c.name).join(",")}));
commit("konserv_recon_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE", all.length);
