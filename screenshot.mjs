import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fp',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }
let out='';

// 1. Kokia dabartinė front page konfigūracija
out += '=== Dabartiniai WP settings (Reading) ===\n';
const opts = api('/wp-json/wp/v2/settings');
try{
  const j = JSON.parse(opts);
  const relevant = ['show_on_front','page_on_front','page_for_posts','posts_per_page','default_category'];
  relevant.forEach(k=>{
    if(k in j) out += '  '+k+': '+JSON.stringify(j[k])+'\n';
  });
  // BACKUP visų settings
  fs.writeFileSync('/tmp/settings_backup.json', JSON.stringify(j, null, 2));
  out += '\n  (visų settings backup /tmp/settings_backup.json)\n';
}catch(e){ out += 'settings ERR: '+opts.slice(0,200)+'\n'; }

// 2. Koks šiuo metu puslapis rodomas /
out += '\n=== dev.avesa.lt/ (kas rodoma DABAR) ===\n';
const rootHtml = api('/');
// Ieškau <title>, <h1>, koks URL galutinis
try{
  const title = (rootHtml.match(/<title[^>]*>([^<]+)/)||[])[1] || '?';
  const h1 = (rootHtml.match(/<h1[^>]*>([^<]+)/)||[])[1] || '?';
  const bodyClass = (rootHtml.match(/<body[^>]+class="([^"]+)"/)||[])[1] || '';
  out += '  <title>: '+title.slice(0,80)+'\n';
  out += '  <h1>: '+h1.slice(0,80)+'\n';
  out += '  body class: '+bodyClass.slice(0,150)+'\n';
  // Ieškom page_id ar page slug'o URL'e po redirect'o
  const canonHint = (rootHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)||[])[1] || '';
  out += '  canonical URL: '+canonHint+'\n';
}catch(e){}

// 3. Homepage puslapio informacija (ID 34543)
out += '\n=== Homepage puslapis (ID 34543) ===\n';
const pg = api('/wp-json/wp/v2/pages/34543?_fields=id,slug,title,status,link');
try{ const j = JSON.parse(pg); out += '  slug: '+j.slug+' | status: '+j.status+' | link: '+j.link+'\n'; }catch(e){}

// 4. Kur veda /parduotuve/ URL ir dabartinis Shop
out += '\n=== Shop puslapis ir /parduotuve/ ===\n';
out += '  /parduotuve/ HTTP: '+code('/parduotuve/')+'\n';
out += '  /shop/ HTTP: '+code('/shop/')+'\n';
// WooCommerce Shop page
const wc = api('/wp-json/wc/v3/settings/products');
try{
  const arr = JSON.parse(wc);
  const shopId = arr.find(x=>x.id==='woocommerce_shop_page_id');
  if(shopId) out += '  WC Shop page_id: '+shopId.value+'\n';
}catch(e){}
const shopPg = api('/wp-json/wp/v2/pages/11');
try{ const j = JSON.parse(shopPg); out += '  ID 11: slug='+j.slug+' | status='+j.status+' | link='+j.link+'\n'; }catch(e){}

// 5. Ar yra kitų puslapių, kur "front" arba "home" slug
out += '\n=== Puslapiai su "front", "home", "pagrindin" ===\n';
for(const q of ['home','front','pagrindin']){
  const s = api('/wp-json/wp/v2/pages?search='+q+'&per_page=5&_fields=id,slug,title,status,link');
  try{ const arr = JSON.parse(s); arr.forEach(p=>out += '  '+q+': id='+p.id+' slug='+p.slug+' status='+p.status+'\n'); }catch(e){}
}

putFile('frontpage.txt', out);
