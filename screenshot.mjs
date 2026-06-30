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
    if (!isset($_GET['cost_probe']) || $_GET['cost_probe'] !== 'go') return;
    $out = array();
    global $wpdb;

    // Tikrinu kelis 800g konservus — visi jų meta raktai (ieškau savikainos)
    $sample_ids = array(19598, 19582, 19570, 19562);
    $out['products'] = array();
    foreach ($sample_ids as $pid) {
        $p = wc_get_product($pid);
        if (!$p) continue;
        // VISI meta raktai
        $all_meta = get_post_meta($pid);
        $cost_related = array();
        foreach ($all_meta as $key => $val) {
            // Ieškau cost/savikaina/wholesale/purchase susijusių
            if (preg_match('/cost|cog|savikain|wholesale|purchase|buy|supplier|tiekej/i', $key)) {
                $cost_related[$key] = is_array($val) ? $val[0] : $val;
            }
        }
        $out['products'][] = array(
            'id' => $pid,
            'name' => substr($p->get_name(), 0, 40),
            'price' => $p->get_price(),
            'cost_meta' => $cost_related,
            'all_meta_keys' => array_keys($all_meta)
        );
    }

    // Ar yra Cost of Goods plugin?
    $out['cog_plugins'] = array();
    $active_plugins = get_option('active_plugins', array());
    foreach ($active_plugins as $plug) {
        if (preg_match('/cost|cog|margin|pelno|profit/i', $plug)) {
            $out['cog_plugins'][] = $plug;
        }
    }

    update_option('cost_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['cost_read']) || $_GET['cost_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('cost_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Cost Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?cost_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?cost_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('cost_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
