import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'brandpull',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:80000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
// visi product_brand terms su count + slug + name + link
let all=[]; let p=1;
while(p<=4){ const r=wp('/wp-json/wp/v2/product_brand?per_page=100&page='+p+'&_fields=slug,name,count,link'); let a; try{a=JSON.parse(r);}catch(e){break;} if(!Array.isArray(a)||!a.length)break; all=all.concat(a); if(a.length<100)break; p++; }
out.total=all.length;
let csv='slug,name,count,link\n';
all.forEach(t=>csv+='"'+t.slug+'","'+(t.name||'').replace(/"/g,'')+'",'+t.count+',"'+(t.link||'').replace(DEV,'')+'"\n');
putFile('product_brand_terms.csv',csv);
out.sample=all.slice(0,5).map(t=>t.slug+':'+t.count);
putFile('brandpull_meta.json',JSON.stringify(out));
