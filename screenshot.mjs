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

// Tikras MnM cart flow: pridedam į cart per WC()->cart->add_to_cart su mnm_config,
// tada sukuriam order iš cart, tada completed
const PROBE = `<?php
add_action('init', function(){
    if (!isset($_GET['koju2']) || $_GET['koju2'] !== 'go') return;
    $out = array();
    $cid = 34175;
    $product = wc_get_product($cid);
    $fixed_raw = get_post_meta($cid, '_petshop_component_quantities', true);
    $fixed_map = json_decode($fixed_raw, true) ?: array();

    // PRIEŠ
    $out['before'] = array();
    foreach ($product->get_child_items() as $child) {
        $cp = $child->get_product();
        $pid = $cp->get_id();
        $out['before'][$pid] = $cp->get_stock_quantity();
    }

    // Surenkam MnM konfigūraciją formatu child_item_id => qty
    $config = array();
    foreach ($product->get_child_items() as $child) {
        $child_item_id = $child->get_child_item_id();
        $cp = $child->get_product();
        $pid = $cp->get_id();
        $qty = isset($fixed_map[$pid]) ? (int)$fixed_map[$pid] : 1;
        $config[$child_item_id] = $qty;
    }
    $out['config'] = $config;

    // Inicializuojam cart jei reikia
    if (is_null(WC()->cart)) {
        wc_load_cart();
    }
    WC()->cart->empty_cart();

    // MnM add to cart su konfigūracija
    $cart_item_data = array('mnm_config' => $config);
    $added = WC()->cart->add_to_cart($cid, 1, 0, array(), $cart_item_data);
    $out['cart_add_result'] = $added ? 'OK:'.$added : 'FAIL';
    $out['cart_count'] = WC()->cart->get_cart_contents_count();

    // Sukuriam order iš cart
    if ($added) {
        $checkout = WC()->checkout();
        $order_id = $checkout->create_order(array(
            'payment_method' => 'bacs',
            'customer_id' => 0,
        ));
        $out['order_id'] = is_wp_error($order_id) ? ('ERR:'.$order_id->get_error_message()) : $order_id;

        if (!is_wp_error($order_id)) {
            $order = wc_get_order($order_id);
            // Patikrinam order items
            $out['order_items'] = array();
            foreach ($order->get_items() as $item) {
                $out['order_items'][] = array(
                    'name' => $item->get_name(),
                    'qty' => $item->get_quantity(),
                    'product_id' => $item->get_product_id(),
                );
            }
            // Completed -> stock reduction
            $order->update_status('completed', 'Test likučių nurašymas');
        }
    }

    WC()->cart->empty_cart();
    wc_delete_product_transients();

    // PO
    $out['after'] = array();
    $product2 = wc_get_product($cid);
    foreach ($product2->get_child_items() as $child) {
        $cp = wc_get_product($child->get_product()->get_id());
        $pid = $cp->get_id();
        $out['after'][$pid] = $cp->get_stock_quantity();
    }
    $out['fixed_map'] = $fixed_map;

    update_option('koju2_result', json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['koju2r']) || $_GET['koju2r'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('koju2_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Koju2', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?koju2=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,5000));
  const res = exec('curl -sk "'+BASE+'/?koju2r=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('koju2.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
