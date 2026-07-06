import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const SINGLE="https://dev.avesa.lt/product/miamor-konservai-katems-su-tunu-ir-krevetemis-100-g-x-24-vnt/";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC'; } }
function between(s, startStr, len){ var i=s.indexOf(startStr); if(i<0) return ''; var b=s.lastIndexOf('<div', i); return s.slice(b<0?i:b, (b<0?i:b)+len).replace(/\s+/g,' '); }
(async()=>{
  var out={};
  // GRID kortele
  var grid=exec('curl -sk -m 30 "'+BASE+'/daugiau-pigiau/"');
  // istraukiam viena product-small kortele - nuo class="product-small iki kito product
  var gi=grid.indexOf('box-text box-text-products');
  if(gi>=0){ var s=grid.lastIndexOf('<div class="box-text', gi); out.card_boxtext = grid.slice(s, s+900).replace(/\s+/g,' '); }
  out.grid_has_add_to_cart = grid.includes('add_to_cart_button');
  out.grid_has_price = grid.includes('class="price');

  // SINGLE puslapis
  var sp=exec('curl -sk -m 30 "'+SINGLE+'"');
  out.single_has_single_atc = sp.includes('single_add_to_cart_button');
  out.single_has_qty = sp.includes('quantity');
  out.single_has_form_cart = sp.includes('cart');
  // istraukiam form.cart bloka
  var fi=sp.indexOf('<form');
  while(fi>=0){ var chunk=sp.slice(fi, fi+120); if(chunk.includes('cart')){ out.form_cart = sp.slice(fi, fi+700).replace(/\s+/g,' '); break; } fi=sp.indexOf('<form', fi+1); }
  // kainos elementas summary
  var pi=sp.indexOf('product_title');
  if(pi>=0){ out.summary_price = between(sp.slice(pi, pi+1500), 'price', 300); }
  commit('recon_cards.json', JSON.stringify(out));
  console.log('done');
})();
