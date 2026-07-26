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
  if(!isset($_GET['ps_pr2']) || $_GET['ps_pr2']!=='Pr2x') return;
  global $wpdb; $o=array();
  // VISI pa_ atributai kataloge (product attribute taxonomies)
  $taxes=$wpdb->get_results("SELECT tt.taxonomy, COUNT(DISTINCT tr.object_id) c
    FROM {$wpdb->term_taxonomy} tt
    JOIN {$wpdb->term_relationships} tr ON tr.term_taxonomy_id=tt.term_taxonomy_id
    JOIN {$wpdb->posts} p ON p.ID=tr.object_id AND p.post_type='product' AND p.post_status='publish'
    WHERE tt.taxonomy LIKE 'pa_%'
    GROUP BY tt.taxonomy ORDER BY c DESC", ARRAY_A);
  $o['pa_taxonomies']=array_map(function(\$t){return \$t['taxonomy'].' ['.\$t['c'].' prekiu]';}, \$taxes);
  // MVP scope: instock maisto prekes (feeding_map)
  \$fm=\$wpdb->prefix.'ps_feeding_map';
  \$o['maisto_su_lentele']=(int)\$wpdb->get_var("SELECT COUNT(DISTINCT product_id) FROM \$fm WHERE is_active=1");
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'PR2 (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_pr2=Pr2x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('profrec2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
