import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dg',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 45 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={};
// 1. VISU atributu dabartine has_archives busena - ka realiai pakeiciau?
const attrs=get('/wp-json/wc/v3/products/attributes?_fields=id,name,slug,has_archives,type,order_by&per_page=40');
let al=[]; try{ al=JSON.parse(attrs); }catch(e){ out.attrs_err=attrs.slice(0,200); }
out.attributes=al.map(a=>({id:a.id,slug:a.slug,has_archives:a.has_archives}));
// 2. Ar atributu TERMINAI dar egzistuoja? (numusti = terminai dingtu)
// speciali_mityba(8), be_grudu(7), monoprotein(9) - kiek terminu?
for(const[id,slug] of [[8,'speciali_mityba'],[7,'be_grudu'],[9,'monoprotein']]){
  const t=get('/wp-json/wc/v3/products/attributes/'+id+'/terms?per_page=50&_fields=id,name,count');
  let tl=[]; try{ tl=JSON.parse(t); }catch(e){}
  out['terms_'+slug]={count:tl.length, sample:tl.slice(0,4).map(x=>x.name+'('+x.count+')')};
}
// 3. Ar produktai dar turi atributu priskyrimus? Imam viena maisto preke ir tikrinam
const prod=get('/wp-json/wc/v3/products?category=maistas-sunims&per_page=1&_fields=id,name,attributes');
let pl=[]; try{ pl=JSON.parse(prod); }catch(e){}
if(pl.length){ out.sample_product={id:pl[0].id, name:pl[0].name, attr_count:(pl[0].attributes||[]).length, attrs:(pl[0].attributes||[]).map(a=>a.name)}; }
// 4. Ar YITH filtras/kategorijos puslapiai veikia? sausas maistas + konservai
out.urls={};
for(const[k,u] of [['maistas_sunims','/kategorija/sunims/maistas-sunims/'],['konservai_sunims','/kategorija/sunims/konservai-sunims/'],['sunims','/kategorija/sunims/'],['sampunai','/kategorija/sunims/sampunai-sunims/']]){
  out.urls[k]={url:u,http:code(u)};
}
putFile('diag.json',JSON.stringify(out));
