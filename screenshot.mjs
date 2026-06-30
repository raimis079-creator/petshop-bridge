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

// Probe: sukuriu 2 paslėptus MnM (800g·6 ir 800g·12) ir tikrinu ar MnM REST/AJAX
// gali grąžinti container "formą" kitam produktui (perjungimui)
const PROBE = `<?php
add_action('init', function(){
    if (!isset($_GET['switch_probe']) || $_GET['switch_probe'] !== 'go') return;
    $out = array();
    global $wpdb;
    $pool = array(19598, 19590, 19582, 19570, 19562, 19553, 19545, 19578); // 8x 800g
    $table = $wpdb->prefix . 'wc_mnm_child_items';

    // Sukuriu 2 paslėptus MnM
    function make_hidden_mnm($name, $sku, $price, $size, $pool, $table) {
        global $wpdb;
        $p = new WC_Product_Mix_and_Match();
        $p->set_name($name);
        $p->set_sku($sku);
        $p->set_status('publish');
        $p->set_catalog_visibility('hidden');
        $p->set_price($price);
        $p->set_regular_price($price);
        $p->set_min_container_size($size);
        $p->set_max_container_size($size);
        $p->update_meta_data('_mnm_content_source', 'products');
        $p->update_meta_data('_mnm_per_product_pricing', 'no');
        $p->save();
        $cid = $p->get_id();
        $o = 0;
        foreach ($pool as $pid) { $o++; $wpdb->insert($table, array('product_id'=>$pid,'container_id'=>$cid,'menu_order'=>$o), array('%d','%d','%d')); }
        return $cid;
    }

    $id6 = make_hidden_mnm('TEST 800g 6vnt', 'TEST-SW-800-6', 23.99, 6, $pool, $table);
    $id12 = make_hidden_mnm('TEST 800g 12vnt', 'TEST-SW-800-12', 44.99, 12, $pool, $table);
    $out['hidden_6'] = $id6;
    $out['hidden_12'] = $id12;

    // Sukuriu tėvinį (matomą) su config meta
    $parent = new WC_Product_Simple();
    $parent->set_name('TEST Susidėjimo konservų rinkinys šunims 800g');
    $parent->set_sku('TEST-PARENT-800');
    $parent->set_status('publish');
    $parent->set_catalog_visibility('visible');
    $parent->set_price(23.99); // pradinė (mažiausio dydžio)
    $parent->save();
    $parent_id = $parent->get_id();

    // Config: gramatūra -> dydis -> hidden product id
    $config = array(
        '800' => array(
            '6' => array('product_id'=>$id6, 'price'=>23.99),
            '12' => array('product_id'=>$id12, 'price'=>44.99),
        )
    );
    update_post_meta($parent_id, '_petshop_choice_config', wp_json_encode($config));
    $out['parent_id'] = $parent_id;
    $out['config'] = $config;

    // KRITIŠKA: ar galiu gauti MnM container "formos" HTML kitam produktui per AJAX?
    // MnM turi endpoint'ą "wc_mnm_get_default_form" ar pan.
    // Patikrinu ar yra tokia funkcija
    $out['mnm_ajax_actions'] = array();
    global $wp_filter;
    foreach (array('wc_mnm_get_container_form', 'mnm_get_form', 'wc_mnm_container_form') as $action) {
        $out['mnm_ajax_actions'][$action] = has_action('wp_ajax_'.$action) || has_action('wp_ajax_nopriv_'.$action);
    }
    // Ieškau MnM AJAX endpoint'ų source'e
    $mnm_dir = WP_PLUGIN_DIR . '/woocommerce-mix-and-match-products';
    $ajax_found = array();
    if (is_dir($mnm_dir)) {
        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($mnm_dir));
        foreach ($rii as $file) {
            if ($file->isDir() || substr($file->getFilename(),-4)!=='.php') continue;
            $c = file_get_contents($file->getPathname());
            if (preg_match_all('/wp_ajax_(?:nopriv_)?(\\w+)/', $c, $m)) {
                foreach ($m[1] as $a) $ajax_found[$a] = basename($file->getFilename());
            }
        }
    }
    $out['mnm_ajax_endpoints'] = $ajax_found;

    $out['parent_permalink'] = get_permalink($parent_id);

    update_option('switch_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['switch_read']) || $_GET['switch_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('switch_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Switch Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?switch_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,3500));
  const res = exec('curl -sk "'+BASE+'/?switch_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('switch_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
