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
function call(method, path, bodyObj){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  if(bodyObj!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(bodyObj)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,300)}; }
}
const PHP = [
"add_action('rest_api_init', function () {",
"  register_rest_route('petshop/v1', '/wccom', array(",
"    'methods' => 'GET',",
"    'permission_callback' => function () { return current_user_can('manage_options'); },",
"    'callback' => function () {",
"      $out = array();",
"      $out['helper_class'] = class_exists('WC_Helper');",
"      if (class_exists('WC_Helper') && method_exists('WC_Helper','is_site_connected')) { $out['is_site_connected'] = (bool) WC_Helper::is_site_connected(); } else { $out['is_site_connected'] = 'method_missing'; }",
"      $hd = get_option('woocommerce_helper_data');",
"      $out['helper_data_present'] = !empty($hd);",
"      if (class_exists('WC_Helper') && method_exists('WC_Helper','get_subscriptions')) {",
"        $subs = WC_Helper::get_subscriptions();",
"        $out['subscriptions_count'] = is_array($subs) ? count($subs) : 'n/a';",
"        if (is_array($subs)) { $out['subscriptions'] = array_values(array_map(function($s){ return array('product_name'=>isset($s['product_name'])?$s['product_name']:'', 'expires'=>isset($s['expires'])?$s['expires']:'', 'expired'=>isset($s['expired'])?$s['expired']:null, 'product_id'=>isset($s['product_id'])?$s['product_id']:''); }, array_slice($subs,0,40))); }",
"      } else { $out['subscriptions_count']='no_method'; }",
"      return $out;",
"    }",
"  ));",
"});"
].join("\n");
(async()=>{
  const log={ts:new Date().toISOString()};
  const cr = call('POST','/wp-json/code-snippets/v1/snippets', {name:'TEMP WCCOM Check v1 (read-only)', desc:'temp; delete after', code:PHP, scope:'global', active:false, priority:10});
  const sid = cr && cr.id ? cr.id : null;
  log.create_id = sid; if(cr&&cr.code) log.create_err=cr.code;
  if(!sid){ commit('wccom.json', JSON.stringify({log, fatal:'no id', cr},null,1)); console.log('NOID'); return; }
  call('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/activate', {});
  const res = call('GET','/wp-json/petshop/v1/wccom');
  // cleanup
  call('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate', {});
  call('DELETE','/wp-json/code-snippets/v1/snippets/'+sid);
  const after = call('GET','/wp-json/petshop/v1/wccom');
  log.route_after = (after && after.code) ? after.code : 'still_present';
  commit('wccom.json', JSON.stringify({log, result:res},null,1));
  console.log("DONE sid="+sid);
})();
