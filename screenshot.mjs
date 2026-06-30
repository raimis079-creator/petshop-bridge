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

const SNIPPET_V5 = `<?php
// Petshop MnM Sutaupymo žymeklis v5
// A) Produkto puslapyje: "Sutaupote X,XX € (Y%)" po kaina
// B) Kategorijos puslapyje: "-Y%" badge ant nuotraukos (viršuje kairėje)

function petshop_mnm_calc_savings($product) {
    if (!$product || $product->get_type() !== 'mix-and-match') return false;
    $allowed_cats = array('konservu-rinkiniai', 'skanestu-rinkiniai', 'kramtalu-rinkiniai');
    $matched = false;
    foreach ($allowed_cats as $slug) {
        if (has_term($slug, 'product_cat', $product->get_id())) { $matched = true; break; }
    }
    if (!$matched) return false;
    $container_id = $product->get_id();
    $fixed_raw = get_post_meta($container_id, '_petshop_component_quantities', true);
    $fixed_map = array();
    if (!empty($fixed_raw)) {
        $decoded = json_decode($fixed_raw, true);
        if (is_array($decoded)) $fixed_map = $decoded;
    }
    $total_separate = 0.0;
    if (method_exists($product, 'get_child_items')) {
        foreach ($product->get_child_items() as $child) {
            $cp = $child->get_product();
            if (!$cp) continue;
            $cid = $cp->get_id();
            $qty = isset($fixed_map[$cid]) ? (int)$fixed_map[$cid] : 1;
            if ($qty < 1) $qty = 1;
            $fresh = wc_get_product($cid);
            if (!$fresh) continue;
            $raw_price = (float) $fresh->get_price();
            if ($raw_price <= 0) $raw_price = (float) $fresh->get_regular_price();
            $display_price = (float) wc_get_price_to_display($fresh, array('price' => $raw_price));
            $total_separate += $display_price * $qty;
        }
    }
    if ($total_separate <= 0) return false;
    $bundle_price = (float) wc_get_price_to_display($product);
    $savings = $total_separate - $bundle_price;
    if ($savings < 0.01) return false;
    return array(
        'amount'  => $savings,
        'percent' => round(($savings / $total_separate) * 100),
    );
}

// === A) Produkto puslapyje ===
add_action('woocommerce_single_product_summary', function() {
    global $product;
    $sav = petshop_mnm_calc_savings($product);
    if (!$sav) return;
    $savings_str = number_format($sav['amount'], 2, ',', ' ');
    echo '<p class="petshop-savings" style="margin: -0.5rem 0 1.2rem; font-size: 15px; font-weight: 600; color: #4a8a3f;">'
        . 'Sutaupote ' . esc_html($savings_str) . ' &euro; (' . esc_html($sav['percent']) . '%)'
        . '</p>';
}, 11);

// === B) Kategorijos/shop: badge per sale_flash filtrą (Flatsome jį rodo ANT nuotraukos) ===
add_filter('woocommerce_sale_flash', function($html, $post, $product) {
    if (!$product || $product->get_type() !== 'mix-and-match') return $html;
    $sav = petshop_mnm_calc_savings($product);
    if (!$sav) return $html;
    // Grąžinam standartinį WC sale badge formatą — Flatsome jį pozicionuoja ant nuotraukos
    return '<span class="onsale">-' . esc_html($sav['percent']) . '%</span>';
}, 20, 3);

// === C) MnM produktai nėra "on_sale" pagal WC — priverčiame rodyti sale badge ===
add_filter('woocommerce_product_is_on_sale', function($on_sale, $product) {
    if (!$product || $product->get_type() !== 'mix-and-match') return $on_sale;
    $sav = petshop_mnm_calc_savings($product);
    if ($sav) return true;
    return $on_sale;
}, 20, 2);
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  const u = api('PUT','/wp-json/code-snippets/v1/snippets/535', {
    name:'Petshop MnM Sutaupymo žymeklis v5 (sale_flash)',
    code: SNIPPET_V5,
    desc:'v5: badge per woocommerce_sale_flash filtrą (Flatsome pozicionuoja ant nuotraukos). is_on_sale override MnM rinkinams.',
    scope: 'global', active: true
  });
  out.update = u && u.id ? ('updated len='+(u.code||'').length) : (u.__raw||'?');
  commit('snip535_v5.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
