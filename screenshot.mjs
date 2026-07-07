import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:25000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:5000000,timeout:30000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
// 1. /sunu-veisles/ - ar egzistuoja (page ar kategorija)
out.sunu_veisles_code=code('/sunu-veisles/');
out.sunu_veisles_page=wp('/wp-json/wp/v2/pages?slug=sunu-veisles&status=any&_fields=slug,status,link');
out.sunu_veisles_cat=wp('/wp-json/wp/v2/product_cat?slug=sunu-veisles&_fields=slug,link,count');
// 2. prieziuros-priemones-sunims kategorija
out.dogcare_code=code('/kategorija/sunims/prieziuros-priemones-sunims/');
out.dogcare_cat=wp('/wp-json/wp/v2/product_cat?slug=prieziuros-priemones-sunims&_fields=slug,link,count');
putFile('landingcheck.json',JSON.stringify(out));
