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
  if(!isset(\$_GET['ps_pr3']) || \$_GET['ps_pr3']!=='Pr3x') return;
  global \$wpdb; \$o=array(); \$fm=\$wpdb->prefix.'ps_feeding_map';
  // padengimas TIK 528 maisto scope (su feeding_map is_active=1)
  function cov(\$tax){
    global \$wpdb; \$fm=\$wpdb->prefix.'ps_feeding_map';
    return (int)\$wpdb->get_var(\"SELECT COUNT(DISTINCT fm.product_id) FROM \$fm fm
      JOIN {\$wpdb->term_relationships} tr ON tr.object_id=fm.product_id
      JOIN {\$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id
      WHERE fm.is_active=1 AND tt.taxonomy='\$tax'\");
  }
  \$o['scope_total']=(int)\$wpdb->get_var(\"SELECT COUNT(DISTINCT product_id) FROM \$fm WHERE is_active=1\");
  foreach(array('pa_gyvuno_rusis','pa_amzius','pa_dydis','pa_baltymu_saltinis','pa_be_grudu','pa_monoprotein','pa_speciali_mityba','pa_tipas','pa_zuvies_rusis') as \$t){
    \$o['cov_'.\$t]=cov(\$t);
  }
  // pa_speciali_mityba terminai (medicininiai)
  \$o['speciali_mityba_terms']=\$wpdb->get_col(\"SELECT t.name FROM {\$wpdb->terms} t JOIN {\$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id WHERE tt.taxonomy='pa_speciali_mityba' ORDER BY tt.count DESC\");
  // pa_be_grudu terminai
  \$o['be_grudu_terms']=\$wpdb->get_col(\"SELECT t.name FROM {\$wpdb->terms} t JOIN {\$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id WHERE tt.taxonomy='pa_be_grudu'\");
  // pa_baltymu_saltinis terminai (top)
  \$o['baltymai_terms']=\$wpdb->get_col(\"SELECT t.name FROM {\$wpdb->terms} t JOIN {\$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id WHERE tt.taxonomy='pa_baltymu_saltinis' ORDER BY tt.count DESC LIMIT 20\");
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'PR3 (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_pr3=Pr3x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('profrec3.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
