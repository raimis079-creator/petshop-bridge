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
  if(!isset(\$_GET['ps_md']) || \$_GET['ps_md']!=='Mdx') return;
  global \$wpdb; \$t=\$wpdb->prefix.'ps_pets'; \$o=array('mode'=>'DRY-RUN','changes'=>array());
  // esama busena
  \$cols=\$wpdb->get_col("SHOW COLUMNS FROM \$t");
  \$o['has_primary_need_other']=in_array('primary_need_other',\$cols);
  \$o['has_is_test']=in_array('is_test',\$cols);
  \$o['viso_pets']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t WHERE deleted_at IS NULL");
  \$o['viso_su_istrintais']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t");
  // 1. is_test
  \$o['changes']['is_test_1']=array('kiek'=>(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t"),'aprasas'=>'VISI irasai -> is_test=1 (launch dar nebuvo)');
  // 2. skin_allergy -> skin_coat
  \$o['changes']['skin_allergy']=array('kiek'=>(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t WHERE primary_need='skin_allergy'"),'aprasas'=>'skin_allergy -> skin_coat');
  // 3. sterilised SALYGINIS - parodom kiekviena irasa
  \$ster=\$wpdb->get_results("SELECT id,pet_name,species,is_sterilised FROM \$t WHERE primary_need='sterilised'",ARRAY_A);
  \$set_yes=0; \$palikti=0; \$det=array();
  foreach(\$ster as \$r){
    \$cur=\$r['is_sterilised'];
    \$veiksmas = (\$cur===null || \$cur==='' || \$cur==='unknown') ? 'is_sterilised -> yes' : 'is_sterilised NEKEICIAMAS (jau '.\$cur.')';
    if(strpos(\$veiksmas,'-> yes')!==false) \$set_yes++; else \$palikti++;
    \$det[]=array('id'=>\$r['id'],'vardas'=>\$r['pet_name'],'rusis'=>\$r['species'],'dabar_is_sterilised'=>\$cur,'veiksmas'=>\$veiksmas);
  }
  \$o['changes']['sterilised']=array('viso'=>count(\$ster),'nustatoma_yes'=>\$set_yes,'nekeiciama'=>\$palikti,'po_to'=>'primary_need -> NULL visiems','detales'=>\$det);
  // 4. daily -> NULL
  \$daily=\$wpdb->get_results("SELECT id,pet_name,species FROM \$t WHERE primary_need='daily'",ARRAY_A);
  \$o['changes']['daily']=array('kiek'=>count(\$daily),'aprasas'=>'daily -> NULL','detales'=>\$daily);
  // busena PO migracijos (simuliacija)
  \$o['po_migracijos_primary_need']=\$wpdb->get_results("SELECT
      CASE WHEN primary_need IN ('daily','sterilised') THEN 'NULL (isvalyta)'
           WHEN primary_need='skin_allergy' THEN 'skin_coat'
           WHEN primary_need IS NULL THEN 'NULL (neatsake)'
           ELSE primary_need END v, COUNT(*) c
    FROM \$t WHERE deleted_at IS NULL GROUP BY v ORDER BY c DESC",ARRAY_A);
  \$o['backup_pavadinimas']=\$wpdb->prefix.'ps_pets_bak_20260726';
  \$o['backup_jau_yra']=(bool)\$wpdb->get_var("SHOW TABLES LIKE '{\$wpdb->prefix}ps_pets_bak_20260726'");
  \$o['PASTABA']='NIEKAS NEPAKEISTA. Tai tik simuliacija.';
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'MD (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_md=Mdx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('migdry.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
