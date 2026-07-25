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
  if(!isset($_GET['ps_fst']) || $_GET['ps_fst']!=='Fstx') return;
  wp_set_current_user(1); $o=array();
  // A: dabartinis args (s + tax_query, posts_per_page 6)
  $qa=new WP_Query(array('post_type'=>'product','post_status'=>'publish','s'=>'ontario','posts_per_page'=>6,'no_found_rows'=>true,
    'tax_query'=>array(array('taxonomy'=>'pa_gyvuno_rusis','field'=>'slug','terms'=>array('sunims'),'operator'=>'IN'))));
  $o['A_s_plus_tax']=array('count'=>count($qa->posts),'titles'=>array_map(function($p){return $p->post_title;},array_slice($qa->posts,0,8)));
  // B: post_title LIKE vietoj s + tax_query, posts_per_page 12
  \$titles=\$GLOBALS['wpdb']->get_col(\$GLOBALS['wpdb']->prepare(
    "SELECT p.post_title FROM {\$GLOBALS['wpdb']->posts} p 
     JOIN {\$GLOBALS['wpdb']->term_relationships} tr ON tr.object_id=p.ID
     JOIN {\$GLOBALS['wpdb']->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id
     JOIN {\$GLOBALS['wpdb']->terms} t ON t.term_id=tt.term_id
     WHERE p.post_type='product' AND p.post_status='publish' AND p.post_title LIKE %s
     AND tt.taxonomy='pa_gyvuno_rusis' AND t.slug='sunims' LIMIT 12", '%ontario%'));
  \$o['B_title_like_tax']=array('count'=>count(\$titles),'titles'=>array_slice(\$titles,0,10));
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'FST (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_fst=Fstx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,250);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('fstest.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
