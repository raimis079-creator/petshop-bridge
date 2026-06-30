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

// Ieskau MnM source faile filtrų, susijusių su child item quantity
const PROBE3 = `<?php
add_action('init', function(){
    if (!isset($_GET['mnm_probe3']) || $_GET['mnm_probe3'] !== 'go') return;
    $out = array();
    // Surandu MnM plugin'o kelią
    $plugin_dir = WP_PLUGIN_DIR . '/woocommerce-mix-and-match-products';
    if (!is_dir($plugin_dir)) {
        // bandau kitus pavadinimus
        foreach (glob(WP_PLUGIN_DIR.'/*mix-and-match*', GLOB_ONLYDIR) as $d) { $plugin_dir = $d; break; }
    }
    $out['plugin_dir'] = $plugin_dir;

    // grep'inu filtrus su 'quantity' child item kontekste
    $hits = array();
    $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($plugin_dir));
    foreach ($rii as $file) {
        if ($file->isDir()) continue;
        if (substr($file->getFilename(), -4) !== '.php') continue;
        $content = file_get_contents($file->getPathname());
        // Ieškau apply_filters su quantity
        if (preg_match_all('/apply_filters\\(\\s*[\\'\"]([^\\'\"]*quantity[^\\'\"]*)[\\'\"]/i', $content, $m)) {
            foreach ($m[1] as $filter) {
                $hits[$filter] = basename($file->getFilename());
            }
        }
    }
    $out['quantity_filters'] = $hits;

    // Taip pat ieškau child item get_quantity metodo implementacijos
    $child_item_file = $plugin_dir . '/includes/data/class-wc-mnm-child-item.php';
    if (file_exists($child_item_file)) {
        $content = file_get_contents($child_item_file);
        // Ištraukiu get_quantity funkciją
        if (preg_match('/function get_quantity\\([^)]*\\)\\s*\\{(.*?)\\n\\t\\}/s', $content, $m)) {
            $out['get_quantity_body'] = substr(trim($m[1]), 0, 800);
        }
    }

    update_option('mnm_probe3_result', wp_json_encode($out));
    wp_die('PROBE3 DONE');
});
add_action('init', function(){
    if (!isset($_GET['mnm_read3']) || $_GET['mnm_read3'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('mnm_probe3_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Probe3', code: PROBE3, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2000));
  exec('curl -sk "'+BASE+'/?mnm_probe3=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2000));
  const res = exec('curl -sk "'+BASE+'/?mnm_read3=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2500); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('mnm_probe3.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
