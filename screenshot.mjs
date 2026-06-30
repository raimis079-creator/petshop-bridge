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
    if (!isset($_GET['gd_probe']) || $_GET['gd_probe'] !== 'go') return;
    $out = array();
    
    // 1. PHP GD
    $out['gd_loaded'] = extension_loaded('gd');
    if (function_exists('gd_info')) {
        $info = gd_info();
        $out['gd_version'] = $info['GD Version'] ?? '?';
        $out['jpeg'] = $info['JPEG Support'] ?? false;
        $out['png'] = $info['PNG Support'] ?? false;
        $out['webp'] = $info['WebP Support'] ?? false;
        $out['freetype'] = $info['FreeType Support'] ?? false;
    }
    
    // 2. Reikalingos funkcijos
    $funcs = array('imagecreatetruecolor','imagecreatefromjpeg','imagecreatefrompng',
                   'imagecopyresampled','imagejpeg','imagedestroy','getimagesize',
                   'imagesx','imagesy','imagecolorallocate','imagefilledrectangle');
    $out['functions'] = array();
    foreach ($funcs as $f) {
        $out['functions'][$f] = function_exists($f);
    }
    
    // 3. Memory limit
    $out['memory_limit'] = ini_get('memory_limit');
    $out['max_execution_time'] = ini_get('max_execution_time');
    $out['upload_max_filesize'] = ini_get('upload_max_filesize');
    
    // 4. WP upload dir
    $upload = wp_upload_dir();
    $out['upload_path'] = $upload['path'];
    $out['upload_url'] = $upload['url'];
    $out['upload_writable'] = is_writable($upload['path']);
    
    // 5. PHP versija
    $out['php_version'] = PHP_VERSION;
    
    // 6. WC MnM REST endpoint'ai — ar galima kurti MnM produktą per wc_get_product + save
    $out['wc_mnm_class_exists'] = class_exists('WC_Product_Mix_and_Match');
    
    // 7. Ar Code Snippets leidžia admin_menu hook'ą
    $out['is_admin'] = is_admin();
    $out['current_user_can_manage'] = current_user_can('manage_woocommerce');
    
    update_option('gd_probe_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['gd_read']) || $_GET['gd_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('gd_probe_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP GD Probe', code: PROBE, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?gd_probe=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,2500));
  const res = exec('curl -sk "'+BASE+'/?gd_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('gd_probe.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
