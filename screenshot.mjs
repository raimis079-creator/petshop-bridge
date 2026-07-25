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
  if(!isset($_GET['ps_fsh']) || $_GET['ps_fsh']!=='Fshx') return;
  $c=file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-pet-profile.php');
  $p=strpos($c,'food-search');
  // rasti handler pilna
  preg_match('/function\\s+([a-z_]*food[a-z_]*search[a-z_]*)\\s*\\([^)]*\\)\\s*\\{/i',$c,$m);
  $o=array();
  if(isset($m[0])){ $fp=strpos($c,$m[0]); $o['handler']=mb_substr($c,$fp,3000); }
  // testuojam ontario paieska su/be species
  wp_set_current_user(1);
  global $wpdb;
  $o['ontario_dog_tax']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT p.ID) FROM {$wpdb->posts} p JOIN {$wpdb->term_relationships} tr ON tr.object_id=p.ID JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$wpdb->terms} t ON t.term_id=tt.term_id WHERE p.post_type='product' AND p.post_status='publish' AND p.post_title LIKE '%ontario%' AND tt.taxonomy='pa_gyvuno_rusis' AND t.slug='sunims'");
  $o['ontario_visi']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_title LIKE '%ontario%'");
  // WP 's' search su ontario
  $q=new WP_Query(array('post_type'=>'product','post_status'=>'publish','s'=>'ontario','posts_per_page'=>20,'fields'=>'ids'));
  $o['wp_s_ontario_count']=$q->found_posts;
  header('Content-Type: application/json'); echo json_encode($o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'FSH (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_fsh=Fshx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,250);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('fshand.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
