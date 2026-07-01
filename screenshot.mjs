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
    if (!isset($_GET['fs_probe']) || $_GET['fs_probe'] !== 'go') return;
    $out = array();
    global $wpdb;

    // 1. _active_fulfillment_source reikšmių pasiskirstymas
    $fs_vals = $wpdb->get_results("
        SELECT meta_value, COUNT(*) as cnt
        FROM {$wpdb->postmeta}
        WHERE meta_key = '_active_fulfillment_source'
        GROUP BY meta_value
        ORDER BY cnt DESC
    ", ARRAY_A);
    $out['fulfillment_source_values'] = $fs_vals;

    // 2. Kiek produktų NEturi šio lauko
    $total = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'");
    $with_fs = $wpdb->get_var("SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} WHERE meta_key='_active_fulfillment_source'");
    $out['total_products'] = $total;
    $out['with_fulfillment_source'] = $with_fs;
    $out['without_fulfillment_source'] = $total - $with_fs;

    // 3. _own_stock_qty reikšmių pasiskirstymas (kiek turi >0)
    $own_stock = $wpdb->get_row("
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN CAST(meta_value AS DECIMAL(10,2)) > 0 THEN 1 ELSE 0 END) as positive
        FROM {$wpdb->postmeta}
        WHERE meta_key = '_own_stock_qty'
    ", ARRAY_A);
    $out['own_stock'] = $own_stock;

    // 4. Kryžminė analizė: kaip fulfillment_source siejasi su vf/zb/own
    // Paimu produktus su kiekviena fulfillment_source reikšme ir tikrinu jų vf/zb/own žymes
    foreach ($fs_vals as $fv) {
        $val = $fv['meta_value'];
        $sample_ids = $wpdb->get_col($wpdb->prepare("
            SELECT post_id FROM {$wpdb->postmeta}
            WHERE meta_key='_active_fulfillment_source' AND meta_value=%s
            LIMIT 3
        ", $val));
        $samples = array();
        foreach ($sample_ids as $pid) {
            $p = wc_get_product($pid);
            $vf = get_post_meta($pid, '_vf_enabled', true);
            $zb = get_post_meta($pid, '_zb_enabled', true);
            $own = get_post_meta($pid, '_own_stock_qty', true);
            $stock = $p ? $p->get_stock_quantity() : '?';
            $vf_qty = get_post_meta($pid, '_vf_qty', true);
            $zb_qty = get_post_meta($pid, '_zb_qty', true);
            $samples[] = array(
                'id'=>$pid,
                'name'=>substr($p?$p->get_name():'?',0,35),
                'vf_enabled'=>$vf?:'-', 'zb_enabled'=>$zb?:'-', 'own_stock_qty'=>$own?:'-',
                'vf_qty'=>$vf_qty?:'-', 'zb_qty'=>$zb_qty?:'-', 'wc_stock'=>$stock
            );
        }
        $out['fs_'.$val] = $samples;
    }

    // 5. Ar yra produktų su keliais šaltiniais aktyviais (vf+zb+own)?
    // Kiek turi ir vf_enabled=yes IR zb_enabled=yes
    $both = $wpdb->get_var("
        SELECT COUNT(DISTINCT p1.post_id)
        FROM {$wpdb->postmeta} p1
        JOIN {$wpdb->postmeta} p2 ON p1.post_id = p2.post_id
        WHERE p1.meta_key='_vf_enabled' AND p1.meta_value='yes'
        AND p2.meta_key='_zb_enabled' AND p2.meta_value='yes'
    ");
    $out['both_vf_and_zb'] = $both;

    update_option('fs_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['fs_read']) || $_GET['fs_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('fs_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP FS Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?fs_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,3000));
  const res = exec('curl -sk "'+BASE+'/?fs_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('fs_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
