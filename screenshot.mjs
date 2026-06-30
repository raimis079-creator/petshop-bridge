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

// Probe — kaip MnM nustatytas atsargų valdymas: ar komponentai turi manage_stock,
// ir ar MnM container nustatytas nurašyti komponentų atsargas
const PROBE = `<?php
add_action('init', function(){
    if (!isset($_GET['stock_probe']) || $_GET['stock_probe'] !== 'go') return;
    $out = array();

    // Churu mix rinkinys 34172, komponentai
    $cid = 34172;
    $product = wc_get_product($cid);
    $out['container_manage_stock'] = $product ? $product->get_manage_stock() : '?';
    $out['container_stock_status'] = $product ? $product->get_stock_status() : '?';

    // MnM container nustatymai dėl komponentų atsargų
    $out['mnm_meta'] = array();
    foreach (array('_mnm_per_product_pricing','_mnm_per_product_shipping','_mnm_content_source','_manage_stock','_stock','_stock_status') as $m) {
        $out['mnm_meta'][$m] = get_post_meta($cid, $m, true);
    }

    // Komponentų atsargų valdymas
    $out['components'] = array();
    if (method_exists($product, 'get_child_items')) {
        foreach ($product->get_child_items() as $child) {
            $cp = $child->get_product();
            if (!$cp) continue;
            $pid = $cp->get_id();
            $out['components'][] = array(
                'id' => $pid,
                'name' => substr($cp->get_name(), 0, 40),
                'manage_stock' => $cp->get_manage_stock(),
                'stock_qty' => $cp->get_stock_quantity(),
                'stock_status' => $cp->get_stock_status(),
                'backorders' => $cp->get_backorders(),
            );
        }
    }

    // KRITIŠKAS: ar MnM turi hook'ą "woocommerce_mnm_reduce_stock" ar pan.
    // Patikrinam, ar MnM source faile yra stock reduction logika
    $f = '/home/gyvunai2/domains/avesa.lt/public_html/dev/wp-content/plugins/woocommerce-mix-and-match-products';
    $stock_refs = array();
    if (is_dir($f)) {
        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($f));
        foreach ($rii as $file) {
            if ($file->isDir() || substr($file->getFilename(), -4) !== '.php') continue;
            $content = file_get_contents($file->getPathname());
            if (stripos($content, 'reduce_stock') !== false || stripos($content, 'reduce_order_stock') !== false) {
                if (preg_match_all('/function\\s+(\\w*reduce\\w*stock\\w*)\\s*\\(/i', $content, $m)) {
                    foreach ($m[1] as $fn) $stock_refs[$fn] = $file->getFilename();
                }
                // Taip pat ieškom 'manage_stock' susijusios logikos
                if (stripos($content, 'wc_mnm_keep_stock') !== false || stripos($content, 'mnm_manage_stock') !== false) {
                    $stock_refs['__has_mnm_stock_logic'] = $file->getFilename();
                }
            }
        }
    }
    $out['mnm_stock_functions'] = $stock_refs;

    update_option('stock_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['stock_read']) || $_GET['stock_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('stock_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Stock Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?stock_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?stock_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('stock_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
