import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cv',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 40 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:45000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={};
// atributu ID (rasti pa_monoprotein, pa_be_grudu, pa_speciali_mityba)
const attrs=get('/wp-json/wc/v3/products/attributes?_fields=id,name,slug&per_page=30');
let attrList=[]; try{ attrList=JSON.parse(attrs); }catch(e){}
out.attrs=attrList.map(a=>({id:a.id,slug:a.slug,name:a.name}));
// speciali mityba terminai - randam teisinga attr id
const smAttr=attrList.find(a=>a.slug==='pa_speciali_mityba');
if(smAttr){
  const t=get('/wp-json/wc/v3/products/attributes/'+smAttr.id+'/terms?per_page=30&_fields=name,slug,count');
  try{ out.speciali_terms=JSON.parse(t).map(x=>({name:x.name,slug:x.slug,count:x.count})); }catch(e){}
}
// URL kandidatai (stabilus)
out.urls={};
const cands={
  'hipo_cat':'/hipoalerginis-maistas-sunims/',
  'jautrus':'/jautrus-virskinimas/',
  'monoprotein_filter':'/kategorija/sunims/?pa_monoprotein=taip',
  'begrudu_filter':'/kategorija/sunims/?filter_be-grudu=be-grudu',
  'sprendimai':'/sprendimai/'
};
for(const[k,u]of Object.entries(cands)) out.urls[k]={url:u,http:code(u)};
putFile('chipverify.json',JSON.stringify(out));
