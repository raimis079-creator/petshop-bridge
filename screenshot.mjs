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

// Patikrinu tikslų get_quantity body + ar wc_mnm_child_item_quantity filtras egzistuoja
const PROBE6 = `<?php
add_action('init', function(){
    if (!isset($_GET['mnm_p6']) || $_GET['mnm_p6'] !== 'go') return;
    $out = array();
    $f = '/home/gyvunai2/domains/avesa.lt/public_html/dev/wp-content/plugins/woocommerce-mix-and-match-products/includes/data/class-wc-mnm-child-item.php';
    $content = file_get_contents($f);
    // Surandu "public function get_quantity"
    $pos = strpos($content, 'function get_quantity');
    $out['found_pos'] = $pos;
    if ($pos !== false) {
        // Imu nuo pos iki kitos "public function" arba 2000 simboliu
        $chunk = substr($content, $pos, 2000);
        $next = strpos($chunk, 'public function', 20);
        $out['get_quantity_body'] = $next ? substr($chunk, 0, $next) : $chunk;
    }
    // Ar yra string 'wc_mnm_child_item_quantity' faile?
    $out['has_filter_string'] = strpos($content, 'wc_mnm_child_item_quantity') !== false;
    // Visi 'wc_mnm_child_item_quantity*' paminejimai
    if (preg_match_all('/wc_mnm_child_item_quantity[a-z_]*/', $content, $m)) {
        $out['quantity_strings'] = array_unique($m[0]);
    }
    update_option('mnm_p6_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['mnm_r6']) || $_GET['mnm_r6'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('mnm_p6_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP P6', code: PROBE6, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?mnm_p6=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?mnm_r6=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2500); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('mnm_p6.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
