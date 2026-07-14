import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const SETUP="if(!defined('ABSPATH'))return;\nadd_action('wp_loaded',function(){\n  if(($_GET['ps_cleanup']??'')!=='1')return;\n  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n  global $wpdb;\n  $admins=get_users(array('role'=>'administrator','number'=>1));$admin=$admins[0]??null;\n  if(!$admin){echo 'no admin';exit;}\n  $uid=$admin->ID;\n  $wpdb->query($wpdb->prepare(\"DELETE FROM {$wpdb->prefix}ps_pets WHERE user_id=%d\",$uid));\n  $wpdb->query($wpdb->prepare(\"DELETE FROM {$wpdb->prefix}ps_pet_products WHERE user_id=%d\",$uid));\n  $wpdb->query($wpdb->prepare(\"DELETE FROM {$wpdb->prefix}ps_refill_tracking WHERE user_id=%d\",$uid));\n  $wpdb->query($wpdb->prepare(\"DELETE FROM {$wpdb->prefix}ps_reminders WHERE user_id=%d\",$uid));\n  $wpdb->query(\"DELETE FROM {$wpdb->prefix}ps_event_log WHERE event_name LIKE 'pet_%' OR event_name LIKE '%refill_feedback%'\");\n  echo wp_json_encode(array('cleaned'=>$uid));exit;\n},6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -A "Mozilla/5.0" --max-time 90 '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -A "Mozilla/5.0" --max-time 60 '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'');}return r;}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Cleanup',desc:'x',code:SETUP,scope:'global',active:true,priority:6});
  let sid=0;try{sid=JSON.parse(c).id;}catch(e){}
  execSync('sleep 2');
  putText('cleanup.txt', sh('curl -s -k -A "Mozilla/5.0" --max-time 30 "'+BASE+'/?ps_cleanup=1&token=cmplz_6680aa2a42151d54fa8d64ec"'));
  if(sid) api('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate',{});
})();
