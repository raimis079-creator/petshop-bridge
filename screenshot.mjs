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
    if (!isset($_GET['txt_probe']) || $_GET['txt_probe'] !== 'go') return;
    $out = array();

    // Ieškau MnM JS lokalizacijos (wp_localize_script) - iš kur ateina "items", "Please select"
    // Tikrinu MnM plugin JS failus
    $mnm_dir = WP_PLUGIN_DIR . '/woocommerce-mix-and-match-products';
    $js_strings = array();
    if (is_dir($mnm_dir)) {
        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($mnm_dir));
        foreach ($rii as $file) {
            $fn = $file->getFilename();
            if (substr($fn,-3) !== '.js' && substr($fn,-4) !== '.php') continue;
            $content = @file_get_contents($file->getPathname());
            if (!$content) continue;
            // Ieškau "Please select" ar "items" string'ų
            if (stripos($content, 'Please select') !== false || stripos($content, 'have selected') !== false) {
                // Kokiame faile
                $js_strings[$fn] = array();
                if (preg_match_all('/[\\x27\\x22]([^\\x27\\x22]*(?:Please select|have selected|%s items|to continue)[^\\x27\\x22]*)[\\x27\\x22]/', $content, $m)) {
                    $js_strings[$fn] = array_slice(array_unique($m[1]), 0, 8);
                }
            }
        }
    }
    $out['strings_location'] = $js_strings;

    // Ar yra wp_localize_script su MnM parametrais?
    // Tikrinu i18n handle
    $out['note'] = 'Jei string\\'ai .js faile — reikia wp_localize arba JS override, ne gettext';

    update_option('txt_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['txt_read']) || $_GET['txt_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('txt_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Txt Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?txt_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?txt_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('txt_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
