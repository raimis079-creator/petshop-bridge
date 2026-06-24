import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
const ids=[26399,25237,25387,25383,26925,26411,26368,26441,26383,26375,26414,21043,21041,26457,26387,26453,26431,26371,26296,21045,26884,26418,26365,25403,25399,25411,25407,26901,25391,26438,26435,27130,25475,25471,24644,21321];
fs.writeFileSync('/tmp/ids.txt', ids.join("\n"));
execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} sh -c 'curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/{}?_fields=id,name,sku,status,stock_status,stock_quantity" -o /tmp/p_{}.json 2>/dev/null'`,{encoding:'utf8',env,maxBuffer:90000000});
const rows=[];
for(const id of ids){try{const p=JSON.parse(fs.readFileSync('/tmp/p_'+id+'.json','utf8'));rows.push({id:p.id,sku:p.sku,status:p.status,stk:p.stock_status,q:p.stock_quantity,name:(p.name||'').replace(/Josera\s*/i,'').slice(0,60)});}catch(e){rows.push({id,ERR:1});}}
commit("bulk_recon_"+Date.now()+".json", JSON.stringify(rows,null,1));
console.log("DONE "+rows.length);
