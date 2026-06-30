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

const PROBE2 = `<?php
add_action('init', function(){
    if (!isset($_GET['mnm_probe2']) || $_GET['mnm_probe2'] !== 'go') return;
    global $wpdb;
    $out = array();
    $cid = 34158; // VANDENYNAS rinkinys

    // 1. VISI post_meta rinkinio (ieškau mnm/quantity raktų)
    $metas = $wpdb->get_results($wpdb->prepare(
        "SELECT meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND (meta_key LIKE '%%mnm%%' OR meta_key LIKE '%%quantit%%' OR meta_key LIKE '%%container%%')",
        $cid
    ), ARRAY_A);
    $out['container_metas'] = $metas;

    // 2. WC_MNM_Child_Item->get_quantity() šaltinis - žiūriu, ar jis ima iš container settings
    $p = wc_get_product($cid);
    if ($p) {
        // MnM produktai turi get_min_container_size / get_max_container_size
        foreach (array('get_min_container_size','get_max_container_size','get_container_size') as $m) {
            if (method_exists($p, $m)) $out['product_'.$m] = $p->$m();
        }
        // Ar yra child_quantities meta?
        $out['meta_child_item_quantities'] = get_post_meta($cid, '_mnm_child_item_quantities', true);
        $out['meta_mnm_data'] = get_post_meta($cid, '_mnm_data', true);
        // get_child_items su quantity
        if (method_exists($p, 'get_child_items')) {
            $items = $p->get_child_items();
            $first = reset($items);
            if ($first) {
                // get_quantity priima min/max kaip parametrą?
                $rc = new ReflectionMethod($first, 'get_quantity');
                $params = array();
                foreach ($rc->getParameters() as $param) {
                    $params[] = $param->getName() . ($param->isOptional() ? '='.json_encode($param->getDefaultValue()) : '');
                }
                $out['get_quantity_signature'] = $params;
                // Bandau su 'min', 'max'
                foreach (array('min','max','default') as $ctx) {
                    try { $out['get_quantity_'.$ctx] = $first->get_quantity($ctx); } catch(Exception $e) { $out['get_quantity_'.$ctx] = 'ERR:'.$e->getMessage(); }
                }
                // child item meta data
                $out['first_child_meta'] = $first->get_meta_data();
            }
        }
    }

    // 3. Plugin'o versija + ar yra "per item quantities" funkcionalumas
    if (defined('WC_Mix_and_Match::VERSION')) $out['mnm_version'] = WC_Mix_and_Match::VERSION;
    $out['mnm_const'] = defined('WC_MNM_VERSION') ? WC_MNM_VERSION : 'n/a';

    update_option('mnm_probe2_result', wp_json_encode($out));
    wp_die('PROBE2 DONE');
});
add_action('init', function(){
    if (!isset($_GET['mnm_read2']) || $_GET['mnm_read2'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('mnm_probe2_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Probe2', code: PROBE2, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2000));
  exec('curl -sk "'+BASE+'/?mnm_probe2=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2000));
  const res = exec('curl -sk "'+BASE+'/?mnm_read2=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2500); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('mnm_probe2.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
