import { execSync } from "child_process";
import fs from "fs";
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
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}

// Atnaujinu snippet'ą #524 - pridedu konkretų button.mnm_reset selektorių
const SNIPPET_V5 = `<?php
// Petshop MnM Rinkinio Vitrina v5 (Konservų rinkiniai + slėpia Greitą peržiūrą + ATSTATYTI mygtuką)

// === A) Vitrinos CSS/JS pilname produkto puslapyje ===
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
/* === SLĖPIAM "ATSTATYTI" (Clear selections) mygtuką === */
.single-product.postid-<?php echo $pid; ?> button.mnm_reset,
.single-product.postid-<?php echo $pid; ?> .mnm_reset,
.single-product.postid-<?php echo $pid; ?> button[class*="mnm_reset"] {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Grid */
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
/* Slėpia komponentų kiekio kontrolę */
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td.product-quantity,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td:last-child,
.single-product.postid-<?php echo $pid; ?> .mnm_child_products .quantity,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products input.qty,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products .plus,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products .minus { display: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important; overflow: hidden !important; }
/* Slėpia status/message/reset linkus */
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
        // JS belt-and-suspenders: slėpti reset mygtuką
        var resetBtns = document.querySelectorAll('button.mnm_reset, .mnm_reset, button[class*="mnm_reset"]');
        resetBtns.forEach(function(el){ el.style.display='none'; });
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

// === B) Slėpia "Greitą peržiūrą" mygtuką ant Konservų rinkinių kortelių ===
add_action('wp_head', function () {
    if ( ! function_exists('is_woocommerce') ) return;
    ?>
<style id="petshop-mnm-hide-quickview">
.product-small.product_cat-konservu-rinkiniai .quick-view,
.product-small.product_cat-konservu-rinkiniai a.button.quick-view,
.product-small.product_cat-konservu-rinkiniai .image-tools .quick-view-button,
.product-small.product_cat-konservu-rinkiniai .quick-view-button,
.product.product_cat-konservu-rinkiniai .quick-view,
.product.product_cat-konservu-rinkiniai .quick-view-button,
li.product.product_cat-konservu-rinkiniai .quick-view,
li.product.product_cat-konservu-rinkiniai .quick-view-button {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
}
</style>
<?php
});
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  const u = api('PUT','/wp-json/code-snippets/v1/snippets/524', {
    name:'Petshop MnM Rinkinio Vitrina v5 (Konservų rinkiniai + slėpia Greitą peržiūrą + ATSTATYTI)',
    code: SNIPPET_V5,
    desc:'CSS+JS visiems mix-and-match Konservų rinkiniai + slepia Greitą peržiūrą + slepia ATSTATYTI mygtuką',
    scope: 'global', active: true
  });
  out.update = u && u.id ? ('updated id='+u.id+' active='+u.active+' code_len='+(u.code||'').length) : (u.__raw||u.code||'?');
  commit('v5_update.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
