import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wc(id){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/${id}" -o /tmp/w.json`,{encoding:'utf8',env,maxBuffer:50000000});return JSON.parse(fs.readFileSync('/tmp/w.json','utf8'));}catch(e){execSync('sleep 2');}}return null;}
const IDS=[26912,26913,26914,26915,26916,26917,26918,18010];
const SRCKEYS=["_vf_qty","_zb_cost","_zb_stock","_legacy_manufacturer","_legacy_source","_cost","_cost_price","_petshop_cost","_stock"];
const out=[];
for(const id of IDS){const p=wc(id);if(p===null){out.push({id,ERR:1});continue;}
  const meta={};for(const m of (p.meta_data||[])){if(SRCKEYS.includes(m.key))meta[m.key]=(""+m.value).slice(0,30);}
  out.push({id,name:(p.name||"").slice(0,42),status:p.status,vis:p.catalog_visibility,stock_status:p.stock_status,manage:p.manage_stock,qty:p.stock_quantity,price:p.price,reg:p.regular_price,sku:p.sku,meta});
}
commit("catC_stock_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
