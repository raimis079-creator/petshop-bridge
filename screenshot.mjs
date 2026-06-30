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
    if (!isset($_GET['pp']) || $_GET['pp'] !== 'go') return;
    $out = array();
    // Tikrinu komponentą 19098 (Balta jaučio ausis) ĮVAIRIAIS būdais
    $cid = 19098;

    // 1. wc_get_product (gali būti MnM child wrapper)
    $p = wc_get_product($cid);
    $out['get_price'] = $p ? $p->get_price() : 'no';
    $out['get_regular_price'] = $p ? $p->get_regular_price() : 'no';
    $out['get_class'] = $p ? get_class($p) : 'no';

    // 2. Tiesiai iš post_meta (apeina visus filtrus)
    $out['meta_price'] = get_post_meta($cid, '_price', true);
    $out['meta_regular_price'] = get_post_meta($cid, '_regular_price', true);
    $out['meta_sale_price'] = get_post_meta($cid, '_sale_price', true);

    // 3. Su nauju produkto objektu (be MnM konteksto)
    remove_all_filters('woocommerce_product_get_price');
    remove_all_filters('woocommerce_product_get_regular_price');
    $p2 = wc_get_product($cid);
    $out['after_remove_filters_get_price'] = $p2 ? $p2->get_price() : 'no';

    update_option('pp_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['pr']) || $_GET['pr'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('pp_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP PP', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?pp=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?pr=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,1500); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('pp_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
