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

const SNIPPET_533 = `<?php
// Petshop MnM Sutaupymo žymeklis v1
// Dinamiškai apskaičiuoja, kiek klientas sutaupo pirkdamas rinkinį vietoj atskirų prekių.
// Rodo "Sutaupote X,XX € (Y%)" po kaina produkto puslapyje.
// Veikia tik mūsų rinkinių kategorijose.

add_action('woocommerce_single_product_summary', function() {
    global $product;
    if (!$product || $product->get_type() !== 'mix-and-match') return;

    // Tik mūsų rinkinių kategorijos
    $allowed_cats = array('konservu-rinkiniai', 'skanestu-rinkiniai', 'kramtalu-rinkiniai');
    $matched = false;
    foreach ($allowed_cats as $slug) {
        if (has_term($slug, 'product_cat', $product->get_id())) { $matched = true; break; }
    }
    if (!$matched) return;

    $container_id = $product->get_id();

    // Kiekiai iš meta
    $fixed_raw = get_post_meta($container_id, '_petshop_component_quantities', true);
    $fixed_map = array();
    if (!empty($fixed_raw)) {
        $decoded = json_decode($fixed_raw, true);
        if (is_array($decoded)) $fixed_map = $decoded;
    }

    // Suskaičiuoju atskirų komponentų kainų sumą
    $total_separate = 0.0;
    if (method_exists($product, 'get_child_items')) {
        $child_items = $product->get_child_items();
        foreach ($child_items as $child) {
            $child_product = $child->get_product();
            if (!$child_product) continue;
            $cid = $child_product->get_id();
            $qty = isset($fixed_map[$cid]) ? (int)$fixed_map[$cid] : 1;
            if ($qty < 1) $qty = 1;
            $price = (float) wc_get_price_to_display($child_product);
            $total_separate += $price * $qty;
        }
    }

    if ($total_separate <= 0) return;

    // Rinkinio kaina
    $bundle_price = (float) wc_get_price_to_display($product);
    $savings = $total_separate - $bundle_price;

    // Rodom tik jei tikrai sutaupoma (teigiamas skirtumas)
    if ($savings < 0.01) return;

    $savings_pct = round(($savings / $total_separate) * 100);

    $savings_str = number_format($savings, 2, ',', ' ');

    echo '<p class="petshop-savings" style="margin: -0.5rem 0 1.2rem; font-size: 15px; font-weight: 600; color: #4a8a3f;">'
        . 'Sutaupote ' . esc_html($savings_str) . ' &euro; (' . esc_html($savings_pct) . '%)'
        . '</p>';
}, 11);
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  const cr = api('POST','/wp-json/code-snippets/v1/snippets', {
    name:'Petshop MnM Sutaupymo žymeklis v1',
    code: SNIPPET_533,
    desc:'Dinamiškai rodo "Sutaupote X € (Y%)" po kaina rinkinio puslapyje. Skaičiuoja iš realių komponentų kainų × kiekiai.',
    scope: 'global', active: true
  });
  out.created = cr && cr.id ? {id:cr.id, active:cr.active, name:cr.name} : (cr.__raw||cr.code||'?');
  commit('snippet533.json', JSON.stringify(out,null,1));
  console.log("DONE id="+(cr&&cr.id));
})();
