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
function bash(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'ERR: '+String(e).slice(0,200); } }
(async()=>{
  const out={ts:new Date().toISOString()};
  // Find MnM plugin path on server (via WP filesystem we can't ssh, but plugin sends class names via REST)
  // grep plugin source on server is not possible from container. Use WP plugin info via REST + grep relevant filter names in WC docs already gathered.
  // Better: use WP system_status to get plugin info + dump active filters? Not exposed via REST.
  // Strategy: source the plugin code via WordPress Plugins File Editor REST? Not available.
  // Instead — fetch plugin zip from WooCommerce.com? No auth.
  // Alternative: use code-snippets REST to inject a PROBE snippet that lists wc_mnm_* hooks via has_filter() / global $wp_filter scan, returns to admin notice or option, we read via REST option.
  // Simpler: write a TEMP snippet that dumps all 'wc_mnm_*' and 'woocommerce_mnm_*' hook names from $wp_filter into wp_options['_petshop_mnm_hooks_dump']. Then read option via REST.
  const snippetCode = `<?php
// TEMP Petshop MnM Hooks Probe v1 (TEMP)
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_probe_mnm']) ) return;
  if ( ! current_user_can('manage_options') ) return;
  global $wp_filter;
  $hits=[];
  foreach($wp_filter as $tag=>$obj){
    if (preg_match('/mnm/i', $tag)) $hits[]=$tag;
  }
  // also scan known class methods if loaded
  $cls=[];
  foreach(['WC_Mix_and_Match','WC_Mix_and_Match_Child_Item','WC_MNM_Core_Compatibility','WC_MNM_Cart','WC_MNM_Display'] as $c){
    if (class_exists($c)) $cls[$c] = get_class_methods($c);
  }
  update_option('_petshop_mnm_hooks_dump', json_encode(['hooks'=>$hits,'classes'=>$cls,'ts'=>time()]));
  wp_die('OK '.count($hits).' hooks dumped');
}, 1);
`;
  // create the snippet
  const create = bash('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \''+JSON.stringify({
    name:'TEMP Petshop MnM Hooks Probe v1 (TEMP)',
    code: snippetCode,
    desc:'Probe MnM hooks - safe to delete',
    scope: 'global',
    active: true
  }).replace(/'/g,"'\\''")+'\' "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  out.create = create.slice(0,300);
  try{ const j=JSON.parse(create); out.snip_id = j.id; }catch(e){}
  // trigger probe (logged in app-password auth)
  if(out.snip_id){
    const probe = bash('curl -sk -L -H "Authorization: '+AUTH+'" "'+BASE+'/?ps_probe_mnm=1"');
    out.probe_result = probe.match(/OK \d+ hooks/)?.[0] || probe.slice(0,200);
    // read the dumped option
    const opt = bash('curl -sk -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/settings"');
    // settings endpoint may not expose arbitrary options; use options REST plugin or direct option fetch via filter
    // Fallback: write a 2nd snippet that exposes the option via custom REST route. Simpler — pick from /options/{name} not available.
    // Just write a small endpoint snippet
    const dump2 = `<?php
// TEMP Petshop MnM Hooks Reader v1 (TEMP)
add_action('rest_api_init', function(){
  register_rest_route('petshop/v1', '/mnm-dump', ['methods'=>'GET','permission_callback'=>function(){return current_user_can('manage_options');}, 'callback'=>function(){
    return rest_ensure_response(json_decode(get_option('_petshop_mnm_hooks_dump','{}'), true));
  }]);
});`;
    const create2 = bash('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \''+JSON.stringify({
      name:'TEMP Petshop MnM Hooks Reader v1 (TEMP)',
      code: dump2, desc:'Reader endpoint - safe to delete', scope:'global', active: true
    }).replace(/'/g,"'\\''")+'\' "'+BASE+'/wp-json/code-snippets/v1/snippets"');
    try{ const j2=JSON.parse(create2); out.reader_id = j2.id; }catch(e){ out.create2=create2.slice(0,200); }
    // wait a sec then call dump endpoint
    bash('sleep 2');
    const dump = bash('curl -sk -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/petshop/v1/mnm-dump"');
    out.dump = dump.slice(0,8000);
  }
  commit('mnm_hooks.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
