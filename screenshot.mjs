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
  if(!isset(\$_GET['ps_ar']) || \$_GET['ps_ar']!=='Arx') return;
  global \$wpdb; \$dir=WP_PLUGIN_DIR.'/petshop-core/'; \$o=array();
  // A. ar petshop-core turi admin meniu / puslapiu
  \$admin=array();
  foreach(array_merge(glob(\$dir.'*.php'), glob(\$dir.'includes/*.php')) as \$f){
    \$c=file_get_contents(\$f);
    if(strpos(\$c,'add_menu_page')!==false || strpos(\$c,'add_submenu_page')!==false || strpos(\$c,'add_management_page')!==false){
      preg_match_all('/add_(menu|submenu|management|options)_page\\s*\\(([^;]{0,180})/', \$c, \$m);
      \$admin[basename(\$f)]=array_slice(\$m[0],0,4);
    }
  }
  \$o['admin_pages']=\$admin;
  \$o['core_files']=array_map('basename', glob(\$dir.'includes/*.php'));
  \$o['core_root']=array_map('basename', glob(\$dir.'*.php'));
  // B. migraciju vieta - ar yra dbDelta / migration patternas
  \$mig=array();
  foreach(array_merge(glob(\$dir.'*.php'), glob(\$dir.'includes/*.php')) as \$f){
    \$c=file_get_contents(\$f);
    if(strpos(\$c,'dbDelta')!==false || strpos(\$c,'ALTER TABLE')!==false){ \$mig[]=basename(\$f); }
  }
  \$o['migration_files']=\$mig;
  // C. primary_need reiksmes DB (kas realiai saugoma)
  \$o['primary_need_values']=\$wpdb->get_results(\"SELECT primary_need v, COUNT(*) c FROM {\$wpdb->prefix}ps_pets WHERE deleted_at IS NULL GROUP BY primary_need ORDER BY c DESC\", ARRAY_A);
  \$o['sensitivities_sample']=\$wpdb->get_col(\"SELECT sensitivities FROM {\$wpdb->prefix}ps_pets WHERE sensitivities IS NOT NULL AND sensitivities<>'' LIMIT 10\");
  \$o['feeding_type_values']=\$wpdb->get_results(\"SELECT feeding_type v, COUNT(*) c FROM {\$wpdb->prefix}ps_pets WHERE deleted_at IS NULL GROUP BY feeding_type\", ARRAY_A);
  \$o['pets_total']=(int)\$wpdb->get_var(\"SELECT COUNT(*) FROM {\$wpdb->prefix}ps_pets WHERE deleted_at IS NULL\");
  // D. vartotojai kurie turi augintiniu (testiniu identifikavimui)
  \$o['users_with_pets']=\$wpdb->get_results(\"SELECT p.user_id, COUNT(*) pets, u.user_login, u.user_email, u.user_registered
    FROM {\$wpdb->prefix}ps_pets p LEFT JOIN {\$wpdb->users} u ON u.ID=p.user_id
    WHERE p.deleted_at IS NULL GROUP BY p.user_id ORDER BY pets DESC\", ARRAY_A);
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'AR (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_ar=Arx"',{maxBuffer:8e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('adminrec.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
