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
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}

const SNIPPET_V7 = `<?php
// Petshop MnM Rinkinio Vitrina v7 (Konservų + Skanėstų rinkiniai, stock-aware, dinaminis × N)

add_action('wp_loaded', function () {
    if ( ! function_exists('is_product') ) return;
    add_action('wp_head', function () {
        if ( ! is_product() ) return;
        global $post;
        if ( ! $post ) return;
        $product = wc_get_product($post->ID);
        if ( ! $product || $product->get_type() !== 'mix-and-match' ) return;
        // GATING: kelios kategorijos
        $allowed_cats = array('konservu-rinkiniai', 'skanestu-rinkiniai', 'kramtalu-rinkiniai');
        $matched = false;
        foreach ($allowed_cats as $slug) {
            if (has_term($slug, 'product_cat', $post->ID)) { $matched = true; break; }
        }
        if (!$matched) return;
        $pid = (int) $post->ID;

        // STOCK CHECK + kompoziciniai kiekiai
        $all_in_stock = true;
        $component_quantities = array(); // [product_id => required_qty]
        if (method_exists($product, 'get_child_items')) {
            $child_items = $product->get_child_items();
            if (!empty($child_items)) {
                foreach ($child_items as $child) {
                    $child_product = $child->get_product();
                    if (!$child_product) continue;
                    $child_id = $child_product->get_id();
                    $req_qty = method_exists($child, 'get_quantity_min') ? $child->get_quantity_min() : 1;
                    if (!$req_qty) $req_qty = 1;
                    $component_quantities[$child_id] = $req_qty;
                    if (!$child_product->is_in_stock()) {
                        $all_in_stock = false;
                    }
                    $stock_qty = $child_product->get_stock_quantity();
                    if ($stock_qty !== null && $stock_qty < $req_qty) {
                        $all_in_stock = false;
                    }
                }
            }
        }
        ?>
<style id="petshop-mnm-vitrine">
.single-product.postid-<?php echo $pid; ?> button.mnm_reset,
.single-product.postid-<?php echo $pid; ?> .mnm_reset {
    display: none !important; visibility: hidden !important;
}

/* Grid struktūra */
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

/* DINAMIŠKAS × N žymeklis - skaitomas iš data atributo */
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody tr[data-mnm_item_id]::after,
.single-product.postid-<?php echo $pid; ?> form.cart tbody tr.mnm_item::after {
    content: "× " attr(data-kiekis-rodyti);
    position: absolute; top: 10px; right: 10px;
    background: #b29051; color: #fff; font-size: 11px; font-weight: 600;
    padding: 3px 9px; border-radius: 12px; line-height: 1;
}
/* Fallback jei data-kiekis-rodyti dar neuzpildyta */
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody tr:not([data-kiekis-rodyti])::after,
.single-product.postid-<?php echo $pid; ?> form.cart tbody tr.mnm_item:not([data-kiekis-rodyti])::after {
    content: "× 1";
}

/* Slėpia kiekio kontrolę */
.single-product.postid-<?php echo $pid; ?> .mnm_child_products tbody td.product-quantity,
.single-product.postid-<?php echo $pid; ?> form.cart tbody td:last-child,
.single-product.postid-<?php echo $pid; ?> .mnm_child_products .quantity,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products input.qty,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products .plus,
.single-product.postid-<?php echo $pid; ?> form.cart .mnm_child_products .minus { display: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important; overflow: hidden !important; }
/* Slėpia status/message/reset */
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

<?php if ($all_in_stock): ?>
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
<?php else: ?>
.single-product.postid-<?php echo $pid; ?> .single_add_to_cart_button {
    background: #cccccc !important; color: #666 !important; font-size: 16px !important;
    font-weight: 500 !important; padding: 14px 28px !important; border-radius: 6px !important;
    border: none !important; text-transform: none !important; letter-spacing: 0 !important;
    opacity: 0.7 !important; cursor: not-allowed !important;
    pointer-events: none !important;
}
.single-product.postid-<?php echo $pid; ?> form.cart > .quantity { display: none !important; }
.single-product.postid-<?php echo $pid; ?> form.cart::before {
    content: "Šiuo metu nėra sandėlyje";
    display: block; background: #f8e8e8; color: #c00;
    border-left: 3px solid #c00; padding: 12px 16px;
    margin-bottom: 16px; border-radius: 4px; font-size: 14px;
}
<?php endif; ?>
</style>
<script id="petshop-mnm-vitrine-js">
(function(){
    var ALL_IN_STOCK = <?php echo $all_in_stock ? 'true' : 'false'; ?>;
    var COMP_QTY = <?php echo wp_json_encode($component_quantities); ?>;
    function fill(){
        var rows = document.querySelectorAll('.mnm_child_products tbody tr.mnm_item, form.cart tbody tr[data-mnm_item_id]');
        if(!rows.length) return false;
        rows.forEach(function(row){
            var pid = row.getAttribute('data-mnm_item_id') || row.getAttribute('data-child_id');
            if(!pid) return;
            var required = COMP_QTY[pid] || 1;
            // Užpildau data-kiekis-rodyti
            row.setAttribute('data-kiekis-rodyti', required);
            // Užpildau input
            var input = row.querySelector('input[type="number"], input.qty, input[name^="mnm_quantity"]');
            if(input){
                if(input.value != required){
                    input.value = required;
                    try{ input.dispatchEvent(new Event('input', {bubbles:true})); }catch(e){}
                    try{ input.dispatchEvent(new Event('change', {bubbles:true})); }catch(e){}
                    try{ if(window.jQuery) jQuery(input).trigger('change').trigger('input'); }catch(e){}
                }
            }
        });
        var btn = document.querySelector('.single_add_to_cart_button');
        if(btn){
            if(ALL_IN_STOCK){
                btn.disabled = false;
                btn.classList.remove('disabled');
                btn.removeAttribute('disabled');
            } else {
                btn.disabled = true;
                btn.classList.add('disabled');
                btn.setAttribute('disabled', 'disabled');
                if(btn.textContent && btn.textContent.trim() !== 'Nėra sandėlyje'){
                    btn.textContent = 'Nėra sandėlyje';
                }
            }
        }
        var resetBtns = document.querySelectorAll('button.mnm_reset, .mnm_reset');
        resetBtns.forEach(function(el){ el.style.display='none'; });
        return true;
    }
    var tries = 0;
    var iv = setInterval(function(){ tries++; var ok = fill(); if(ok || tries > 25){ clearInterval(iv); } }, 200);
    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){ setTimeout(fill, 100); setTimeout(fill, 800); setTimeout(fill, 2000); });
    } else { setTimeout(fill, 100); setTimeout(fill, 800); setTimeout(fill, 2000); }
    window.addEventListener('load', function(){ setTimeout(fill, 300); setTimeout(fill, 1500); });
})();
</script>
<?php
    }, 99);
}, 5);

// Slėpia Quick view ant rinkinių kortelių
add_action('wp_head', function () {
    if ( ! function_exists('is_woocommerce') ) return;
    ?>
<style id="petshop-mnm-hide-quickview">
.product-small.product_cat-konservu-rinkiniai .quick-view,
.product-small.product_cat-skanestu-rinkiniai .quick-view,
.product-small.product_cat-kramtalu-rinkiniai .quick-view,
.product-small.product_cat-konservu-rinkiniai a.button.quick-view,
.product-small.product_cat-skanestu-rinkiniai a.button.quick-view,
.product-small.product_cat-kramtalu-rinkiniai a.button.quick-view,
.product.product_cat-konservu-rinkiniai .quick-view,
.product.product_cat-skanestu-rinkiniai .quick-view,
.product.product_cat-kramtalu-rinkiniai .quick-view,
li.product.product_cat-konservu-rinkiniai .quick-view,
li.product.product_cat-skanestu-rinkiniai .quick-view,
li.product.product_cat-kramtalu-rinkiniai .quick-view {
    display: none !important; visibility: hidden !important; pointer-events: none !important;
}
</style>
<?php
});
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  const u = api('PUT','/wp-json/code-snippets/v1/snippets/524', {
    name:'Petshop MnM Rinkinio Vitrina v7 (Konservai+Skanėstai+Kramtalai, stock-aware, dinaminis ×N)',
    code: SNIPPET_V7,
    desc:'CSS+JS visiems MnM rinkiniams. Auto-gating per 3 kategorijas. Dinaminis × N žymeklis pagal komponento kiekį. Stock-aware mygtukas.',
    scope: 'global', active: true
  });
  out.update = u && u.id ? ('updated id='+u.id+' active='+u.active+' code_len='+(u.code||'').length) : (u.__raw||u.code||'?');
  commit('v7_update.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
