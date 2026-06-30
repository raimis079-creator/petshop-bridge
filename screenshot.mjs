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

// Naudoju Code Snippets plugin'ą kaip "PHP eval" kanalą — sukuriu laikiną snippet'ą,
// kuris ištiria MnM child_item objekto struktūrą ir DB schemą, rezultatą įrašo į option'ą,
// kurį perskaitau per REST.
const PROBE_CODE = `<?php
// PROBE: MnM child item struktūra + DB lentelės
add_action('init', function(){
    if (!isset($_GET['mnm_probe']) || $_GET['mnm_probe'] !== 'go1') return;
    global $wpdb;
    $out = array();

    // 1. Ar yra wc_mnm child items lentelė?
    $tables = $wpdb->get_col("SHOW TABLES LIKE '%mnm%'");
    $out['mnm_tables'] = $tables;

    // 2. Paimu egzistuojantį rinkinį 34158 (11 konservų) ir žiūriu jo child items
    if (function_exists('wc_get_product')) {
        $p = wc_get_product(34158);
        if ($p && method_exists($p, 'get_child_items')) {
            $items = $p->get_child_items();
            $out['child_count'] = count($items);
            $sample = array();
            $first = reset($items);
            if ($first) {
                // Visi viešieji metodai
                $methods = get_class_methods($first);
                $out['child_item_methods'] = array_values(array_filter($methods, function($m){
                    return strpos($m, 'get_') === 0 || strpos($m, 'set_') === 0;
                }));
                $out['child_item_class'] = get_class($first);
                // Bandau iškviesti kiekio metodus
                foreach (array('get_quantity','get_quantity_min','get_quantity_max','get_quantity_default') as $meth) {
                    if (method_exists($first, $meth)) {
                        $out['sample_'.$meth] = $first->$meth();
                    }
                }
                $out['sample_child_id'] = method_exists($first,'get_id') ? $first->get_id() : '?';
                $out['sample_product_id'] = ($first->get_product()) ? $first->get_product()->get_id() : '?';
            }
        }
    }

    // 3. Ar yra child items DB lentelė su quantity stulpeliais?
    foreach ($tables as $t) {
        $cols = $wpdb->get_results("SHOW COLUMNS FROM $t", ARRAY_A);
        $out['columns_'.$t] = array_map(function($c){ return $c['Field']; }, $cols);
        // Pirma eilute pavyzdys is 34158
        $rows = $wpdb->get_results("SELECT * FROM $t LIMIT 3", ARRAY_A);
        $out['sample_rows_'.$t] = $rows;
    }

    update_option('mnm_probe_result', wp_json_encode($out));
    wp_die('PROBE DONE');
});
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  // Sukuriu probe snippet'ą
  let cmd='curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({
    name:'TEMP MnM Probe', code: PROBE_CODE, desc:'temp', scope:'global', active:true
  }));
  cmd += ' -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"';
  let raw = exec(cmd);
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={__raw:raw.slice(0,300)}; }
  out.snippet_id = snip && snip.id;

  // Trigerinu probe per GET
  await new Promise(r=>setTimeout(r,2000));
  exec('curl -sk "'+BASE+'/?mnm_probe=go1" -o /dev/null');
  await new Promise(r=>setTimeout(r,2000));

  // Perskaitau rezultatą per options REST (jei yra) - bandau per snippet'o eval alternatyvą:
  // sukuriu antrą snippet'ą kuris grąžina option per REST... arba paprasčiau - per wp/v2 settings nepasieks.
  // Naudoju kitą būdą: probe įrašė į option, skaitau per dar vieną GET endpoint'ą
  const READER = `<?php
add_action('init', function(){
    if (!isset($_GET['mnm_read']) || $_GET['mnm_read'] !== 'go1') return;
    header('Content-Type: application/json');
    echo get_option('mnm_probe_result', '{}');
    exit;
});
`;
  fs.writeFileSync('/tmp/snip2.json', JSON.stringify({
    name:'TEMP MnM Reader', code: READER, desc:'temp', scope:'global', active:true
  }));
  let cmd2='curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip2.json "'+BASE+'/wp-json/code-snippets/v1/snippets"';
  let raw2 = exec(cmd2);
  let snip2; try{ snip2=JSON.parse(raw2); }catch(e){ snip2={}; }
  out.reader_id = snip2 && snip2.id;
  await new Promise(r=>setTimeout(r,2000));

  const probeResult = exec('curl -sk "'+BASE+'/?mnm_read=go1"');
  try{ out.probe = JSON.parse(probeResult); }catch(e){ out.probe_raw = probeResult.slice(0,2000); }

  // Išvalau temp snippet'us
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  if(out.reader_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.reader_id+'"');

  commit('mnm_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
