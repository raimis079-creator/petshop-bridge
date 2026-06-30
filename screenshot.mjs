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

const SNIPPET_530_V2 = `<?php
// Petshop MnM Fiksuoti komponentų kiekiai v2
// Skaito rinkinio meta '_petshop_component_quantities' (JSON {product_id: kiekis})
// Naudoja TIKRĄ MnM filtrą 'wc_mnm_child_item_quantity_input_args' (rastas source'e).
// Nustato min_value = max_value = input_value = kiekis -> MnM užfiksuoja (required) ir rodo "×N".

function petshop_get_fixed_quantities($container_id) {
    $raw = get_post_meta($container_id, '_petshop_component_quantities', true);
    if (empty($raw)) return array();
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : array();
}

// === A) UI: input min=max=value=kiekis ===
add_filter('wc_mnm_child_item_quantity_input_args', function($args, $child_item, $container) {
    if (!$child_item || !$container) return $args;
    $container_id = $container->get_id();
    $product = $child_item->get_product();
    if (!$product) return $args;
    $pid = $product->get_id();

    $fixed = petshop_get_fixed_quantities($container_id);
    if (empty($fixed) || !isset($fixed[$pid])) return $args;

    $qty = (int) $fixed[$pid];
    if ($qty < 1) return $args;

    $args['min_value']   = $qty;
    $args['max_value']   = $qty;
    $args['input_value'] = $qty;
    // required wrapper klasė (min===max)
    if (!isset($args['wrapper_classes'])) $args['wrapper_classes'] = array();
    if (!in_array('required', $args['wrapper_classes'])) $args['wrapper_classes'][] = 'required';
    // "×N" required_text
    $args['required_text'] = sprintf('&times;%d', $qty);

    return $args;
}, 20, 3);

// === B) Default input value (kai container init'ina) ===
add_filter('wc_mnm_child_item_quantity_input_default_value', function($qty, $child_item, $container) {
    if (!$child_item || !$container) return $qty;
    $fixed = petshop_get_fixed_quantities($container->get_id());
    $product = $child_item->get_product();
    if (!$product) return $qty;
    $pid = $product->get_id();
    if (isset($fixed[$pid]) && (int)$fixed[$pid] >= 1) {
        return (int) $fixed[$pid];
    }
    return $qty;
}, 20, 3);
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  const u = api('PUT','/wp-json/code-snippets/v1/snippets/532', {
    name:'Petshop MnM Fiksuoti komponentų kiekiai v2',
    code: SNIPPET_530_V2,
    desc:'Naudoja wc_mnm_child_item_quantity_input_args (tikras MnM filtras). min=max=value=kiekis -> required, ×N žymeklis.',
    scope: 'global', active: true
  });
  out.update = u && u.id ? ('updated id='+u.id+' active='+u.active+' len='+(u.code||'').length) : (u.__raw||u.code||'?');
  commit('snip532_v2.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
