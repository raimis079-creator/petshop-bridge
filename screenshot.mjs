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
  if(!isset($_GET['ps_dv2']) || $_GET['ps_dv2']!=='Dv225x') return;
  global $wpdb; $pf=$wpdb->prefix;
  $t=$pf.'ps_pets';
  $cols=$wpdb->get_col("SHOW COLUMNS FROM $t");
  $all=$wpdb->get_results("SELECT * FROM $t ORDER BY pet_id DESC LIMIT 4", ARRAY_A);
  // Filtruoju rodent PHP puseje
  $rodents=array_filter($all, function($r){ return isset($r['species']) && $r['species']==='rodent'; });
  header('Content-Type: application/json');
  echo '###DS###'.json_encode(array('cols'=>$cols,'recent'=>array_map(function($r){return array('id'=>$r['pet_id']??null,'name'=>$r['pet_name']??null,'sp'=>$r['species']??null,'detail'=>$r['species_detail']??null,'bd'=>$r['birth_date']??null);}, $all))).'###DE###';
  exit;
});`;
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'DV2 (temp)',code:CODE,scope:'front-end',active:true,priority:5});
let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,120);}
execSync('sleep 4');
try{
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_dv2=Dv225x"',{maxBuffer:5e6,timeout:60000}).toString();
  const s=r.indexOf('###DS###'), e=r.indexOf('###DE###');
  o.data = (s>=0&&e>s) ? r.slice(s+8,e) : ('NF:'+r.slice(0,200));
}catch(e){o.data='ERR';}
if(sid!==null){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('dashver2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
