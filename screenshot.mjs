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

const SNIPPET_530 = `<?php
// Petshop MnM Fiksuoti komponentų kiekiai v1
// Skaito rinkinio meta '_petshop_component_quantities' (JSON {product_id: kiekis})
// ir nustato kiekvienam komponentui min = max = kiekis.
// Kai min===max, MnM automatiškai užfiksuoja kiekį (required) ir rodo "×N" žymeklį.

// Helper: gauti fiksuotų kiekių masyvą rinkiniui
function petshop_get_fixed_quantities($container_id) {
    $raw = get_post_meta($container_id, '_petshop_component_quantities', true);
    if (empty($raw)) return array();
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : array();
}

// === Filtras: nustatom kiekvieno komponento min/max/default kiekį ===
add_filter('wc_mnm_child_item_quantity', function($quantity, $type, $child_item) {
    if (!$child_item) return $quantity;
    $container_id = $child_item->get_container_id();
    $product = $child_item->get_product();
    if (!$product) return $quantity;
    $pid = $product->get_id();

    $fixed = petshop_get_fixed_quantities($container_id);
    if (empty($fixed) || !isset($fixed[$pid])) return $quantity;

    $fixed_qty = (int) $fixed[$pid];
    if ($fixed_qty < 1) return $quantity;

    // min = max = value = default = fiksuotas kiekis
    switch ($type) {
        case 'min':
        case 'max':
        case 'value':
        case 'default':
            return $fixed_qty;
        case 'step':
            return 1;
    }
    return $quantity;
}, 10, 3);

// === Saugiklis: container validacija (jei kažkas apeitų UI) ===
// Patikrinam, kad cart'e kiekvieno komponento kiekis = fiksuotas
add_filter('woocommerce_add_to_cart_validation', function($passed, $product_id, $quantity, $variation_id = 0, $cart_item_data = array()) {
    // MnM container validacija jau vyksta plugin'e; čia tik papildomas saugiklis
    // Jei reikės - galima pridėti tikslesnę logiką. Kol kas paliekam MnM built-in.
    return $passed;
}, 10, 5);
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  const cr = api('POST','/wp-json/code-snippets/v1/snippets', {
    name:'Petshop MnM Fiksuoti komponentų kiekiai v1',
    code: SNIPPET_530,
    desc:'Skaito rinkinio _petshop_component_quantities meta ir nustato kiekvienam komponentui min=max=kiekis (fiksuoja, rodo ×N)',
    scope: 'global', active: true
  });
  out.created = cr && cr.id ? {id:cr.id, active:cr.active, name:cr.name} : (cr.__raw||cr.code||'?');
  commit('snippet530.json', JSON.stringify(out,null,1));
  console.log("DONE id="+(cr&&cr.id));
})();
