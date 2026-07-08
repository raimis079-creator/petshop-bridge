import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'d2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',timeout:22000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'TIMEOUT'; } }
function jget(path){ try{ return JSON.parse(execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:10000000,timeout:27000,env:{...process.env,WPU,WPP}})); }catch(e){ return null; } }
const out={};
// 1. atributu has_archives - trumpas fields
const attrs=jget('/wp-json/wc/v3/products/attributes?_fields=id,slug,has_archives&per_page=40');
out.attrs = attrs ? attrs.map(a=>a.slug+':'+(a.has_archives?'ON':'off')) : 'FAIL';
putFile('diag2.json',JSON.stringify(out)); // ankstyvas irasas
// 2. terminai
const t8=jget('/wp-json/wc/v3/products/attributes/8/terms?per_page=5&_fields=name,count');
out.sm_terms = t8 ? t8.map(x=>x.name+'('+x.count+')') : 'FAIL';
const t7=jget('/wp-json/wc/v3/products/attributes/7/terms?per_page=5&_fields=name,count');
out.bg_terms = t7 ? t7.map(x=>x.name+'('+x.count+')') : 'FAIL';
putFile('diag2.json',JSON.stringify(out));
// 3. kategoriju URL statusai (greiti HEAD)
out.urls={};
out.urls.sunims=code('/kategorija/sunims/');
out.urls.maistas=code('/kategorija/sunims/maistas-sunims/');
out.urls.konservai=code('/kategorija/sunims/konservai-sunims/');
out.urls.sampunai=code('/kategorija/sunims/sampunai-sunims/');
out.urls.home=code('/');
putFile('diag2.json',JSON.stringify(out));
// 4. produkto atributai
const p=jget('/wp-json/wc/v3/products?per_page=1&_fields=id,name,attributes');
if(p&&p[0]){ out.product={name:p[0].name.slice(0,35), attrs:(p[0].attributes||[]).map(a=>a.name)}; }
putFile('diag2.json',JSON.stringify(out));
