import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  let out=''; const L=s=>{out+=s+'\n'; console.log(s);};
  L('=== Rename .NEW -> .php (be exec) ===');
  const PHP = "if(!defined('ABSPATH'))return;\n" +
    "add_action('wp_loaded', function(){\n" +
    "  if(($_GET['ps_rename']??'')!=='1')return;\n" +
    "  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n" +
    "  $edir=WP_PLUGIN_DIR.'/petshop-esp';\n" +
    "  $einc=$edir.'/includes';\n" +
    "  $out=array();\n" +
    "  // Uztikrinam kad seni include failai istrinti\n" +
    "  foreach(array('class-event-log.php','class-consent-log.php','class-consent-sync.php','class-retry-queue.php','interface-esp-adapter.php') as $f){\n" +
    "    $p=$einc.'/'.$f; $out['del_'.$f]=file_exists($p)?(@unlink($p)?'ok':'FAIL'):'-';\n" +
    "  }\n" +
    "  // Ar .NEW egzistuoja?\n" +
    "  $out['new_exists']=file_exists($edir.'/petshop-esp.php.NEW');\n" +
    "  $out['new_bytes']=file_exists($edir.'/petshop-esp.php.NEW')?filesize($edir.'/petshop-esp.php.NEW'):0;\n" +
    "  // Sanity: tikrinam kad main.NEW turi 'PETSHOP_ESP_VERSION' ir NETURI 'function ps_emit_event'\n" +
    "  $newc = file_exists($edir.'/petshop-esp.php.NEW') ? file_get_contents($edir.'/petshop-esp.php.NEW') : '';\n" +
    "  $out['new_has_version'] = strpos($newc,\"'0.4.0'\")!==false;\n" +
    "  $out['new_has_emit_decl'] = strpos($newc,'function ps_emit_event')!==false;\n" +
    "  // Rename tik jei .NEW OK\n" +
    "  if($out['new_exists'] && $out['new_has_version'] && !$out['new_has_emit_decl']){\n" +
    "    $out['rename']=@rename($edir.'/petshop-esp.php.NEW',$edir.'/petshop-esp.php')?'ok':'FAIL';\n" +
    "    if(file_exists($edir.'/petshop-esp.php.OFF')) $out['off_del']=@unlink($edir.'/petshop-esp.php.OFF')?'ok':'FAIL';\n" +
    "  } else {\n" +
    "    $out['rename']='SKIPPED (sanity fail)';\n" +
    "  }\n" +
    "  $out['final_dir']=array_values(array_filter(scandir($edir),function($f){return $f!=='.'&&$f!=='..';}));\n" +
    "  $out['final_inc']=array_values(array_filter(scandir($einc),function($f){return $f!=='.'&&$f!=='..';}));\n" +
    "  header('Content-Type: application/json'); echo wp_json_encode($out, JSON_PRETTY_PRINT); exit;\n" +
    "}, 6);";
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Rename tmp',desc:'x',code:PHP,scope:'global',active:true,priority:5});
  let sid=0;try{sid=JSON.parse(c.body).id;}catch(e){}
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 40 "'+BASE+'/?ps_rename=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('rename rezultatas:'); L(r);
  if(sid) api('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate',{});

  // Site alive po rename
  execSync('sleep 2');
  L(''); L('Home: '+sh('curl -s -k --max-time 30 -o /dev/null -w "HTTP:%{http_code}" "'+BASE+'/?nc='+Date.now()+'"'));

  // Aktyvuoti esp (jei reikia)
  const actPHP = "if(!defined('ABSPATH'))return;\n" +
    "add_action('wp_loaded', function(){\n" +
    "  if(($_GET['ps_act_final']??'')!=='1')return;\n" +
    "  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n" +
    "  if(!function_exists('activate_plugin')) require_once ABSPATH.'wp-admin/includes/plugin.php';\n" +
    "  $slug='petshop-esp/petshop-esp.php';\n" +
    "  if(!is_plugin_active($slug)){ $err=activate_plugin($slug); }else{ $err=null; }\n" +
    "  $out=array(\n" +
    "    'esp_active'=>is_plugin_active($slug),\n" +
    "    'error'=>is_wp_error($err)?$err->get_error_message():null,\n" +
    "    'esp_ver'=>defined('PETSHOP_ESP_VERSION')?PETSHOP_ESP_VERSION:'neaktyvus',\n" +
    "    'core_ver'=>defined('PETSHOP_CORE_VERSION')?PETSHOP_CORE_VERSION:'?',\n" +
    "    'sender_class'=>class_exists('Petshop_Sender_Adapter'),\n" +
    "    'implements_mp'=>function_exists('ps_esp_adapter')&&ps_esp_adapter()?(ps_esp_adapter() instanceof Petshop_Message_Provider?'YES':'NO'):'no_fn',\n" +
    "    'aliases'=>array(\n" +
    "      'Petshop_ESP_Event_Log'=>class_exists('Petshop_ESP_Event_Log'),\n" +
    "      'Petshop_ESP_Retry_Queue'=>class_exists('Petshop_ESP_Retry_Queue'),\n" +
    "      'Interface_ESP_Adapter'=>interface_exists('Interface_ESP_Adapter'),\n" +
    "    ),\n" +
    "    'consent_read'=>function_exists('ps_get_marketing_consent')?ps_get_marketing_consent('terra@gyvunai.lt'):'no_fn',\n" +
    "  );\n" +
    "  header('Content-Type: application/json'); echo wp_json_encode($out, JSON_PRETTY_PRINT); exit;\n" +
    "}, 6);";
  const c2=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Act Final tmp',desc:'x',code:actPHP,scope:'global',active:true,priority:5});
  let sid2=0;try{sid2=JSON.parse(c2.body).id;}catch(e){}
  execSync('sleep 2');
  L(''); L('=== aktyvavimas + patikra ==='); L(sh('curl -s -k --max-time 30 "'+BASE+'/?ps_act_final=1&token=cmplz_6680aa2a42151d54fa8d64ec"'));
  if(sid2) api('POST','/wp-json/code-snippets/v1/snippets/'+sid2+'/deactivate',{});

  putText('rename_final.txt', out);
})();
