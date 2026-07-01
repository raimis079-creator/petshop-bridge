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
    if (!isset($_GET['av_dryrun']) || $_GET['av_dryrun'] !== 'go') return;
    $out = array();
    global $wpdb;

    // Visi publikuoti produktai
    $total = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'");
    $out['total'] = $total;

    // Kategorizuoju KIEKVIENĄ produktą pagal fulfillment + vf/zb enabled
    // Reikia suprasti: kas taptų AV
    $products = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'");

    $buckets = array(
        'vf_active' => 0,        // _active_fulfillment_source = vf_dropship
        'zb_active' => 0,        // _active_fulfillment_source = zb_dropship
        'oos_but_vf' => 0,       // out_of_stock BET turi vf_enabled=yes (VF prekė be likučio)
        'oos_but_zb' => 0,       // out_of_stock BET turi zb_enabled=yes (ZB prekė be likučio)
        'oos_neither' => 0,      // out_of_stock ir NEI vf NEI zb (tikras AV kandidatas)
        'nofield_but_vf' => 0,   // nėra lauko BET vf_enabled=yes
        'nofield_but_zb' => 0,   // nėra lauko BET zb_enabled=yes
        'nofield_neither' => 0,  // nėra lauko ir NEI vf NEI zb (tikras AV kandidatas)
    );
    $av_candidates_strict = array(); // tik oos_neither + nofield_neither
    $av_candidates_loose = array();  // viskas kas ne vf_active/zb_active

    foreach ($products as $pid) {
        $fs = get_post_meta($pid, '_active_fulfillment_source', true);
        $vf = get_post_meta($pid, '_vf_enabled', true) === 'yes';
        $zb = get_post_meta($pid, '_zb_enabled', true) === 'yes';

        if ($fs === 'vf_dropship') { $buckets['vf_active']++; continue; }
        if ($fs === 'zb_dropship') { $buckets['zb_active']++; continue; }

        // Viskas nuo čia — ne aktyvus vf/zb
        $av_candidates_loose[] = $pid;

        if ($fs === 'out_of_stock') {
            if ($vf) $buckets['oos_but_vf']++;
            elseif ($zb) $buckets['oos_but_zb']++;
            else { $buckets['oos_neither']++; $av_candidates_strict[] = $pid; }
        } else {
            // nėra lauko
            if ($vf) $buckets['nofield_but_vf']++;
            elseif ($zb) $buckets['nofield_but_zb']++;
            else { $buckets['nofield_neither']++; $av_candidates_strict[] = $pid; }
        }
    }

    $out['buckets'] = $buckets;
    $out['av_loose_count'] = count($av_candidates_loose);   // viskas ne vf/zb aktyvus
    $out['av_strict_count'] = count($av_candidates_strict); // tik tie kur nei vf nei zb tiekėjo

    // Pavyzdžiai iš "oos_but_vf" (VF prekės be likučio — ar tikrai jas norim AV?)
    $sample_oos_vf = array();
    $cnt = 0;
    foreach ($products as $pid) {
        if ($cnt >= 4) break;
        $fs = get_post_meta($pid, '_active_fulfillment_source', true);
        $vf = get_post_meta($pid, '_vf_enabled', true) === 'yes';
        if ($fs === 'out_of_stock' && $vf) {
            $p = wc_get_product($pid);
            $sample_oos_vf[] = array('id'=>$pid, 'name'=>substr($p?$p->get_name():'?',0,40));
            $cnt++;
        }
    }
    $out['sample_oos_but_vf'] = $sample_oos_vf;

    // Pavyzdžiai iš tikrų AV kandidatų (nofield_neither / oos_neither)
    $sample_av = array();
    $cnt = 0;
    foreach ($av_candidates_strict as $pid) {
        if ($cnt >= 6) break;
        $p = wc_get_product($pid);
        $sample_av[] = array('id'=>$pid, 'name'=>substr($p?$p->get_name():'?',0,45), 'stock'=>$p?$p->get_stock_quantity():'?');
        $cnt++;
    }
    $out['sample_av_strict'] = $sample_av;

    update_option('av_dryrun_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['av_read']) || $_GET['av_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('av_dryrun_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP AV Dryrun', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?av_dryrun=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,6000)); // 2723 produktai — ilgesnis
  const res = exec('curl -sk "'+BASE+'/?av_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('av_dryrun.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
