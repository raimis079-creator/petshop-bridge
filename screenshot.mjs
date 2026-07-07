import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'brand',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:50000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:40000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putFile('brandrecon.json',JSON.stringify(out)); }

// pa_brendas atributo rewrite/archive info
step('attr_brendas',()=>{ const a=JSON.parse(wp('/wp-json/wc/v3/products/attributes/1')); return {slug:a.slug,name:a.name,has_archives:a.has_archives}; });
// keli brand terms
step('terms',()=>{ const a=JSON.parse(wp('/wp-json/wc/v3/products/attributes/1/terms?per_page=5&_fields=slug,name,count')); return a.map(t=>({slug:t.slug,name:t.name,count:t.count})); });
// bandom kandidatinius archyvo URL su realiu terminu (ambrosia)
step('archive_try',()=>{ const paths=['/brendas/ambrosia/','/pa_brendas/ambrosia/','/prekes-zenklas/ambrosia/','/prekiu-zenklai/ambrosia/','/brand/ambrosia/','/?pa_brendas=ambrosia']; const r={}; paths.forEach(p=>r[p]=code(p)); return r; });

putFile('brandrecon.json',JSON.stringify(out));
