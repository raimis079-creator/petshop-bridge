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
  if(!isset($_GET['ps_rr']) || $_GET['ps_rr']!=='Rr25x') return;
  $dir=WP_PLUGIN_DIR.'/petshop-core/'; $o=array();
  // rasti kur registruojami pet REST endpointai (register_rest_route su petshop/v1)
  $found=null;
  foreach(array_merge(glob($dir.'includes/*.php'),glob(WPMU_PLUGIN_DIR.'/*.php')) as $f){
    $c=file_get_contents($f);
    if(strpos($c,'register_rest_route')!==false && (strpos($c,'pet-dashboard')!==false || strpos($c,'pet-profile')!==false || strpos($c,'reminders')!==false)){
      // istraukiam viena pilna endpoint registracija + permission + ownership pattern
      $p=strpos($c,'register_rest_route');
      $o['reg_file']=basename($f);
      $o['reg_sample']=mb_substr($c,$p,900);
      // ownership pattern - kaip tikrina pet_id priklauso useriui
      if(preg_match('/user_id\\s*=\\s*%d|WHERE\\s+user_id|current_user_id\\(\\)/i',$c)){
        $op=strpos($c,'get_current_user_id');
        $o['ownership_sample']=$op!==false?mb_substr($c,max(0,$op-150),400):'';
      }
      // permission_callback pattern
      if(preg_match('/[\\'\"]permission_callback[\\'\"]\\s*=>\\s*[^,]+/',$c,$pm)){
        $o['permission_pattern']=$pm[0];
      }
      // koks statusas grazinamas neautorizuotam
      break;
    }
  }
  // ar yra Petshop_Pet klase su pet ownership helper
  foreach(glob($dir.'includes/*.php') as $f){
    $c=file_get_contents($f);
    if(preg_match('/function\\s+(user_owns_pet|pet_belongs|owns_pet|verify_pet_owner|get_pet)[^{]*\\{/i',$c,$m)){
      $o['ownership_helper']=array('file'=>basename($f),'fn'=>$m[1]);
      break;
    }
  }
  header('Content-Type: application/json'); echo json_encode($o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'RR (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,100);}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_rr=Rr25x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,250);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('restrecon.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
