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
const CODE=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_ntm']) || $_GET['ps_ntm']!=='Ntm25x') return;
  global $wpdb; $pf=$wpdb->prefix; $t=$pf.'ps_pet_notes'; $o=array();
  $charset=$wpdb->get_charset_collate();
  $exists = $wpdb->get_var("SHOW TABLES LIKE '$t'");
  if(!$exists){
    require_once(ABSPATH.'wp-admin/includes/upgrade.php');
    $sql = "CREATE TABLE $t (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      pet_id BIGINT UNSIGNED NOT NULL,
      user_id BIGINT UNSIGNED NOT NULL,
      body TEXT NOT NULL,
      note_date DATE NOT NULL,
      is_pinned TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      KEY pet_id (pet_id),
      KEY user_id (user_id),
      KEY pet_pinned (pet_id, is_pinned, note_date)
    ) $charset;";
    dbDelta($sql);
    $o['created']=true;
  } else { $o['created']=false; $o['already_exists']=true; }
  // verifikacija struktura
  $o['table_exists']=(bool)$wpdb->get_var("SHOW TABLES LIKE '$t'");
  $cols=$wpdb->get_results("SHOW COLUMNS FROM $t", ARRAY_A);
  $o['columns']=array_map(function($c){return $c['Field'].':'.$c['Type'];}, $cols);
  $o['engine']=$wpdb->get_var("SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{$pf}ps_pet_notes'");
  $o['indexes']=$wpdb->get_col("SHOW INDEX FROM $t");
  header('Content-Type: application/json'); echo json_encode($o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'NTM (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,100);}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_ntm=Ntm25x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,250);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('notemig.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
