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
const CODE=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_vi2']) || $_GET['ps_vi2']!=='Vi224x') return;
  global $wpdb; $pf=$wpdb->prefix; $o=array();
  $r=Petshop_Feeding_Service::calc(array('product_id'=>16854,'weight_kg'=>20,'species_code'=>'dog'));
  $o['regres_calc']=array($r['status'],($r['norm_min_g']??null).'-'.($r['norm_max_g']??null));
  $dir=WP_PLUGIN_DIR.'/petshop-core/';
  $fj=file_get_contents($dir.'assets/pet-form.js');
  $o['js_bytes']=strlen($fj);
  $o['has_sensSummaryText']=strpos($fj,'function sensSummaryText')!==false;
  $o['has_openSavedProfile']=strpos($fj,'function openSavedProfile')!==false;
  $o['brace_balance']=substr_count($fj,'{')-substr_count($fj,'}');
  header('Content-Type: application/json');
  echo '###VISTART###'.json_encode($o).'###VIEND###';
  exit;
});
`;
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'VI2 (temp)',code:CODE,scope:'front-end',active:true,priority:5});
let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,150);}
execSync('sleep 4');
try{
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_vi2=Vi224x"',{maxBuffer:5e6,timeout:60000}).toString();
  const s=r.indexOf('###VISTART###'), e=r.indexOf('###VIEND###');
  o.raw_found = (s>=0 && e>s);
  o.ver = (s>=0&&e>s) ? r.slice(s+13,e) : r.slice(0,300);
}catch(e){o.ver='ERR '+String(e).slice(0,150);}
if(sid!==null){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('vi2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
