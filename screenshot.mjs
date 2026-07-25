import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
// isvalau seed + istrinu likusi seed snippet 1570
const CLEAN=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_clean']) || $_GET['ps_clean']!=='Clean25x') return;
  global $wpdb; $pf=$wpdb->prefix; $pid=30;
  $wpdb->update("{$pf}ps_pets", array('primary_product_id'=>null,'primary_product_name'=>null,'primary_product_package'=>null), array('id'=>$pid));
  $wpdb->query("DELETE FROM {$pf}ps_reminders WHERE pet_id=$pid AND reminder_label LIKE '%TEST%'");
  $rt=$pf.'ps_refill_tracking'; if($wpdb->get_var("SHOW TABLES LIKE '$rt'")){ $wpdb->query("DELETE FROM $rt WHERE pet_id=$pid"); }
  header('Content-Type: application/json');
  echo '###CLEAN###'.json_encode(array(
    'food'=>$wpdb->get_var("SELECT primary_product_name FROM {$pf}ps_pets WHERE id=$pid"),
    'rem'=>$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_reminders WHERE pet_id=$pid AND reminder_label LIKE '%TEST%'"),
    'rt'=>$wpdb->get_var("SELECT COUNT(*) FROM $rt WHERE pet_id=$pid")
  )).'###END###'; exit;
});`;
const mk=wj('POST','code-snippets/v1/snippets',{name:'CLEAN2 (temp)',code:CLEAN,scope:'front-end',active:true,priority:5});
let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 4');
try{ const r=execSync('curl -sk "https://dev.avesa.lt/?ps_clean=Clean25x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('###CLEAN###'),b=r.indexOf('###END###'); o.clean=(a>=0&&b>a)?r.slice(a+11,b):r.slice(0,120); }catch(e){o.clean='ERR';}
// istrinu seed snippet 1570 + clean snippet
[1570, sid].forEach(function(id){ if(id!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+id+'"');}catch(e){} } });
putB64('cleanup.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
