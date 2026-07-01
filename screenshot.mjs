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
    if (!isset($_GET['ff_probe']) || $_GET['ff_probe'] !== 'go') return;
    $out = array();
    global $wpdb;

    // 1. Josera Lamb 12kg — reali situacija 2. Ieškom.
    $josera = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND (post_title LIKE '%Josera%Lamb%' OR post_title LIKE '%Josera%12%kg%' OR post_title LIKE '%Josera%ėrien%') LIMIT 5");
    $out['josera_lamb'] = array();
    foreach ($josera as $pid) {
        $p = wc_get_product($pid);
        if (!$p) continue;
        $meta = get_post_meta($pid);
        $relevant = array();
        foreach ($meta as $k=>$v) {
            if (preg_match('/stock|_vf_qty|_zb_qty|_own|fulfillment|_vf_enabled|_zb_enabled/', $k)) {
                $relevant[$k] = is_array($v)?$v[0]:$v;
            }
        }
        $out['josera_lamb'][] = array(
            'id'=>$pid, 'name'=>substr($p->get_name(),0,50), 'sku'=>$p->get_sku(),
            'wc_stock'=>$p->get_stock_quantity(), 'manage_stock'=>$p->get_manage_stock(),
            'meta'=>$relevant
        );
    }

    // 2. Ar WC _stock = own+vf+zb suma, ar vienas šaltinis?
    // Paimu VF prekę ir palyginu _stock su _vf_qty
    $vf_sample = $wpdb->get_col("SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_vf_enabled' AND meta_value='yes' LIMIT 5");
    $out['stock_comparison'] = array();
    foreach ($vf_sample as $pid) {
        $p = wc_get_product($pid);
        if (!$p) continue;
        $out['stock_comparison'][] = array(
            'id'=>$pid, 'name'=>substr($p->get_name(),0,35),
            'wc_stock'=>$p->get_stock_quantity(),
            'vf_qty'=>get_post_meta($pid,'_vf_qty',true),
            'zb_qty'=>get_post_meta($pid,'_zb_qty',true),
            'own_qty'=>get_post_meta($pid,'_own_stock_qty',true),
            'fulfillment'=>get_post_meta($pid,'_active_fulfillment_source',true),
        );
    }

    // 3. Ar yra dinaminio šaltinio parinkimo hook'ai? Ieškom snippet'uose/pluginuose
    // Tikrinam code snippets, ar yra fulfillment/dropship logika
    $snippets = $wpdb->get_results("SELECT id, name FROM {$wpdb->prefix}snippets WHERE (name LIKE '%fulfill%' OR name LIKE '%sandel%' OR name LIKE '%stock%' OR name LIKE '%dropship%' OR name LIKE '%VF%' OR name LIKE '%ZB%' OR name LIKE '%warehouse%' OR name LIKE '%likut%') AND active=1", ARRAY_A);
    $out['relevant_snippets'] = $snippets;

    // 4. Kiek prekių turi _own_stock_qty lauką (net jei 0)
    $own_exists = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_own_stock_qty'");
    $out['own_stock_field_count'] = $own_exists;

    // 5. Ar yra dublikatų (ta pati prekė skirtingais kodais/EAN)?
    // Ieškom vienodų EAN su skirtingais SKU
    $dup_ean = $wpdb->get_results("
        SELECT meta_value as ean, COUNT(*) as cnt
        FROM {$wpdb->postmeta}
        WHERE meta_key IN ('_vf_barcode','_zb_ean') AND meta_value != ''
        GROUP BY meta_value HAVING cnt > 1
        LIMIT 10
    ", ARRAY_A);
    $out['duplicate_eans'] = $dup_ean;

    // 6. Visi _active_fulfillment_source susiję meta raktai (fulfillment logika)
    $ff_keys = $wpdb->get_results("
        SELECT meta_key, COUNT(*) as cnt FROM {$wpdb->postmeta}
        WHERE meta_key LIKE '%fulfill%' OR meta_key LIKE '%own_stock%' OR meta_key LIKE '%_source%' OR meta_key LIKE '%priority%'
        GROUP BY meta_key ORDER BY cnt DESC
    ", ARRAY_A);
    $out['fulfillment_keys'] = $ff_keys;

    update_option('ff_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['ff_read']) || $_GET['ff_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('ff_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP FF Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?ff_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,3500));
  const res = exec('curl -sk "'+BASE+'/?ff_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('ff_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
