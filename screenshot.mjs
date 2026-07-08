import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 45 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:30000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={};
// 1. ar egzistuoja "prieziuros" kategorija? WC product_cat
out.care_cats=get('/wp-json/wc/v3/products/categories?search=prieži&per_page=30&_fields=id,name,slug,count,parent').slice(0,4000);
// 2. tikslus URL statusas
out.target_http=code('/kategorija/sunims/prieziuros-priemones-sunims/');
// 3. ar yra "sunims" kategorija ir jos vaikai
out.sunims_cat=get('/wp-json/wc/v3/products/categories?slug=sunims&_fields=id,name,slug,count').slice(0,500);
putFile('carecats.json',JSON.stringify(out));
