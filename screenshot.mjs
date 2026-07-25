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
  if(!isset($_GET['ps_nc']) || $_GET['ps_nc']!=='Ncx') return;
  wp_set_current_user(1); $o=array();
  // asse kate = id 144 (admin primary). dashboard payload pet objektas
  $rq=new WP_REST_Request('GET'); $rq['id']=144;
  $res=Petshop_Pet_Dashboard::handle_dashboard($rq); $d=$res->get_data();
  $pet=$d['dashboard']['pet']??array();
  // istraukiam maisto laukus
  $o['state']=$d['dashboard']['state']??null;
  $o['pet_fields']=array(
    'primary_product_id'=>$pet['primary_product_id']??'NERA',
    'primary_product_name'=>$pet['primary_product_name']??'NERA',
    'primary_product_image'=>isset($pet['primary_product_image'])?(($pet['primary_product_image']?'YRA':'tuscia')):'NERA_RAKTO',
    'primary_product_package'=>$pet['primary_product_package']??'NERA',
    'current_food_brand'=>$pet['current_food_brand']??'NERA',
  );
  // DB tiksliai - ka turi ps_pets 144
  global $wpdb;
  $row=$wpdb->get_row("SELECT primary_product_id,primary_product_name,primary_product_package,current_food_brand FROM {$wpdb->prefix}ps_pets WHERE id=144",ARRAY_A);
  $o['db_row']=$row;
  // ar format_pet grazina primary_product_name
  $o['format_pet_keys']=array_keys($pet);
  header('Content-Type: application/json'); echo json_encode($o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'NC (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_nc=Ncx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('namecheck.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
