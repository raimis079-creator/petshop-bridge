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
  if(!isset(\$_GET['ps_tr']) || \$_GET['ps_tr']!=='Trx') return;
  global \$wpdb; \$o=array(); \$fm=\$wpdb->prefix.'ps_feeding_map';
  // KIEKVIENO pa_speciali_mityba termino produktu skaicius MAISTO scope (su feeding_map)
  \$rows=\$wpdb->get_results(\"SELECT t.name, t.slug, COUNT(DISTINCT fm.product_id) c
    FROM {\$wpdb->terms} t
    JOIN {\$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id AND tt.taxonomy='pa_speciali_mityba'
    JOIN {\$wpdb->term_relationships} tr ON tr.term_taxonomy_id=tt.term_taxonomy_id
    JOIN \$fm fm ON fm.product_id=tr.object_id AND fm.is_active=1
    GROUP BY t.term_id ORDER BY c DESC\", ARRAY_A);
  \$o['speciali_mityba_maiste']=\$rows;
  // tas pats be feeding_map filtro (visas katalogas) - palyginimui
  \$rows2=\$wpdb->get_results(\"SELECT t.name, tt.count c
    FROM {\$wpdb->terms} t JOIN {\$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id
    WHERE tt.taxonomy='pa_speciali_mityba' ORDER BY tt.count DESC\", ARRAY_A);
  \$o['speciali_mityba_katalogas']=\$rows2;
  // padalinta pagal rusi: kiek sunims / katems maisto scope
  \$o['pagal_rusi']=array();
  foreach(array('sunims','katems') as \$sp){
    \$r=\$wpdb->get_results(\$wpdb->prepare(\"SELECT t.name, COUNT(DISTINCT fm.product_id) c
      FROM {\$wpdb->terms} t
      JOIN {\$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id AND tt.taxonomy='pa_speciali_mityba'
      JOIN {\$wpdb->term_relationships} tr ON tr.term_taxonomy_id=tt.term_taxonomy_id
      JOIN \$fm fm ON fm.product_id=tr.object_id AND fm.is_active=1
      JOIN {\$wpdb->term_relationships} tr2 ON tr2.object_id=fm.product_id
      JOIN {\$wpdb->term_taxonomy} tt2 ON tt2.term_taxonomy_id=tr2.term_taxonomy_id AND tt2.taxonomy='pa_gyvuno_rusis'
      JOIN {\$wpdb->terms} t2 ON t2.term_id=tt2.term_id AND t2.slug=%s
      GROUP BY t.term_id ORDER BY c DESC\", \$sp), ARRAY_A);
    \$o['pagal_rusi'][\$sp]=\$r;
  }
  // ar yra 'isrankiam' panasus terminas kur nors
  \$o['isrankus_paieska']=\$wpdb->get_col(\"SELECT CONCAT(tt.taxonomy,' = ',t.name) FROM {\$wpdb->terms} t JOIN {\$wpdb->term_taxonomy} tt ON tt.term_id=t.term_id WHERE t.name LIKE '%rank%' OR t.name LIKE '%skon%'\");
  header('Content-Type: application/json'); echo json_encode(\$o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'TR (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_tr=Trx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,300);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('termrec.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
