import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sr',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }
let out='';

// 1. Dabartinis Shop puslapis
out += '=== Shop puslapis (ID 11) ===\n';
const p = api('/wp-json/wp/v2/pages/11?context=edit&_fields=id,slug,title,status,link,menu_order');
try{ 
  const j = JSON.parse(p);
  out += '  id=11 slug='+j.slug+' status='+j.status+' link='+j.link+'\n';
  out += '  title='+j.title.rendered+'\n';
}catch(e){ out += 'ERR\n'; }
out += '\n';

// 2. WC settings kur Shop naudojamas
out += '=== WC settings susije su Shop ===\n';
const wc = api('/wp-json/wc/v3/settings/products');
try{
  const arr = JSON.parse(wc);
  const relevant = ['woocommerce_shop_page_id','woocommerce_shop_page_display','woocommerce_category_archive_display'];
  arr.filter(x=>relevant.includes(x.id) || (x.id||'').includes('shop')).forEach(x=>out += '  '+x.id+': '+x.value+'\n');
}catch(e){}
out += '\n';

// 3. Meniu, kur būtų Shop nuoroda
out += '=== Meniu-items, kur URL /shop/ arba nuoroda i shop page ===\n';
const menus = api('/wp-json/wp/v2/menus');
try{
  const arr = JSON.parse(menus);
  for(const m of arr){
    const items = api('/wp-json/wp/v2/menu-items?menus='+m.id+'&per_page=100&_fields=id,title,url,object_id,object');
    try{
      const ii = JSON.parse(items);
      ii.forEach(mi=>{
        if((mi.url||'').includes('/shop') || mi.object_id === 11 || (mi.title.rendered||'').toLowerCase().includes('shop')){
          out += '  Menu ['+m.name+']: '+mi.title.rendered+' → '+(mi.url||'obj='+mi.object)+'\n';
        }
      });
    }catch(e){}
  }
}catch(e){ out += 'menus ERR\n'; }
out += '\n';

// 4. HTTP kodai
out += '=== HTTP kodai ===\n';
for(const u of ['/shop/', '/parduotuve/', '/shop', '/parduotuve']){
  out += '  '+code(u).padEnd(4)+u+'\n';
}
out += '\n';

// 5. Ieskau ar kur nors homepage HTML yra /shop/ nuoroda
out += '=== "/shop/" paieška homepage HTML ===\n';
try{
  const html = api('/');
  const hits = [...html.matchAll(/href="([^"]*\/shop\/?[^"]*)"/g)].slice(0,10);
  hits.forEach(m=>out += '  homepage: '+m[1]+'\n');
  if(hits.length === 0) out += '  homepage: 0 shop nuorodų\n';
}catch(e){}

// 6. Puslapiai su content'e minimu Shop
out += '\n=== Pages su fullText "shop" arba "parduotuv" (top 5) ===\n';
for(const q of ['shop','parduotuv']){
  const r = api('/wp-json/wp/v2/pages?search='+q+'&per_page=5&_fields=id,slug,title');
  try{ 
    const arr = JSON.parse(r); 
    out += '  q="'+q+'":\n';
    arr.forEach(p=>out += '    id='+p.id+' slug='+p.slug+' title='+p.title.rendered+'\n');
  }catch(e){}
}

putFile('shoprecon.txt', out);
