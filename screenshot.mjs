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
    if (!isset($_GET['wh_probe']) || $_GET['wh_probe'] !== 'go') return;
    $out = array();
    global $wpdb;

    // Tikrinu kelis konservus — VISI meta raktai, ieškau sandėlio (VF/ZB/Legacy/warehouse/sandelis)
    $sample_ids = array(19598, 19602, 19594); // Animonda 800g, 400g
    // + Ontario monoproteino (iš paveikslo) ir Exclusion (hipoalerginiai)
    $extra = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND (post_title LIKE '%Ontario%' OR post_title LIKE '%Exclusion%' OR post_title LIKE '%Josera%') LIMIT 4");
    $sample_ids = array_merge($sample_ids, $extra);

    $out['products'] = array();
    foreach ($sample_ids as $pid) {
        $p = wc_get_product($pid);
        if (!$p) continue;
        $all_meta = get_post_meta($pid);
        $wh_related = array();
        foreach ($all_meta as $key => $val) {
            if (preg_match('/wareh|sandel|stock_loc|location|vf|zb|legacy|supplier|tiekej|brand_warehouse/i', $key)) {
                $wh_related[$key] = is_array($val) ? (isset($val[0]) ? $val[0] : '') : $val;
            }
        }
        // Taip pat tikrinu atributus
        $attrs = array();
        foreach ($p->get_attributes() as $aname => $aobj) {
            $attrs[$aname] = is_object($aobj) && method_exists($aobj,'get_options') ?
                wc_get_product_terms($pid, $aname, array('fields'=>'names')) : $aobj;
        }
        $out['products'][] = array(
            'id' => $pid,
            'name' => substr($p->get_name(), 0, 45),
            'sku' => $p->get_sku(),
            'wh_meta' => $wh_related,
            'attribute_keys' => array_keys($attrs),
            'all_meta_keys' => array_keys($all_meta)
        );
    }

    // Ar yra sandėlio atributas/taksonomija?
    $taxonomies = get_object_taxonomies('product');
    $out['wh_taxonomies'] = array();
    foreach ($taxonomies as $tax) {
        if (preg_match('/wareh|sandel|stock|location|vf|zb|legacy/i', $tax)) {
            $out['wh_taxonomies'][] = $tax;
        }
    }
    $out['all_taxonomies'] = $taxonomies;

    // Ieškau SKU pattern (gal sandėlis koduotas SKU pradžioje - VF-, ZB-)
    $skus = $wpdb->get_col("SELECT meta_value FROM {$wpdb->postmeta} WHERE meta_key='_sku' AND meta_value != '' LIMIT 30");
    $sku_prefixes = array();
    foreach ($skus as $sku) {
        if (preg_match('/^([A-Z]{2,3})[-_]/', $sku, $m)) {
            $sku_prefixes[$m[1]] = ($sku_prefixes[$m[1]] ?? 0) + 1;
        }
    }
    $out['sku_prefixes'] = $sku_prefixes;

    update_option('wh_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['wh_read']) || $_GET['wh_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('wh_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP WH Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?wh_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?wh_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('wh_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
