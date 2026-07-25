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
  if(!isset($_GET['ps_cr']) || $_GET['ps_cr']!=='Crx') return;
  global $wpdb; $o=array();
  // Konkretus produktai: 1 skanestas (Denta Bits) ir 1 maistas (Ontario Adult)
  // Randam Denta Bits ID
  $denta=$wpdb->get_row("SELECT ID,post_title FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_title LIKE '%Denta Bits%' LIMIT 1");
  $ontario_food=$wpdb->get_row("SELECT ID,post_title FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_title LIKE '%Ontario Adult%' LIMIT 1");
  function terms_of($id){
    global $wpdb;
    // visos taksonomijos + terminai
    $rows=$wpdb->get_results($wpdb->prepare("SELECT tt.taxonomy,t.name,t.slug FROM {$wpdb->term_relationships} tr JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$wpdb->terms} t ON t.term_id=tt.term_id WHERE tr.object_id=%d ORDER BY tt.taxonomy",$id));
    $out=array();
    foreach($rows as $r){ $out[]=$r->taxonomy.' = '.$r->name.' ('.$r->slug.')'; }
    return $out;
  }
  if($denta){ $o['SKANESTAS_denta']=array('id'=>$denta->ID,'title'=>$denta->post_title,'terms'=>terms_of($denta->ID)); }
  if($ontario_food){ $o['MAISTAS_ontario']=array('id'=>$ontario_food->ID,'title'=>$ontario_food->post_title,'terms'=>terms_of($ontario_food->ID)); }
  // kokios product_cat kategorijos egzistuoja su 'maist' ar 'skan' pavadinime
  $cats=$wpdb->get_results("SELECT t.name,t.slug,tt.count FROM {$wpdb->terms} t JOIN {$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id WHERE tt.taxonomy='product_cat' AND (t.name LIKE '%maist%' OR t.name LIKE '%skan%' OR t.slug LIKE '%maist%' OR t.slug LIKE '%skan%') ORDER BY tt.count DESC");
  $o['maistas_skanestai_cats']=array_map(function($c){return $c->name.' ('.$c->slug.') ['.$c->count.']';}, $cats);
  header('Content-Type: application/json'); echo json_encode($o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'CR (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_cr=Crx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('catrecon.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
