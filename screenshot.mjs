import { execSync } from "child_process";
import fs from "fs";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function api(url){
  const code=execSync('curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}
function page(url){
  const code=execSync('curl -sk -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

// ---------- 1. Kokios brand taksonomijos egzistuoja ----------
L('=== 1. Produktu taksonomijos ===');
const tax = api('https://dev.avesa.lt/wp-json/wp/v2/taxonomies');
if(tax.code==='200'){
  try{
    const j=JSON.parse(tax.body);
    for(const [slug,t] of Object.entries(j)){
      if((t.types||[]).includes('product')){
        L('  '+slug.padEnd(28)+' "'+t.name+'"  rest='+(t.rest_base||'-'));
      }
    }
  }catch(e){ L('  parse err'); }
} else L('  HTTP '+tax.code);
L('');

// ---------- 2. view_item push pilnas turinys ----------
L('=== 2. view_item push (pilnas) ===');
const prod = page('https://dev.avesa.lt/product/ruda-avies-koja-1-vnt-x-20-vnt/');
const blocks = prod.html.match(/<script data-petshop-gtm="1">[\s\S]*?<\/script>/g) || [];
L('  data-petshop-gtm bloku: '+blocks.length);
for(const b of blocks){
  const push = b.match(/window\.dataLayer\.push\((\{[\s\S]*?\})\);\s*<\/script>/) || b.match(/window\.dataLayer\.push\((\{"event[\s\S]*?\})\);/);
  const gtmItem = b.match(/window\.petshopGtmItem = (\{[\s\S]*?\});/);
  if(push){ L('  --- dataLayer.push ---'); L('    '+push[1].slice(0,600)); }
  if(gtmItem){ L('  --- petshopGtmItem ---'); L('    '+gtmItem[1].slice(0,400)); }
}
L('');

// ---------- 3. Kelios prekes: ar brand yra ----------
L('=== 3. Brand patikra keliose prekese ===');
const ps = api('https://dev.avesa.lt/wp-json/wp/v2/product?per_page=5&status=publish&_fields=id,title,link');
if(ps.code==='200'){
  try{
    const arr=JSON.parse(ps.body);
    for(const p of arr){
      // meta per wc/v3
      const w = api('https://dev.avesa.lt/wp-json/wc/v3/products/'+p.id);
      let brandTerms='?', manuf='?';
      if(w.code==='200'){
        const wj=JSON.parse(w.body);
        brandTerms = JSON.stringify((wj.brands||[]).map(b=>b.name));
        const mm=(wj.meta_data||[]).find(m=>m.key==='_legacy_manufacturer');
        manuf = mm ? mm.value : '(nera)';
      }
      L('  ['+p.id+'] '+p.title.rendered.slice(0,40));
      L('        brands='+brandTerms+'   _legacy_manufacturer='+manuf);
    }
  }catch(e){ L('  parse err: '+ps.body.slice(0,200)); }
} else L('  HTTP '+ps.code);
L('');

// ---------- 4. Parduotuves puslapio mygtukai ----------
L('=== 4. Parduotuves loop mygtukai ===');
const shop = page('https://dev.avesa.lt/parduotuve/');
const counts = {
  'data-gtm-item':                 (shop.html.match(/data-gtm-item/g)||[]).length,
  'add_to_cart_button':            (shop.html.match(/add_to_cart_button/g)||[]).length,
  'ajax_add_to_cart':              (shop.html.match(/ajax_add_to_cart/g)||[]).length,
  'product_type_simple':           (shop.html.match(/product_type_simple/g)||[]).length,
  'product_type_variable':         (shop.html.match(/product_type_variable/g)||[]).length,
  'button product_type':           (shop.html.match(/class="[^"]*product_type_/g)||[]).length,
  '"Skaityti daugiau" / read more': (shop.html.match(/product_type_external|read_more|Daugiau/gi)||[]).length,
  'li.product':                    (shop.html.match(/class="[^"]*\bproduct\b[^"]*"/g)||[]).length,
};
for(const [k,v] of Object.entries(counts)) L('  '+String(v).padStart(4)+'  '+k);
L('');
const samples = shop.html.match(/<a[^>]*add_to_cart_button[^>]*>/g) || [];
L('  Pirmi 3 add_to_cart mygtukai:');
samples.slice(0,3).forEach(s=>L('    '+s.replace(/\s+/g,' ').slice(0,240)));
L('');

// ---------- 5. Kategorijos puslapis (ne shop) ----------
L('=== 5. Kategorijos puslapis ===');
const cats = api('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=3&orderby=count&order=desc');
if(cats.code==='200'){
  try{
    const arr=JSON.parse(cats.body);
    for(const c of arr.slice(0,2)){
      const r = page('https://dev.avesa.lt/product-category/'+c.slug+'/');
      const n = (r.html.match(/data-gtm-item/g)||[]).length;
      const b = (r.html.match(/add_to_cart_button/g)||[]).length;
      L('  '+c.name.padEnd(24)+' (count '+c.count+')  HTTP '+r.code+'  data-gtm-item='+n+'  add_to_cart_button='+b);
    }
  }catch(e){ L('  parse err'); }
}
putFile('e6_check.txt', out); console.log(out);
