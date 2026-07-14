import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_consent_recon']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  $out = array();\n  global $wpdb;\n\n  // 1. Ar WooCommerce turi marketing opt-in support (checkout)?\n  $out['1_wc_version'] = defined('WC_VERSION') ? WC_VERSION : '?';\n  // WC 3.4+ turi built-in marketing consent (woocommerce_registration_privacy, checkout marketing opt-in)\n  $out['1_wc_marketing_optin_setting'] = get_option('woocommerce_registration_privacy', 'nera');\n\n  // 2. Ar egzistuoja ps_consent_log lentele jau?\n  $t = $wpdb->prefix.'ps_consent_log';\n  $out['2_consent_log_exists'] = (bool) $wpdb->get_var(\"SHOW TABLES LIKE '$t'\");\n\n  // 3. Ar egzistuoja Sender webhook signing secret WP option'e?\n  $out['3_webhook_secret_option'] = get_option('petshop_esp_sender_webhook_secret', 'nera') !== 'nera' ? 'yra' : 'nera';\n\n  // 4. Ar Petshop ESP plugin aktyvus + versija?\n  $out['4_esp_version'] = defined('PETSHOP_ESP_VERSION') ? PETSHOP_ESP_VERSION : 'neaktyvus';\n  $out['4_adapter_fn'] = function_exists('ps_esp_adapter');\n\n  // 5. Vartotoju meta pavyzdys \u2014 ar yra billing_email, ar user_meta marketing lauku\n  $users = get_users(array('number'=>3, 'fields'=>array('ID','user_email')));\n  $out['5_sample_users'] = array();\n  foreach($users as $u){\n    $out['5_sample_users'][] = array(\n      'id' => $u->ID,\n      'email' => $u->user_email,\n      'ps_marketing_consent' => get_user_meta($u->ID, 'ps_marketing_consent', true),\n    );\n  }\n\n  // 6. REST namespace petshop/v1 jau egzistuoja? (kiti moduliai galbut registravo)\n  $routes = rest_get_server()->get_routes();\n  $petshop_routes = array();\n  foreach(array_keys($routes) as $r){\n    if(strpos($r, '/petshop/') === 0) $petshop_routes[] = $r;\n  }\n  $out['6_petshop_rest_routes'] = $petshop_routes;\n\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function scall(method, path){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" "'+SAPI+path+'"';
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  return {code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?', raw:r.replace(/\nHTTP:\S+$/,'')};
}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{let id=0;let out='';const L=s=>{out+=s+'\n';};
  // WP recon
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop Consent Recon tmp',desc:'token',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  if(id){ execSync('sleep 2'); const r=sh('curl -s -k --max-time 45 "'+BASE+'/?ps_consent_recon=1&token=cmplz_6680aa2a42151d54fa8d64ec"'); L('=== WP RECON ==='); L(r); api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{}); }
  // Sender webhook recon
  L(''); L('=== SENDER WEBHOOKS ==='); 
  const wh = scall('GET','/account/webhooks');
  L('HTTP '+wh.code); L(wh.raw.slice(0,600));
  putText('_consent_recon.txt', out);
  console.log('done');
})();
