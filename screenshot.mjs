import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cl',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={link_checks:{}};
// kandidatai kuriuos naudosim CTA
const candidates=[
  '/sunims/','/kategorija/sunims/','/sunims/maistas-sunims/','/kategorija/sunims/maistas-sunims/',
  '/katems/','/kategorija/katems/','/katems/maistas-katems/','/kategorija/katems/maistas-katems/',
  '/grauzikams/','/kategorija/grauzikams/',
  '/pasiulymai/','/akcijos/','/kategorija/akcijos/',
  '/suns-serimo-lentele-gramais/','/serimo-skaiciuokle/',
  '/kontaktai/','/apie-mus/'
];
for(const p of candidates){ out.link_checks[p]=code(p); }
// paziurim WooCommerce shop puslapius / kategorijas su high count
const cats=wp('/wp-json/wp/v2/product_cat?per_page=100&_fields=slug,link,count,parent&orderby=count&order=desc');
let arr; try{ arr=JSON.parse(cats); }catch(e){ arr=[]; }
out.top_cats=(Array.isArray(arr)?arr:[]).slice(0,20).map(c=>({slug:c.slug,link:(c.link||'').replace(DEV,''),count:c.count,parent:c.parent}));
putFile('checklinks.json',JSON.stringify(out));
console.log('done');
