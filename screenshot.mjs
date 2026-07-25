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
const o={pets:[]};
// PHP snippet: paimti visus augintinius + ju dashboard duomenis, simuliuoti ka moduliai rodys
const CODE=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_a2r']) || $_GET['ps_a2r']!=='A2r25x') return;
  global $wpdb; $pf=$wpdb->prefix;
  $rows=$wpdb->get_results("SELECT id,pet_name,species,primary_product_name,primary_product_package FROM {$pf}ps_pets WHERE deleted_at IS NULL OR deleted_at='0000-00-00 00:00:00' ORDER BY id LIMIT 8", ARRAY_A);
  $out=array();
  foreach($rows as $r){
    $pid=(int)$r['id'];
    // shelf duomenys (refill lentele)
    $shelf=null;
    if(class_exists('Petshop_Pet_Dashboard')){
      $ref=new ReflectionMethod('Petshop_Pet_Dashboard','get_shelf');
      $ref->setAccessible(true);
      // get_shelf($pet_id) - bet reikia user_id; imu is pet
      $uid=$wpdb->get_var($wpdb->prepare("SELECT user_id FROM {$pf}ps_pets WHERE id=%d",$pid));
      try { $shelf=$ref->invoke(null,$pid); } catch(Exception $e){ $shelf=array('err'=>$e->getMessage()); }
    }
    // reminders
    $rem=$wpdb->get_results($wpdb->prepare("SELECT reminder_type,due_date FROM {$pf}ps_reminders WHERE pet_id=%d AND (deleted_at IS NULL OR deleted_at='0000-00-00 00:00:00') ORDER BY due_date ASC LIMIT 3",$pid), ARRAY_A);
    $out[]=array(
      'id'=>$pid,'name'=>$r['pet_name'],'species'=>$r['species'],
      'has_food'=>!empty($r['primary_product_name']),
      'food'=>$r['primary_product_name'],
      'shelf_has_data'=> (is_array($shelf)&&isset($shelf['has_data']))?$shelf['has_data']:null,
      'shelf_product'=> (is_array($shelf)&&isset($shelf['product_name']))?$shelf['product_name']:null,
      'shelf_days'=> (is_array($shelf)&&isset($shelf['days_left']))?$shelf['days_left']:null,
      'reminders_count'=>count($rem),
      'first_reminder'=> $rem?($rem[0]['reminder_type'].' @ '.$rem[0]['due_date']):null,
      // ka moduliai rodys:
      'MODULE_feeding'=> !empty($r['primary_product_name']) ? ((is_array($shelf)&&!empty($shelf['has_data']))?'busena_C_likutis+feedback':'busena_B_planas') : 'busena_A_nustatyti',
      'MODULE_repeat'=> (is_array($shelf)&&!empty($shelf['product_name'])) ? 'RODOMA' : 'PASLEPTA(null)',
      'NOW_signal'=> ($rem||((is_array($shelf)&&!empty($shelf['has_data'])))) ? 'RODOMA' : 'NErodoma'
    );
  }
  header('Content-Type: application/json');
  echo '###A2###'.json_encode($out).'###END###'; exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'A2R (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,150);}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_a2r=A2r25x"',{maxBuffer:5e6,timeout:60000}).toString();
  const s=r.indexOf('###A2###'), e=r.indexOf('###END###');
  o.result = (s>=0&&e>s) ? r.slice(s+8,e) : ('NF:'+r.slice(0,200));
  if(sid!==null){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){ o.err=String(e).slice(0,200); }
putB64('a2rest.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
