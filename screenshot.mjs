import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const PHP="if ( ! defined('ABSPATH') ) { return; }\n// Webhook receiver: /wp-json/petshop/v1/sender-webhook\nadd_action('rest_api_init', function(){\n  register_rest_route('petshop/v1', '/sender-webhook', array(\n    'methods' => 'POST',\n    'permission_callback' => '__return_true',\n    'callback' => function( $request ){\n      $body = $request->get_body();\n      $json = json_decode($body, true);\n      $sig = $request->get_header('X-Sender-Signature');\n      // log to option (testui)\n      $log = get_option('ps_sender_webhook_log', array());\n      $log[] = array(\n        'received_at' => current_time('mysql'),\n        'signature_present' => $sig ? 'yes' : 'no',\n        'body' => $body,\n        'parsed' => $json,\n      );\n      // keep last 20\n      if (count($log) > 20) { $log = array_slice($log, -20); }\n      update_option('ps_sender_webhook_log', $log, false);\n      return new WP_REST_Response(array('received'=>true), 200);\n    },\n  ));\n});\n// viewer: /?ps_webhook_log=1&token=...\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_webhook_log']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  if ( isset($_GET['clear']) ) { update_option('ps_sender_webhook_log', array(), false); }\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode(get_option('ps_sender_webhook_log', array()), JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function senderCall(method, path, body){
  const SAPI='https://api.sender.net/v2';
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{let id=0;try{
  L('======================================');
  L('TESTAS #4: Webhookai (Sender -> Woo)');
  L('======================================');
  L('');
  // 1. deploy webhook receiver snippet
  L('--- 4a. Woo webhook receiver deploy ---');
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop Sender Webhook Receiver v1',desc:'test4 receiver',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('  receiver snippet ID: '+id+' (HTTP '+c.code+')');
  execSync('sleep 3');
  // clear old log
  sh('curl -s -k --max-time 30 "'+BASE+'/?ps_webhook_log=1&clear=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  const WH_URL = BASE + '/wp-json/petshop/v1/sender-webhook';
  L('  webhook URL: '+WH_URL);
  L('');

  // 2. self-test: POST to our own endpoint to confirm it logs
  L('--- 4b. Endpoint self-test ---');
  const selftest=sh('curl -s -k --max-time 30 -X POST -H "Content-Type: application/json" -d \'{"test":"selftest","type":"ping"}\' "'+WH_URL+'"');
  L('  self-test resp: '+selftest.slice(0,100));
  L('');

  // 3. register webhook in Sender
  L('--- 4c. Registruoju webhook Sender pusėje ---');
  // Sender webhook: POST /account (or /webhooks?) — probe
  let reg=senderCall('POST','/webhooks',{url:WH_URL, topic:'subscribers/unsubscribe'});
  L('  POST /webhooks {url,topic:unsubscribe} HTTP '+reg.code+' — '+reg.raw.slice(0,200));
  if(reg.code==='404'){
    // try alternate structures
    let reg2=senderCall('POST','/account/webhooks',{url:WH_URL, topic:'unsubscribe'});
    L('  POST /account/webhooks HTTP '+reg2.code+' — '+reg2.raw.slice(0,150));
  }
  L('');

  // 4. list existing webhooks
  L('--- 4d. GET /webhooks (esami) ---');
  const list=senderCall('GET','/webhooks');
  L('  HTTP '+list.code+' — '+list.raw.slice(0,300));
  L('');

  if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});L('  (receiver deaktyvuotas testo pabaigai — bet self-test log liko)');}
  L('  RECEIVER_ID='+id);
  putText('_test4.txt', out);
  console.log('done');
}catch(e){putText('_test4.txt','!!! '+e+'\n'+out);}})();
