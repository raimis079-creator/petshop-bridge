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

const PROBE = `<?php
add_action('init', function(){
    if (!isset($_GET['kc']) || $_GET['kc'] !== 'go') return;
    $out = array();
    $cid = 34175;
    $product = wc_get_product($cid);
    $out['type'] = $product->get_type();
    $out['sku'] = $product->get_sku();
    $out['price'] = $product->get_price();
    $out['min'] = method_exists($product,'get_min_container_size') ? $product->get_min_container_size() : '?';
    $out['max'] = method_exists($product,'get_max_container_size') ? $product->get_max_container_size() : '?';
    // KRITIŠKA — ar meta įrašytas formos
    $out['petshop_quantities'] = get_post_meta($cid, '_petshop_component_quantities', true);
    $out['mnm_content_source'] = get_post_meta($cid, '_mnm_content_source', true);
    $out['mnm_per_product_pricing'] = get_post_meta($cid, '_mnm_per_product_pricing', true);
    // Child items
    $out['children'] = array();
    foreach ($product->get_child_items() as $child) {
        $cp = $child->get_product();
        $out['children'][] = array('id'=>$cp->get_id(), 'name'=>substr($cp->get_name(),0,40), 'stock'=>$cp->get_stock_quantity());
    }
    // DB child items lentelė
    global $wpdb;
    $rows = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->prefix}wc_mnm_child_items WHERE container_id = %d", $cid), ARRAY_A);
    $out['db_child_rows'] = $rows;
    update_option('kc_result', json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['kcr']) || $_GET['kcr'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('kc_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP KC', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?kc=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?kcr=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('kc.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
