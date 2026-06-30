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
    if (!isset($_GET['sav_probe']) || $_GET['sav_probe'] !== 'go') return;
    $out = array();
    $cid = 34168; // skanėstų rinkinys
    $product = wc_get_product($cid);
    $out['product_type'] = $product ? $product->get_type() : 'NO PRODUCT';

    // Kategorijos
    $out['has_skanestu'] = has_term('skanestu-rinkiniai', 'product_cat', $cid);

    // Meta
    $fixed_raw = get_post_meta($cid, '_petshop_component_quantities', true);
    $out['fixed_raw'] = $fixed_raw;
    $out['fixed_decoded'] = json_decode($fixed_raw, true);

    // Child items + kainos
    if (method_exists($product, 'get_child_items')) {
        $items = $product->get_child_items();
        $out['child_count'] = count($items);
        $total = 0;
        $details = array();
        $fixed_map = json_decode($fixed_raw, true) ?: array();
        foreach ($items as $child) {
            $cp = $child->get_product();
            if (!$cp) continue;
            $pid = $cp->get_id();
            $qty = isset($fixed_map[$pid]) ? (int)$fixed_map[$pid] : 1;
            $price = (float) wc_get_price_to_display($cp);
            $total += $price * $qty;
            $details[] = array('pid'=>$pid, 'qty'=>$qty, 'price'=>$price, 'subtotal'=>$price*$qty);
        }
        $out['component_details'] = $details;
        $out['total_separate'] = $total;
    }
    $out['bundle_price'] = (float) wc_get_price_to_display($product);

    // Ar hook'as veikia? Tikrinu, ar woocommerce_single_product_summary turi mūsų callback
    global $wp_filter;
    $out['hook_registered'] = isset($wp_filter['woocommerce_single_product_summary']);

    update_option('sav_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['sav_read']) || $_GET['sav_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('sav_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP SavProbe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?sav_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?sav_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('sav_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
