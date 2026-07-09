import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ut',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
function probe(u){
  try{
    return execSync('curl -sk -o /dev/null -w "%{http_code}|%{url_effective}" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim();
  }catch(e){ return 'TO|'; }
}
let out='';

// 1. Test URL kandidatai
out += '=== URL kandidatai ===\n';
const cands = [
  '/mano-paskyra','/mano-paskyra/','/my-account','/my-account/','/paskyra','/paskyra/',
  '/uzsakymai','/uzsakymai/','/mano-paskyra/uzsakymai/','/orders','/orders/'
];
for(const u of cands){
  out += '  '+probe(u)+'  '+u+'\n';
}
out += '\n';

// 2. WooCommerce settings - koks yra My Account slug tikrasis
const wc = api('/wp-json/wc/v3/settings/advanced');
try{
  const arr = JSON.parse(wc);
  const myacc = arr.find(x=>x.id==='woocommerce_myaccount_page_id');
  if(myacc){
    out += 'WC My Account page_id: '+myacc.value+'\n';
    const p = api('/wp-json/wp/v2/pages/'+myacc.value+'?_fields=id,slug,title,link,status');
    try{ const j = JSON.parse(p); out += '  slug: '+j.slug+' status: '+j.status+' link: '+j.link+'\n'; }catch(e){}
  }
}catch(e){ out += 'WC settings ERR\n'; }
out += '\n';

// 3. Ieškau pages, kur slug turi 'paskyra' arba 'account' arba 'uzsak'
const pgs = api('/wp-json/wp/v2/pages?search=paskyra&per_page=10&_fields=id,slug,title,status,link');
try{
  const arr = JSON.parse(pgs);
  out += '=== "paskyra" pages ===\n';
  arr.forEach(p=>out += '  id='+p.id+' slug='+p.slug+' status='+p.status+' link='+p.link+'\n');
}catch(e){}
const pgs2 = api('/wp-json/wp/v2/pages?search=uzsak&per_page=10&_fields=id,slug,title,status,link');
try{
  const arr = JSON.parse(pgs2);
  out += '\n=== "uzsak" pages ===\n';
  arr.forEach(p=>out += '  id='+p.id+' slug='+p.slug+' status='+p.status+' link='+p.link+'\n');
}catch(e){}
const pgs3 = api('/wp-json/wp/v2/pages?search=order&per_page=10&_fields=id,slug,title,status,link');
try{
  const arr = JSON.parse(pgs3);
  out += '\n=== "order" pages ===\n';
  arr.forEach(p=>out += '  id='+p.id+' slug='+p.slug+' status='+p.status+' link='+p.link+'\n');
}catch(e){}

// 4. WooCommerce endpoint'ai - specialiai orders
out += '\n=== WC My Account endpoint\'ai (setting) ===\n';
try{
  const arr = JSON.parse(wc);
  const eps = arr.filter(x=>x.id && x.id.includes('endpoint'));
  eps.forEach(e=>out += '  '+e.id+': '+e.value+'\n');
}catch(e){}

putFile('urltest.txt', out);
