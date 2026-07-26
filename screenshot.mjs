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
  if(!isset(\$_GET['ps_ma']) || \$_GET['ps_ma']!=='APPLY_PN26') return;
  global \$wpdb; \$t=\$wpdb->prefix.'ps_pets'; \$b=\$wpdb->prefix.'ps_pets_bak_20260726'; \$o=array('zingsniai'=>array());

  // 1. BACKUP su struktura+indeksais
  \$orig_pries=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t");
  if(!\$wpdb->get_var("SHOW TABLES LIKE '\$b'")){
    \$wpdb->query("CREATE TABLE \$b LIKE \$t");
    \$wpdb->query("INSERT INTO \$b SELECT * FROM \$t");
    \$o['zingsniai'][]='backup sukurtas (LIKE + INSERT SELECT)';
  } else { \$o['zingsniai'][]='backup JAU BUVO - nekuriamas'; }
  \$bak_eil=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$b");
  \$o['backup_eilutes']=\$bak_eil; \$o['originalas_pries']=\$orig_pries;
  if(\$bak_eil !== \$orig_pries){
    \$o['NUTRAUKTA']='Backup eiluciu skaicius nesutampa - migracija NEVYKDOMA';
    header('Content-Type: application/json'); echo json_encode(\$o); exit;
  }
  \$o['zingsniai'][]='backup patikrintas: '.\$bak_eil.' = '.\$orig_pries;

  // 2. STULPELIAI
  \$cols=\$wpdb->get_col("SHOW COLUMNS FROM \$t");
  if(!in_array('primary_need_other',\$cols)){ \$wpdb->query("ALTER TABLE \$t ADD primary_need_other VARCHAR(150) NULL AFTER primary_need"); \$o['zingsniai'][]='pridetas primary_need_other'; }
  if(!in_array('is_test',\$cols)){ \$wpdb->query("ALTER TABLE \$t ADD is_test TINYINT(1) NOT NULL DEFAULT 0"); \$o['zingsniai'][]='pridetas is_test'; }

  // 3. UPDATE
  \$o['upd_is_test']=\$wpdb->query("UPDATE \$t SET is_test=1");
  \$o['upd_skin']=\$wpdb->query("UPDATE \$t SET primary_need='skin_coat' WHERE primary_need='skin_allergy'");
  \$o['upd_ster_yes']=\$wpdb->query("UPDATE \$t SET is_sterilised='yes' WHERE primary_need='sterilised' AND (is_sterilised IS NULL OR is_sterilised='' OR is_sterilised='unknown')");
  \$o['upd_ster_null']=\$wpdb->query("UPDATE \$t SET primary_need=NULL WHERE primary_need='sterilised'");
  \$o['upd_daily']=\$wpdb->query("UPDATE \$t SET primary_need=NULL WHERE primary_need='daily'");

  // 4. NEPRIKLAUSOMA VERIFIKACIJA
  \$v=array();
  \$v['originalas_eilutes']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t");
  \$v['backup_eilutes']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$b");
  \$v['is_test_1']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t WHERE is_test=1");
  \$v['is_test_0']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t WHERE is_test=0");
  // stulpeliu schema + default
  \$sch=\$wpdb->get_results("SELECT COLUMN_NAME,COLUMN_TYPE,IS_NULLABLE,COLUMN_DEFAULT FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{\$wpdb->prefix}ps_pets' AND COLUMN_NAME IN ('primary_need','primary_need_other','is_test')",ARRAY_A);
  \$v['schema']=\$sch;
  // senos reiksmes turi buti 0
  foreach(array('skin_allergy','daily','sterilised','none') as \$old){
    \$v['liko_'.\$old]=(int)\$wpdb->get_var(\$wpdb->prepare("SELECT COUNT(*) FROM \$t WHERE primary_need=%s",\$old));
  }
  // aktyvus pasiskirstymas
  \$v['aktyvus_primary_need']=\$wpdb->get_results("SELECT IFNULL(primary_need,'NULL') v,COUNT(*) c FROM \$t WHERE deleted_at IS NULL GROUP BY primary_need ORDER BY c DESC",ARRAY_A);
  // buve sterilised (is backup) - ar tebeturi is_sterilised=yes
  \$v['buve_sterilised_su_yes']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t o JOIN \$b bb ON bb.id=o.id WHERE bb.primary_need='sterilised' AND o.is_sterilised='yes'");
  \$v['buve_sterilised_viso']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$b WHERE primary_need='sterilised'");
  // NIEKAS KITAS nepakeista - NULL-safe palyginimas su backup
  \$diff=array();
  foreach(array('user_id','pet_name','species','species_detail','birth_date','life_stage','dog_size','is_sterilised','feeding_type','sensitivities','housing','current_food_brand','primary_product_id','photo_file_id','is_primary','status','created_at','deleted_at','current_weight_kg','activity_hint') as \$c2){
    \$n=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t o JOIN \$b bb ON bb.id=o.id WHERE NOT (o.\$c2 <=> bb.\$c2)");
    if(\$n>0) \$diff[\$c2]=\$n;
  }
  \$v['pakeisti_kiti_stulpeliai']=\$diff ? \$diff : 'NE - visi sutampa';
  // primary_need pokyciai (tikimasi tik laukiami)
  \$v['primary_need_pakeista']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t o JOIN \$b bb ON bb.id=o.id WHERE NOT (o.primary_need <=> bb.primary_need)");
  \$o['VERIFIKACIJA']=\$v;
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'MA (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,120);}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_ma=APPLY_PN26"',{maxBuffer:5e6,timeout:70000}).toString();
  const a=r.indexOf('{'),b2=r.lastIndexOf('}'); o.result=(a>=0&&b2>a)?JSON.parse(r.slice(a,b2+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('migapply.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
