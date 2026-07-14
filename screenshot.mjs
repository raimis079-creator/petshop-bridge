import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  let out='';const L=s=>{out+=s+'\n';};
  const home = sh('curl -s -k --max-time 30 -o /dev/null -w "%{http_code}" "'+BASE+'/?nc='+Date.now()+'"');
  L('Home HTTP: '+home);
  if(home!=='200'){ 
    const r = sh('curl -s -k --max-time 30 "'+BASE+'/?nc='+Date.now()+'"');
    const fm = r.match(/Fatal error[\s\S]{0,400}/i);
    L(fm?fm[0]:'no fatal in body');
    putText('_state_check.txt', out);
    return;
  }
  // Site gyva — patikrinam failu bukle
  const PHP = "if(!defined('ABSPATH'))return;\nadd_action('wp_loaded',function(){\n  if(($_GET['ps_st']??'')!=='1')return;\n  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n  $edir=WP_PLUGIN_DIR.'/petshop-esp';\n  $cinc=WP_PLUGIN_DIR.'/petshop-core/includes';\n  $iface=@file_get_contents($cinc.'/interface-message-provider.php');\n  $out=array(\n    'esp_php_exists'=>file_exists($edir.'/petshop-esp.php'),\n    'esp_off_exists'=>file_exists($edir.'/petshop-esp.php.OFF'),\n    'esp_dir'=>array_values(array_filter(scandir($edir),function($f){return $f!=='.'&&$f!=='..';})),\n    'iface_has_new_sig'=>$iface?(strpos($iface,'emit_event( \$email, \$event_id, \$event_name')!==false?'NEW_5PARAM':'OLD_3PARAM'):'no_file',\n    'core_active'=>is_plugin_active('petshop-core/petshop-core.php'),\n    'esp_active'=>is_plugin_active('petshop-esp/petshop-esp.php'),\n    'core_ver'=>defined('PETSHOP_CORE_VERSION')?PETSHOP_CORE_VERSION:'?',\n    'esp_ver'=>defined('PETSHOP_ESP_VERSION')?PETSHOP_ESP_VERSION:'neaktyvus',\n    'ps_emit_event'=>function_exists('ps_emit_event'),\n  );\n  header('Content-Type:application/json');echo wp_json_encode($out,JSON_PRETTY_PRINT);exit;\n},6);";
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'State Check tmp',desc:'x',code:PHP,scope:'global',active:true,priority:5});
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){}
  if(id){execSync('sleep 2');L('=== failu bukle ===');L(sh('curl -s -k --max-time 30 "'+BASE+'/?ps_st=1&token=cmplz_6680aa2a42151d54fa8d64ec"'));api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});}
  putText('_state_check.txt', out);
})();
