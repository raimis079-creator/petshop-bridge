import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const IDS="34484,18131,34510,34471,34486,34484,34471,34488,34500";
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'packattr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:50000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const r=wp('/wp-json/wc/v3/products?include='+IDS+'&per_page=20&_fields=id,slug,name,attributes,meta_data');
let a; try{ a=JSON.parse(r); }catch(e){ putFile('packattr.json',JSON.stringify({err:String(r).slice(0,300)})); a=[]; }
const out=[];
for(const p of (Array.isArray(a)?a:[])){
  const attrs=(p.attributes||[]).map(x=>({n:x.name,o:x.options}));
  // kiekis pakuoteje meta arba atributas
  const kiekMeta=(p.meta_data||[]).filter(m=>/kiek|pakuot|vnt|qty|multipack/i.test(m.key||'')).map(m=>({k:m.key,v:m.value}));
  const pak=attrs.find(x=>/pakuot|dydis|kiek/i.test(x.n||''));
  out.push({id:p.id,slug:p.slug,name:(p.name||'').slice(0,90),pak:pak?pak.o:[],kiekMeta,allattr:attrs.map(x=>x.n)});
}
putFile('packattr.json',JSON.stringify(out));
