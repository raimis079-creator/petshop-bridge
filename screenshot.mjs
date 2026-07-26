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
  if(!isset(\$_GET['ps_pv']) || \$_GET['ps_pv']!=='Pvx') return;
  wp_set_current_user(1); global \$wpdb; \$t=\$wpdb->prefix.'ps_pets'; \$o=array();
  // kodo markeriai
  \$d=WP_PLUGIN_DIR.'/petshop-core/';
  \$pr=file_get_contents(\$d.'includes/class-pet-profile.php'); \$pp=file_get_contents(\$d.'assets/pet-profile.js'); \$pf=file_get_contents(\$d.'assets/pet-form.js');
  \$o['enum_naujas']=(strpos(\$pr,"'skin_coat'")!==false && strpos(\$pr,"'weight_control'")!==false && strpos(\$pr,"'none'")!==false);
  \$o['enum_be_senu']=(strpos(\$pr,"'daily', 'digestion'")===false);
  \$o['form_needField']=strpos(\$pf,'function needField()')!==false;
  \$o['profile_needDetail']=strpos(\$pp,'function needDetailText')!==false;
  // 1. CREATE su other + HTML
  \$rq=new WP_REST_Request('POST');
  \$rq->set_body_params(array('species'=>'dog','pet_name'=>'ZZTEST','primary_need'=>'other','primary_need_other'=>'<b>dantu</b> akmenys'));
  \$res=Petshop_Pet_Profile::handle_create(\$rq);
  \$dd=is_wp_error(\$res)?array('err'=>\$res->get_error_message()):\$res->get_data();
  \$pid=null;
  if(isset(\$dd['pet']['pet_id'])) \$pid=\$dd['pet']['pet_id'];
  elseif(isset(\$dd['pet_id'])) \$pid=\$dd['pet_id'];
  elseif(isset(\$dd['pet']['id'])) \$pid=\$dd['pet']['id'];
  \$o['test_pet_id']=\$pid;
  if(!\$pid){ \$o['create_atsakymas']=\$dd; }
  if(\$pid){
    \$o['T1_create']=\$wpdb->get_row(\$wpdb->prepare("SELECT primary_need,primary_need_other,is_test FROM \$t WHERE id=%d",\$pid),ARRAY_A);
    // 2. -> joints (tekstas turi isivalyti)
    \$r2=new WP_REST_Request('POST'); \$r2['id']=\$pid; \$r2->set_body_params(array('primary_need'=>'joints'));
    Petshop_Pet_Profile::handle_update(\$r2);
    \$o['T2_joints']=\$wpdb->get_row(\$wpdb->prepare("SELECT primary_need,primary_need_other FROM \$t WHERE id=%d",\$pid),ARRAY_A);
    // 3. -> none
    \$r3=new WP_REST_Request('POST'); \$r3['id']=\$pid; \$r3->set_body_params(array('primary_need'=>'none','primary_need_other'=>'neturetu likti'));
    Petshop_Pet_Profile::handle_update(\$r3);
    \$o['T3_none']=\$wpdb->get_row(\$wpdb->prepare("SELECT primary_need,primary_need_other FROM \$t WHERE id=%d",\$pid),ARRAY_A);
    // 4. sena reiksme 'daily' turi buti ATMESTA
    \$r4=new WP_REST_Request('POST'); \$r4['id']=\$pid; \$r4->set_body_params(array('primary_need'=>'daily'));
    Petshop_Pet_Profile::handle_update(\$r4);
    \$o['T4_sena_daily']=\$wpdb->get_var(\$wpdb->prepare("SELECT primary_need FROM \$t WHERE id=%d",\$pid));
    // 5. other be teksto - turi islikti 'other'
    \$r5=new WP_REST_Request('POST'); \$r5['id']=\$pid; \$r5->set_body_params(array('primary_need'=>'other'));
    Petshop_Pet_Profile::handle_update(\$r5);
    \$o['T5_other_be_teksto']=\$wpdb->get_row(\$wpdb->prepare("SELECT primary_need,primary_need_other FROM \$t WHERE id=%d",\$pid),ARRAY_A);
    // isvalom
    \$wpdb->delete(\$t,array('id'=>\$pid)); \$o['testinis_istrintas']=true;
  }
  // naujas irasas turi buti is_test=0 (default)
  \$o['esami_is_test_1']=(int)\$wpdb->get_var("SELECT COUNT(*) FROM \$t WHERE is_test=1");
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'PV (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_pv=Pvx"',{maxBuffer:5e6,timeout:70000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,400);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('pnver.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
