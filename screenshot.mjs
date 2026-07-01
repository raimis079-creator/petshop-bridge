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
    if (!isset($_GET['wh2_probe']) || $_GET['wh2_probe'] !== 'go') return;
    $out = array();
    global $wpdb;

    // 1. VISI meta raktai, kurie prasideda _vf, _zb, arba turi warehouse/sandelis
    // Skaičiuojam kiek produktų turi kiekvieną
    $meta_keys = $wpdb->get_results("
        SELECT meta_key, COUNT(DISTINCT post_id) as cnt
        FROM {$wpdb->postmeta}
        WHERE meta_key REGEXP '_(vf|zb|legacy|wareh|sandel|stock_loc)'
        GROUP BY meta_key
        ORDER BY cnt DESC
    ", ARRAY_A);
    $out['warehouse_meta_keys'] = $meta_keys;

    // 2. _vf_enabled reikšmių pasiskirstymas
    $vf_vals = $wpdb->get_results("
        SELECT meta_value, COUNT(*) as cnt
        FROM {$wpdb->postmeta}
        WHERE meta_key = '_vf_enabled'
        GROUP BY meta_value
    ", ARRAY_A);
    $out['vf_enabled_values'] = $vf_vals;

    // 3. Ar yra _zb_enabled ar panašu?
    $zb_check = $wpdb->get_results("
        SELECT meta_key, COUNT(*) as cnt
        FROM {$wpdb->postmeta}
        WHERE meta_key LIKE '%zb%' OR meta_value LIKE '%ZB%' AND meta_key LIKE '\\_%'
        GROUP BY meta_key
        LIMIT 20
    ", ARRAY_A);
    $out['zb_related'] = $zb_check;

    // 4. Kiek iš viso publikuotų produktų
    $total = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'");
    $out['total_products'] = $total;

    // 5. Kiek turi _vf_enabled=yes
    $vf_yes = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key='_vf_enabled' AND meta_value='yes'");
    $out['vf_enabled_yes_count'] = $vf_yes;

    // 6. Paimu 3 produktus SU _vf_enabled=yes ir 3 BE — pažiūriu skirtumus
    $vf_products = $wpdb->get_col("SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_vf_enabled' AND meta_value='yes' LIMIT 3");
    $non_vf = $wpdb->get_col("
        SELECT p.ID FROM {$wpdb->posts} p
        WHERE p.post_type='product' AND p.post_status='publish'
        AND p.ID NOT IN (SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='_vf_enabled')
        LIMIT 3
    ");

    $out['vf_sample'] = array();
    foreach ($vf_products as $pid) {
        $p = wc_get_product($pid);
        $meta = get_post_meta($pid);
        $wh_meta = array();
        foreach ($meta as $k=>$v) {
            if (preg_match('/_(vf|zb|legacy|wareh|sandel|stock)/', $k)) $wh_meta[$k] = is_array($v)?$v[0]:$v;
        }
        $out['vf_sample'][] = array('id'=>$pid, 'name'=>substr($p?$p->get_name():'?',0,40), 'wh_meta'=>$wh_meta);
    }
    $out['non_vf_sample'] = array();
    foreach ($non_vf as $pid) {
        $p = wc_get_product($pid);
        $meta = get_post_meta($pid);
        $wh_meta = array();
        foreach ($meta as $k=>$v) {
            if (preg_match('/_(vf|zb|legacy|wareh|sandel|stock)/', $k)) $wh_meta[$k] = is_array($v)?$v[0]:$v;
        }
        $out['non_vf_sample'][] = array('id'=>$pid, 'name'=>substr($p?$p->get_name():'?',0,40), 'wh_meta'=>$wh_meta);
    }

    update_option('wh2_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['wh2_read']) || $_GET['wh2_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('wh2_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP WH2 Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?wh2_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,3000));
  const res = exec('curl -sk "'+BASE+'/?wh2_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('wh2_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
