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
    if (!isset($_GET['mnm_render_probe']) || $_GET['mnm_render_probe'] !== 'go') return;
    $out = array();

    // Kokios MnM renderinimo funkcijos egzistuoja?
    foreach (array('woocommerce_mnm_add_to_cart', 'wc_mnm_template_add_to_cart', 'wc_mnm_content_loop') as $fn) {
        $out['func_'.$fn] = function_exists($fn);
    }

    // MnM add_to_cart hook'ai (kas registruota woocommerce_mix-and-match_add_to_cart)
    global $wp_filter;
    $hook = 'woocommerce_mix-and-match_add_to_cart';
    $out['hook_exists'] = isset($wp_filter[$hook]);
    if (isset($wp_filter[$hook])) {
        $out['hook_callbacks'] = array();
        foreach ($wp_filter[$hook]->callbacks as $prio => $cbs) {
            foreach ($cbs as $cb) {
                $name = '?';
                if (is_string($cb['function'])) $name = $cb['function'];
                elseif (is_array($cb['function'])) $name = (is_object($cb['function'][0])?get_class($cb['function'][0]):$cb['function'][0]).'::'.$cb['function'][1];
                $out['hook_callbacks'][] = $prio.': '.$name;
            }
        }
    }

    // Kaip MnM standartiškai renderina add_to_cart? Per do_action('woocommerce_'.type.'_add_to_cart')
    // Pabandau gauti vieno paslėpto produkto (34184) add-to-cart HTML
    $hidden = wc_get_product(34184);
    $out['hidden_type'] = $hidden ? $hidden->get_type() : 'no';
    $out['hidden_child_count'] = $hidden && method_exists($hidden,'get_child_items') ? count($hidden->get_child_items()) : '?';

    // Simuliuoju add_to_cart renderinimą
    global $product;
    $product = $hidden;
    ob_start();
    do_action('woocommerce_' . $hidden->get_type() . '_add_to_cart');
    $html = ob_get_clean();
    $out['rendered_html_length'] = strlen($html);
    $out['rendered_html_sample'] = substr($html, 0, 300);

    update_option('mnm_render_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['mnm_render_read']) || $_GET['mnm_render_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('mnm_render_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP MnM Render Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?mnm_render_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,3000));
  const res = exec('curl -sk "'+BASE+'/?mnm_render_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('mnm_render.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
