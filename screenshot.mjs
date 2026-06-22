import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const content=(typeof obj==='string')?obj:JSON.stringify(obj,null,1);
  const b64=Buffer.from(content,'utf8').toString('base64');
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/put.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim();
}
function wc(p){ try{ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }catch(e){ return null; } }
const out={};
out.cat=wc('products/categories/82?_fields=id,name,slug,count');
let prods=[];
for(let p=1;p<=2;p++){ const r=wc('products?category=82&per_page=100&page='+p+'&status=any&_fields=id,name'); if(Array.isArray(r)){ prods=prods.concat(r.map(x=>({id:x.id,name:x.name}))); if(r.length<100)break; } else break; }
out.n=prods.length; out.products=prods;
out.put=putResult('higiena_recon.txt', out);
