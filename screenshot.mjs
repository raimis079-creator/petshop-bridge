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
  if(!isset($_GET['ps_ft']) || $_GET['ps_ft']!=='Ftx') return;
  global $wpdb; $o=array();
  // Ontario Adult Large Chicken - randam ID
  $pid=$wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_title LIKE '%Ontario Adult Large Chicken%' LIMIT 1");
  $o['product_id']=$pid;
  if($pid){
    // feeding_map irasas
    $fm=$wpdb->prefix.'ps_feeding_map';
    $ftid=$wpdb->get_var($wpdb->prepare("SELECT feeding_table_id FROM {$fm} WHERE product_id=%d AND is_active=1 LIMIT 1",$pid));
    $o['feeding_table_id']=$ftid;
    // rasti serimo lenteles struktura - kur saugoma? spejam ps_feeding_tables ar panasu
    $tables=$wpdb->get_col("SHOW TABLES LIKE '%feeding%'");
    $o['feeding_tables']=$tables;
    // jei yra feeding table detales - kokias svorio zonas dengia
    if($ftid){
      // spejam struktura - ieskom lenteles su feeding rows
      foreach($tables as $tn){
        $cols=$wpdb->get_col("SHOW COLUMNS FROM $tn");
        if(in_array('weight_min_kg',$cols)||in_array('weight_kg',$cols)||in_array('svoris',$cols)||in_array('weight_from',$cols)){
          $o['data_table']=$tn; $o['data_cols']=$cols;
          // istraukiam eilutes siai lentelei
          $rows=$wpdb->get_results($wpdb->prepare("SELECT * FROM $tn WHERE feeding_table_id=%d OR table_id=%d LIMIT 30",$ftid,$ftid),ARRAY_A);
          if(!$rows){ $rows=$wpdb->get_results("SELECT * FROM $tn LIMIT 5",ARRAY_A); $o['note']='feeding_table_id filtras nepataiko, rodau bet kurias'; }
          $o['rows']=$rows;
          break;
        }
      }
    }
  }
  header('Content-Type: application/json'); echo json_encode($o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'FT (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_ft=Ftx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,400);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('ftcheck.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
