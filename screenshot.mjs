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

// Naudoju PHP snippet'ą — tikras MnM cart->order flow per WC API
// nes REST orders nesukuria MnM child item struktūros teisingai
const PROBE = `<?php
add_action('init', function(){
    if (!isset($_GET['koju_test']) || $_GET['koju_test'] !== 'go') return;
    $out = array();
    $cid = 34175;
    $product = wc_get_product($cid);
    if (!$product) { update_option('koju_result', json_encode(array('error'=>'no product'))); wp_die('x'); }

    // 1. Komponentų kiekiai iš meta
    $fixed_raw = get_post_meta($cid, '_petshop_component_quantities', true);
    $fixed_map = json_decode($fixed_raw, true) ?: array();
    $out['fixed_map'] = $fixed_map;

    // 2. PRIEŠ — likučiai
    $out['before'] = array();
    foreach ($product->get_child_items() as $child) {
        $cp = $child->get_product();
        if (!$cp) continue;
        $pid = $cp->get_id();
        $out['before'][$pid] = array(
            'name' => substr($cp->get_name(),0,45),
            'qty_in_set' => isset($fixed_map[$pid]) ? (int)$fixed_map[$pid] : 1,
            'stock' => $cp->get_stock_quantity(),
        );
    }

    // 3. Sukuriam užsakymą su MnM struktūra
    $order = wc_create_order();

    // Pridedam MnM container į užsakymą su konfigūracija
    $configuration = array();
    foreach ($product->get_child_items() as $child) {
        $child_id = $child->get_id();
        $cp = $child->get_product();
        if (!$cp) continue;
        $pid = $cp->get_id();
        $qty = isset($fixed_map[$pid]) ? (int)$fixed_map[$pid] : 1;
        $configuration[$child_id] = array(
            'product_id' => $pid,
            'quantity' => $qty,
        );
    }
    $out['configuration'] = $configuration;

    // wc_mnm pateikia funkciją pridėti container į order su konfigūracija
    if (function_exists('wc_mnm_add_container_to_order')) {
        $out['add_method'] = 'wc_mnm_add_container_to_order';
        wc_mnm_add_container_to_order($order, $product, 1, $configuration);
    } else {
        // fallback - standartinis add_product + MnM cart item data
        $out['add_method'] = 'manual';
        $item_id = $order->add_product($product, 1, array(
            'mnm_config' => $configuration
        ));
    }

    $order->calculate_totals();
    $order->save();
    $out['order_id'] = $order->get_id();

    // 4. Pakeičiam statusą į completed -> tai sukelia stock reduction
    $order->update_status('completed', 'Testas - tikrinam likučių nurašymą');

    // Palaukiam ir perskaitom PO
    wc_delete_product_transients();

    $out['after'] = array();
    $product2 = wc_get_product($cid);
    foreach ($product2->get_child_items() as $child) {
        $cp = wc_get_product($child->get_product()->get_id());
        if (!$cp) continue;
        $pid = $cp->get_id();
        $out['after'][$pid] = $cp->get_stock_quantity();
    }

    update_option('koju_result', json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['koju_read']) || $_GET['koju_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('koju_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Koju Test', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?koju_test=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,4000));
  const res = exec('curl -sk "'+BASE+'/?koju_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('koju_test.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
