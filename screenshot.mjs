import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}

const SNIPPET_V3 = `<?php
// Petshop MnM Rinkinio Vitrina v3 (visi Konservų rinkiniai)
add_action('wp_loaded', function () {
    if ( ! function_exists('is_product') ) return;
    add_action('wp_head', function () {
        if ( ! is_product() ) return;
        global $post;
        if ( ! $post ) return;
        $product = wc_get_product($post->ID);
        if ( ! $product || $product->get_type() !== 'mix-and-match' ) return;
        if ( ! has_term('konservu-rinkiniai', 'product_cat', $post->ID) ) return;
        $pid = (int) $post->ID;
        ?>
<style id="petshop-mnm-vitrine">
.single-product.postid-<?php echo $pid; ?> .mnm_child_products,
.single-product.postid-<?php echo $pid; ?> form.cart > table,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_form_content { border: none !important; margin: 0 0 1.5rem !important; }
.single-product.postid-<?php echo $pid; ?> .mnm_child_products thead,
.single-product.postid-<?php echo $pid; ?> form.cart thead,
.single-product.postid-<?php echo $pid; ?> .mnm_child_products th { display: none !important; }
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody,
.single-product.postid-<?php echo $pid; ?> form.cart tbody {
    display: grid !important; grid-template-columns: repeat(3, 1fr) !important;
    gap: 14px !important; border: none !important; background: transparent !important;
}
@media (max-width: 900px) { .single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody, .single-product.postid-<?php echo $pid; ?> form.cart tbody { grid-template-columns: repeat(2, 1fr) !important; } }
@media (max-width: 480px) { .single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody, .single-product.postid-<?php echo $pid; ?> form.cart tbody { grid-template-columns: 1fr !important; } }
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody tr,
.single-product.postid-<?php echo $pid; ?> form.cart tbody tr {
    display: flex !important; flex-direction: column !important;
    background: #fff !important; border: 1px solid #ececec !important;
    border-radius: 10px !important; padding: 12px !important; margin: 0 !important; position: relative !important;
}
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td {
    display: block !important; border: none !important; padding: 0 !important;
    width: 100% !important; text-align: center !important; background: transparent !important;
}
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td.product-thumbnail,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td:first-child { margin-bottom: 10px !important; }
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td img,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td img {
    width: 100% !important; max-width: 180px !important; aspect-ratio: 1/1 !important;
    object-fit: contain !important; background: #fafafa !important;
    border-radius: 8px !important; margin: 0 auto !important; display: block !important;
}
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td.product-name,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td:nth-child(2) {
    font-size: 13px !important; line-height: 1.4 !important; color: #2c2c2c !important;
    font-weight: 500 !important; text-align: center !important;
}
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td.product-name a,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td:nth-child(2) a { color: #2c2c2c !important; text-decoration: none !important; }
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody tr::after {
    content: "× 1"; position: absolute; top: 10px; right: 10px;
    background: #b29051; color: #fff; font-size: 11px; font-weight: 600;
    padding: 3px 9px; border-radius: 12px; line-height: 1;
}
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td.product-quantity,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td:last-child,
.single-product.postid-<?php echo $pid; ?> .mnm_child_products .quantity,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products input.qty,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products .plus,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products .minus { display: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important; overflow: hidden !important; }
.single-product.postid-<?php echo $pid; ?> .mnm_price_container,
.single-product.postid-<?php echo $pid; ?> .mnm_message,
.single-product.postid-<?php echo $pid; ?> .mnm_status,
.single-product.postid-<?php echo $pid; ?> .mnm_container_status,
.single-product.postid-<?php echo $pid; ?> .mnm_container_message,
.single-product.postid-<?php echo $pid; ?> .mnm_reset_container,
.single-product.postid-<?php echo $pid; ?> .mnm_reset_link,
.single-product.postid-<?php echo $pid; ?> .reset_variations,
.single-product.postid-<?php echo $pid; ?> a.reset,
.single-product.postid-<?php echo $pid; ?> form.cart > a[href*="reset"],
.single-product.postid-<?php echo $pid; ?> form.cart .button.reset,
.single-product.postid-<?php echo $pid; ?> form.cart > p:not(.price):not(.cart):not(.stock) { display: none !important; }
.single-product.postid-<?php echo $pid; ?> form.cart > .quantity { display: inline-flex !important; margin-right: 10px !important; }
.single-product.postid-<?php echo $pid; ?> p.price, .single-product.postid-<?php echo $pid; ?> .price { font-size: 28px !important; font-weight: 500 !important; color: #2c2c2c !important; margin-bottom: 1rem !important; }
.single-product.postid-<?php echo $pid; ?> .single_add_to_cart_button {
    background: #b29051 !important; color: #fff !important; font-size: 16px !important;
    font-weight: 500 !important; padding: 14px 28px !important; border-radius: 6px !important;
    border: none !important; text-transform: none !important; letter-spacing: 0 !important;
    opacity: 1 !important; cursor: pointer !important;
}
.single-product.postid-<?php echo $pid; ?> .single_add_to_cart_button:hover { background: #9a7c44 !important; }
.single-product.postid-<?php echo $pid; ?> .single_add_to_cart_button.disabled,
.single-product.postid-<?php echo $pid; ?> .single_add_to_cart_button:disabled {
    opacity: 1 !important; background: #b29051 !important; color: #fff !important;
    cursor: pointer !important; pointer-events: auto !important;
}
</style>
<script id="petshop-mnm-vitrine-js">
(function(){
    function fill(){
        var inputs = document.querySelectorAll('.mnm_child_products input.qty, form.cart .mnm_child_products input[type="number"]');
        if(!inputs.length) return false;
        inputs.forEach(function(inp){
            inp.value = '1';
            try{ inp.dispatchEvent(new Event('input', {bubbles:true})); }catch(e){}
            try{ inp.dispatchEvent(new Event('change', {bubbles:true})); }catch(e){}
            try{ if(window.jQuery) jQuery(inp).trigger('change').trigger('input'); }catch(e){}
        });
        var btn = document.querySelector('.single_add_to_cart_button');
        if(btn){ btn.disabled = false; btn.classList.remove('disabled'); btn.removeAttribute('disabled'); }
        var clr = document.querySelectorAll('.mnm_reset_container, .mnm_reset_link, a.reset, .reset_variations, form.cart a[href*="reset"]');
        clr.forEach(function(el){ el.style.display='none'; });
        return true;
    }
    var tries = 0;
    var iv = setInterval(function(){ tries++; var ok = fill(); if(ok || tries > 25){ clearInterval(iv); } }, 200);
    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){ setTimeout(fill, 100); setTimeout(fill, 800); setTimeout(fill, 2000); });
    } else { setTimeout(fill, 100); setTimeout(fill, 800); setTimeout(fill, 2000); }
    window.addEventListener('load', function(){ setTimeout(fill, 300); setTimeout(fill, 1500); });
    document.addEventListener('change', function(e){
        if(e.target && e.target.matches('.mnm_child_products input.qty')){
            if(e.target.value !== '1' && e.target.value !== 1){
                e.target.value = '1';
                try{ if(window.jQuery) jQuery(e.target).trigger('change'); }catch(err){}
            }
        }
    });
})();
</script>
<?php
    }, 99);
}, 5);
`;

(async()=>{
  const out={ts:new Date().toISOString()};

  // === 1. atnaujinu snippet'ą v3 ===
  const u = api('PUT','/wp-json/code-snippets/v1/snippets/524', {
    name:'Petshop MnM Rinkinio Vitrina v3 (visi Konservų rinkiniai)',
    code: SNIPPET_V3,
    desc:'CSS+JS visiems mix-and-match produktams kategorijoje Konservų rinkiniai',
    scope: 'global', active: true
  });
  out.snippet = u && u.id ? 'updated 524, active='+u.active : (u.__raw||u.code||'?');

  // === 2. surenku 6 komponentų nuotraukas ===
  const COMP = [17421, 19586, 19574, 17179, 19530, 17156];
  const imgUrls = [];
  for(const cid of COMP){
    const p = api('GET','/wp-json/wc/v3/products/'+cid);
    const img = p && p.images && p.images[0] && p.images[0].src;
    imgUrls.push({id:cid, url:img||null});
  }
  out.component_images = imgUrls;

  // === 3. parsisiunčiu visus 6 ir komponuoju 3x2 tinklelį per sharp ===
  let composedPath = null;
  try{
    // install sharp if not available
    try{ require('sharp'); }catch(e){ execSync('npm install sharp@0.33 --no-save --silent 2>&1', {encoding:'utf8'}); }
    const sharp = (await import('sharp')).default;
    const tmpDir = '/tmp/rinkimg';
    try{ fs.mkdirSync(tmpDir, {recursive:true}); }catch(e){}
    const downloaded = [];
    for(let i=0;i<imgUrls.length;i++){
      const u = imgUrls[i].url; if(!u) continue;
      const file = tmpDir+'/c'+i+'.jpg';
      execSync('curl -sk "'+u+'" -o "'+file+'"', {encoding:'utf8'});
      if(fs.existsSync(file) && fs.statSync(file).size > 1000){ downloaded.push(file); }
    }
    out.downloaded = downloaded.length;

    if(downloaded.length === 6){
      // resize each to 400x400 contain white bg
      const tiles = [];
      for(let i=0;i<6;i++){
        const tile = tmpDir+'/t'+i+'.png';
        await sharp(downloaded[i])
          .resize(400, 400, {fit:'contain', background:{r:255,g:255,b:255,alpha:1}})
          .toFile(tile);
        tiles.push(tile);
      }
      // composite 3x2 grid on 1280x880 (with 40px gap and 40px padding)
      const W=1280, H=880, gap=40, pad=40;
      composedPath = tmpDir+'/rinkinys_composition.jpg';
      await sharp({create:{width:W, height:H, channels:3, background:{r:248,g:248,b:248}}})
        .composite([
          {input:tiles[0], left:pad, top:pad},
          {input:tiles[1], left:pad+400+gap, top:pad},
          {input:tiles[2], left:pad+(400+gap)*2, top:pad},
          {input:tiles[3], left:pad, top:pad+400+gap},
          {input:tiles[4], left:pad+400+gap, top:pad+400+gap},
          {input:tiles[5], left:pad+(400+gap)*2, top:pad+400+gap}
        ])
        .jpeg({quality:88})
        .toFile(composedPath);
      out.composed = fs.existsSync(composedPath) ? fs.statSync(composedPath).size : 0;
      // save backup copy to bridge for debug
      putBin('rinkinys_compo_preview.jpg', fs.readFileSync(composedPath));
    } else {
      out.compose_skip = 'nuotraukų rasta tik '+downloaded.length+'/6';
    }
  }catch(e){
    out.compose_err = String(e).slice(0,300);
  }

  // === 4. įkeliu kaip WP media ir priskiriu kaip pagrindinę produktui 34153 ===
  if(composedPath && fs.existsSync(composedPath)){
    const filename = 'rinkinys-isrankiems-6x400g-kompozicija.jpg';
    // upload via WP media REST
    const upCmd = 'curl -sk -X POST -H "Authorization: '+AUTH+'" '
      +'-H "Content-Disposition: attachment; filename=\\"'+filename+'\\"" '
      +'-H "Content-Type: image/jpeg" '
      +'--data-binary @"'+composedPath+'" '
      +'"'+BASE+'/wp-json/wp/v2/media"';
    const upRaw = exec(upCmd);
    let media; try{ media = JSON.parse(upRaw); }catch(e){ media={__raw:upRaw.slice(0,300)}; }
    out.media_id = media && media.id;
    out.media_url = media && media.source_url;
    out.media_err = media && (media.code||media.__raw||null);

    if(media && media.id){
      // assign as product featured image
      const setImg = api('PUT','/wp-json/wc/v3/products/34153', {
        images: [ {id: media.id} ]
      });
      out.assigned = setImg && setImg.images && setImg.images[0] && setImg.images[0].id;
    }
  }

  commit('rinkinys_compo.json', JSON.stringify(out,null,1));
  console.log("DONE composed="+(out.composed||0)+" media="+(out.media_id||0));
})();
