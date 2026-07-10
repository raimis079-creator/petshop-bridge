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
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

// ---- 1. Ar yra prekiu su product_brand? ----
L('=== 1. product_brand terminai ===');
const bt = api('https://dev.avesa.lt/wp-json/wp/v2/product_brand?per_page=8&orderby=count&order=desc&_fields=id,name,count');
if(bt.code==='200'){
  try{
    const arr=JSON.parse(bt.body);
    L('  Top brand terminai:');
    arr.forEach(b=>L('    ['+b.id+'] '+String(b.name).padEnd(22)+' prekiu: '+b.count));
    const top = arr.find(b=>b.count>0);
    if(top){
      L('');
      L('  Imam preke is "'+top.name+'":');
      const pr = api('https://dev.avesa.lt/wp-json/wp/v2/product?product_brand='+top.id+'&per_page=1&status=publish&_fields=id,link,title');
      if(pr.code==='200'){
        const parr=JSON.parse(pr.body);
        if(parr.length){
          const p=parr[0];
          L('    ['+p.id+'] '+p.title.rendered.slice(0,45));
          L('    '+p.link);
          const h = page(p.link);
          L('    puslapis HTTP '+h.code);
          const m = h.html.match(/window\.dataLayer\.push\((\{"event":"view_item"[\s\S]*?\})\);/);
          if(m){
            L('    view_item push:');
            L('      '+m[1].slice(0,500));
            L('');
            L('    item_brand yra: '+(/"item_brand"/.test(m[1])?'✅ TAIP':'❌ NE'));
          } else L('    ❌ view_item push nerastas');
        }
      }
    } else L('  ⚠️ VISI brand terminai turi 0 prekiu');
  }catch(e){ L('  parse err: '+bt.body.slice(0,200)); }
} else L('  HTTP '+bt.code+'  '+bt.body.slice(0,150));
L('');

// ---- 2. Kiek prekiu is viso turi brand ----
L('=== 2. Prekiu su brand kiekis ===');
const cntAll = execSync('curl -sk -I -u "'+AUTH+'" "https://dev.avesa.lt/wp-json/wp/v2/product?per_page=1&status=publish" 2>/dev/null | grep -i "x-wp-total:" || echo "x-wp-total: ?"',{encoding:'utf8'}).trim();
L('  '+cntAll);
L('');

// ---- 3. Loop mygtuko markup ----
L('=== 3. Loop mygtuko markup (parduotuve) ===');
const shop = page('https://dev.avesa.lt/parduotuve/');
L('  HTTP '+shop.code+'  '+shop.html.length+' B');
const patterns = {
  '<a ... add_to_cart_button':  /<a[^>]{0,400}add_to_cart_button[^>]{0,400}>/g,
  '<button ... add_to_cart':    /<button[^>]{0,400}add_to_cart[^>]{0,400}>/g,
  'data-gtm-item bet kur':      /data-gtm-item=/g,
  'data-product_id':            /data-product_id=/g,
  'product_type_simple':        /product_type_simple/g,
  'quick-view / lightbox':      /quick-view|lightbox/g,
};
for(const [k,re] of Object.entries(patterns)){
  const m = shop.html.match(re);
  L('  '+String(m?m.length:0).padStart(3)+'  '+k);
}
L('');
L('  Pirmas mygtukas su data-product_id:');
const btn = shop.html.match(/<[^>]{0,60}data-product_id[^>]{0,400}>/);
if(btn) L('    '+btn[0].replace(/\s+/g,' ').slice(0,350));
else L('    (nerasta)');
L('');
L('  Vieta su data-gtm-item:');
const g = shop.html.match(/<[^>]{0,80}data-gtm-item[^>]{0,500}>/);
if(g) L('    '+g[0].replace(/\s+/g,' ').slice(0,400));
else L('    (nerasta)');
L('');

// ---- 4. Kategorijos URL struktura ----
L('=== 4. Kategoriju permalink ===');
const cc = api('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=3&orderby=count&order=desc');
if(cc.code==='200'){
  try{
    const arr=JSON.parse(cc.body);
    for(const c of arr){
      for(const base of ['product-category','preke-kategorija','prekiu-kategorija','kategorija']){
        const u='https://dev.avesa.lt/'+base+'/'+c.slug+'/';
        const r=page(u);
        if(r.code==='200'){
          const n=(r.html.match(/data-gtm-item/g)||[]).length;
          const li=(r.html.match(/class="[^"]*product[^"]*"/g)||[]).length;
          L('  ✅ '+u);
          L('       data-gtm-item='+n+'  (li.product-ish='+li+')');
          break;
        }
      }
    }
  }catch(e){ L('  parse err'); }
}
putFile('e6_check2.txt', out); console.log(out);
