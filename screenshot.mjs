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

const PROBE5 = `<?php
add_action('init', function(){
    if (!isset($_GET['mnm_probe5']) || $_GET['mnm_probe5'] !== 'go') return;
    $out = array();
    $f = '/home/gyvunai2/domains/avesa.lt/public_html/dev/wp-content/plugins/woocommerce-mix-and-match-products/includes/data/class-wc-mnm-child-item.php';
    if (file_exists($f)) {
        $content = file_get_contents($f);
        // Pilna get_quantity funkcija
        $pos = strpos($content, 'function get_quantity');
        if ($pos !== false) {
            $out['get_quantity_full'] = substr($content, $pos, 1800);
        }
        // Ieskau visu apply_filters siame faile
        if (preg_match_all('/apply_filters\\(\\s*[\\'\"]([^\\'\"]+)[\\'\"]/', $content, $m)) {
            $out['all_filters_in_child_item'] = array_unique($m[1]);
        }
    }
    update_option('mnm_probe5_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['mnm_read5']) || $_GET['mnm_read5'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('mnm_probe5_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Probe5', code: PROBE5, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2000));
  exec('curl -sk "'+BASE+'/?mnm_probe5=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2000));
  const res = exec('curl -sk "'+BASE+'/?mnm_read5=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,3000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('mnm_probe5.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
